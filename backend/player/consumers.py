"""
One consumer instance per connected browser tab. All tabs in the same lobby
share one GameRoom (in ROOMS, keyed by lobby code) and join the same Channels
group, so channel_layer.group_send() fans a single state snapshot out to
everyone at once - that's what keeps both screens identical.

IMPORTANT DEPLOYMENT NOTE: ROOMS is a plain in-process dict. That's fine for a
single ASGI worker process (e.g. `daphne -b 0.0.0.0 -p 8001 backend.asgi:application`
with one process, which is plenty for a small self-hosted game). If you scale
to multiple worker processes/machines behind a load balancer, two players in
the same lobby could land on different processes and each get their own
GameRoom - i.e. the exact desync bug you're trying to fix, just moved to the
server. Either pin a lobby's connections to one process (sticky routing on
lobby code), or move GameRoom+the tick loop into a separate single-process
worker service that all API/ASGI processes talk to over the channel layer.
For one VPS running a single daphne process, you don't need to do anything.
"""
import asyncio
import time

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .engine import GameRoom
from .models import Lobby, LobbySeat, Match, MatchPlayer, PlayerProfile

ROOMS: dict[str, GameRoom] = {}
TICK_DT = 1 / 30  # server simulation rate


class GameConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.code = self.scope['url_route']['kwargs']['code'].upper()
        self.group = f'lobby_{self.code}'

        if self.user is None or self.user.is_anonymous:
            await self.close(code=4001)  # not authenticated
            return

        self.lobby = await self._get_lobby(self.code)
        if self.lobby is None:
            await self.close(code=4004)  # no such lobby
            return

        self.seat_index = await self._get_or_assign_seat(self.lobby, self.user)
        if self.seat_index is None:
            await self.close(code=4003)  # lobby full
            return

        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

        room = ROOMS.setdefault(self.code, GameRoom(self.code))
        room.add_player(self.seat_index, self.user.username)

        # tell this client which seat is theirs (drives the camera rotation)
        await self.send_json({'type': 'welcome', 'seat': self.seat_index, 'hostSeat': room.host_seat})
        await self._broadcast_lobby(room)

    async def disconnect(self, close_code):
        room = ROOMS.get(self.code)
        if room:
            room.remove_player(self.seat_index)
            if room.mode == 'lobby':
                await self._broadcast_lobby(room)
            if not room.players:
                ROOMS.pop(self.code, None)
        await self.channel_layer.group_discard(self.group, self.channel_name)

    async def receive_json(self, content, **kwargs):
        room = ROOMS.get(self.code)
        if room is None:
            return
        msg_type = content.get('type')

        if msg_type == 'start_game' and room.mode == 'lobby':
            if self.seat_index != room.host_seat:
                return
            if len(room.players) < 2:
                return
            room.start()
            await self._set_lobby_status('playing')
            await self.channel_layer.group_send(self.group, {'type': 'game_started'})
            asyncio.ensure_future(self._run_loop(room))

        elif msg_type == 'action' and room.mode == 'playing':
            # seat comes from the authenticated connection, NOT from the
            # message body - a client can only ever act on its own castle.
            room.handle_action(self.seat_index, content.get('action'), content.get('unit'))

    # ---------------- authoritative loop ----------------
    async def _run_loop(self, room):
        next_tick = time.monotonic()
        while room.mode == 'playing':
            room.step(TICK_DT)
            await self.channel_layer.group_send(self.group, {'type': 'game_state', 'state': room.snapshot()})

            if room.winner is not None:
                room.mode = 'over'
                await self._save_match_result(room)
                await self.channel_layer.group_send(self.group, {'type': 'game_over', 'state': room.snapshot()})
                break

            next_tick += TICK_DT
            await asyncio.sleep(max(0.0, next_tick - time.monotonic()))

    # ---------------- group event handlers -> send to this socket ----------------
    async def game_state(self, event):
        await self.send_json({'type': 'state', 'state': event['state']})

    async def game_over(self, event):
        await self.send_json({'type': 'over', 'state': event['state']})

    async def game_started(self, event):
        await self.send_json({'type': 'started'})

    async def lobby_state(self, event):
        await self.send_json({'type': 'lobby', 'players': event['players']})

    async def _broadcast_lobby(self, room):
        await self.channel_layer.group_send(self.group, {'type': 'lobby_state', 'players': room.lobby_summary()})

    # ---------------- DB access ----------------
    @database_sync_to_async
    def _get_lobby(self, code):
        return Lobby.objects.filter(code=code).first()

    @database_sync_to_async
    def _get_or_assign_seat(self, lobby, user):
        seat = LobbySeat.objects.filter(lobby=lobby, user=user).first()
        if seat:
            return seat.seat_index
        taken = set(lobby.seats.values_list('seat_index', flat=True))
        free = next((i for i in range(lobby.max_players) if i not in taken), None)
        if free is None:
            return None
        LobbySeat.objects.create(lobby=lobby, seat_index=free, user=user)
        return free

    @database_sync_to_async
    def _set_lobby_status(self, status):
        Lobby.objects.filter(code=self.code).update(status=status)

    @database_sync_to_async
    def _save_match_result(self, room):
        lobby = Lobby.objects.get(code=self.code)
        match = Match.objects.create(lobby=lobby, duration_seconds=room.time)
        for seat_idx in room.players:
            seat = LobbySeat.objects.filter(lobby=lobby, seat_index=seat_idx).first()
            if not seat:
                continue
            placement = room.placement_of(seat_idx)
            MatchPlayer.objects.create(match=match, user=seat.user, seat_index=seat_idx, placement=placement)
            profile, _ = PlayerProfile.objects.get_or_create(user=seat.user)
            profile.games_played += 1
            if seat_idx == room.winner:
                match.winner = seat.user
                profile.wins += 1
            else:
                profile.losses += 1
            profile.save()
        match.save()
        lobby.status = 'finished'
        lobby.save()