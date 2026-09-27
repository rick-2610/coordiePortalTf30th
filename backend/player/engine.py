"""
Server-authoritative port of the Four Keeps simulation.

This is a direct translation of the original client-side step()/updateUnit()/
combat functions from Four_Keeps.html. The ONLY thing that changed on purpose:
bot AI and the pause button are gone (multiplayer has neither).

Why this file exists at all: the reason your two devices drifted apart is that
each browser was running its own independent copy of the simulation. Two
independent simulations WILL diverge (random(), frame timing, float rounding).
This module is the single copy of the simulation. It runs once, here, on the
server. Clients never simulate - they only render whatever snapshot() sends
them. That's what actually guarantees both screens match.
"""
import math
import random

W = 900
HW, HD = 170, 48
CASTLE_HP, CASTLE_RANGE, CASTLE_DMG, CASTLE_CD = 1500, 150, 12, 0.8
GOLD_CAP, BASE_INCOME, MINE_BONUS, MINE_R, LOOT, LEADER_BONUS = 500, 5, 4, 58, 150, 1.15

# Seat 0..3 clockwise from the bottom. `ang` rotates a castle's local frame
# (local +y = "into the board") into world space. The client uses this same
# table to rotate the camera so *your* seat always renders at the bottom.
SEATS = [
    {'name': 'South', 'cx': 450, 'cy': 852, 'ang': 0},
    {'name': 'West', 'cx': 48, 'cy': 450, 'ang': math.pi / 2},
    {'name': 'North', 'cx': 450, 'cy': 48, 'ang': math.pi},
    {'name': 'East', 'cx': 852, 'cy': 450, 'ang': -math.pi / 2},
]

UNIT_ORDER = ['knight', 'archer', 'catapult']
TYPES = {
    'knight':   {'hp': 110, 'speed': 38, 'dmg': 11, 'cd': .8, 'range': 6, 'cost': 25, 'r': 7, 'sight': 85, 'castleMult': 1},
    'archer':   {'hp': 55, 'speed': 46, 'dmg': 8, 'cd': .65, 'range': 88, 'cost': 30, 'r': 6, 'sight': 115, 'castleMult': .6},
    'catapult': {'hp': 80, 'speed': 22, 'dmg': 32, 'cd': 2.4, 'range': 140, 'minRange': 38, 'cost': 55, 'r': 9,
                 'sight': 150, 'castleMult': 2.5, 'splash': 30},
}
# attacker type -> defender type -> damage multiplier (knight > archer > catapult > knight)
MULT = {'knight': {'archer': 2}, 'archer': {'catapult': 2}, 'catapult': {'knight': 2}}


def clamp(v, a, b):
    return max(a, min(b, v))


def to_world(seat, lx, ly):
    c, n = math.cos(seat['ang']), math.sin(seat['ang'])
    return seat['cx'] + lx * c - ly * n, seat['cy'] + lx * n + ly * c


def to_local(seat, x, y):
    dx, dy = x - seat['cx'], y - seat['cy']
    c, n = math.cos(seat['ang']), math.sin(seat['ang'])
    return dx * c + dy * n, -dx * n + dy * c


def rect_dist(seat, x, y):
    lx, ly = to_local(seat, x, y)
    return math.hypot(max(abs(lx) - HW, 0), max(abs(ly) - HD, 0))


class Player:
    def __init__(self, seat_index, name):
        self.id = seat_index
        self.name = name
        self.seat = SEATS[seat_index]
        self.gold = 100
        self.target = (seat_index + 2) % 4
        self.hp = CASTLE_HP
        self.alive = True
        self.flash = 0.0
        self.fire_cd = 0.0
        self.last_attacker = -1
        self.last_hit_at = -99
        self.spawn_cd = 0.0
        self.income = BASE_INCOME
        self.connected = True

    def to_dict(self):
        return {
            'seat': self.id, 'name': self.name, 'gold': round(self.gold, 1),
            'target': self.target, 'hp': round(self.hp, 1), 'alive': self.alive,
            'flash': round(self.flash, 2), 'income': self.income, 'connected': self.connected,
        }


class GameRoom:
    """One instance per lobby code. mode: 'lobby' -> 'playing' -> 'over'."""

    def __init__(self, code):
        self.code = code
        self.players = {}   # seat_index -> Player, only OCCUPIED seats exist here
        self.units = []      # list of dicts
        self.proj = []       # catapult shots in flight
        self.banners = []
        self.order = []      # elimination order
        self.winner = None
        self.leader = -1
        self.mine_owner = -1
        self.time = 0.0
        self.next_id = 1
        self.mode = 'lobby'
        self.host_seat = None
        self._rng = random.Random()

    # ---------------- lobby ----------------
    def add_player(self, seat_index, name):
        if self.host_seat is None:
            self.host_seat = seat_index
        p = self.players.get(seat_index)
        if p:
            p.connected = True
            p.name = name
        else:
            self.players[seat_index] = Player(seat_index, name)

    def remove_player(self, seat_index):
        p = self.players.get(seat_index)
        if not p:
            return
        p.connected = False
        if self.mode == 'lobby':
            # not started yet - free the seat entirely
            self.players.pop(seat_index, None)
        # if mode == 'playing': leave the castle in place, connected=False.
        # Their existing units keep fighting on their own (same as when the
        # original game's units act autonomously between clicks); they just
        # can't spawn anything new until they reconnect.

    def lobby_summary(self):
        return [{'seat': s, 'name': p.name, 'connected': p.connected}
                for s, p in sorted(self.players.items())]

    def start(self):
        self.mode = 'playing'

    # ---------------- helpers ----------------
    def alive_seats(self):
        return [s for s, p in self.players.items() if p.alive]

    def next_target(self, p):
        for k in range(1, 4):
            sid = (p.target + k) % 4
            q = self.players.get(sid)
            if sid != p.id and q and q.alive:
                return sid
        return p.target

    def spawn_unit(self, p, utype):
        T = TYPES[utype]
        if not p.alive or p.spawn_cd > 0 or p.gold < T['cost']:
            return False
        p.gold -= T['cost']
        p.spawn_cd = .22
        wx, wy = to_world(p.seat, self._rng.uniform(-140, 140), -HD - 12)
        self.units.append({
            'id': self.next_id, 'owner': p.id, 'type': utype, 'x': wx, 'y': wy,
            'hp': T['hp'], 'maxHp': T['hp'], 'cd': self._rng.uniform(0, .3),
            'r': T['r'], 'face': 0.0, 'off': self._rng.uniform(-60, 60), 'dead': False,
        })
        self.next_id += 1
        return True

    def handle_action(self, seat_index, action, unit_type):
        """The ONLY entry point for player input. Called from the consumer,
        never trusts anything from the client except 'this seat wants to do
        X' - the seat itself comes from the authenticated connection, not
        from the message body, so nobody can act on someone else's castle."""
        p = self.players.get(seat_index)
        if not p or not p.alive or self.mode != 'playing':
            return
        if action == 'spawn' and unit_type in TYPES:
            self.spawn_unit(p, unit_type)
        elif action == 'target':
            p.target = self.next_target(p)

    # ---------------- combat ----------------
    def hit_unit(self, o, att_type, base):
        if o['dead']:
            return
        d = base * MULT.get(att_type, {}).get(o['type'], 1)
        if o['owner'] == self.leader:
            d *= LEADER_BONUS
        o['hp'] -= d
        if o['hp'] <= 0:
            o['dead'] = True

    def hit_castle(self, ci, owner_id, att_type, base):
        p = self.players.get(ci)
        if not p or not p.alive:
            return
        d = base * TYPES.get(att_type, {}).get('castleMult', 1)
        if ci == self.leader:
            d *= LEADER_BONUS
        p.hp -= d
        p.flash = .12
        p.last_attacker = owner_id
        p.last_hit_at = self.time
        if p.hp <= 0:
            self.eliminate(ci, owner_id)

    def banner(self, text, color_seat):
        self.banners.append({'text': text, 'colorSeat': color_seat, 't': 5})
        if len(self.banners) > 3:
            self.banners.pop(0)

    def eliminate(self, ci, killer_id):
        p = self.players[ci]
        p.alive = False
        p.hp = 0
        self.order.append(ci)
        k = self.players.get(killer_id)
        if k and k.alive:
            k.gold = min(GOLD_CAP, k.gold + LOOT)
        for u in self.units:
            if u['owner'] == ci and not u['dead']:
                u['dead'] = True
        kname = k.name if k else '?'
        self.banner(f"{p.name}'s keep has fallen to {kname}! (+{LOOT} gold)", killer_id)
        alive = self.alive_seats()
        if len(alive) == 1:
            self.winner = alive[0]

    def fire_at_unit(self, u, o):
        T = TYPES[u['type']]
        u['cd'] = T['cd']
        u['face'] = math.atan2(o['y'] - u['y'], o['x'] - u['x'])
        if u['type'] == 'knight':
            self.hit_unit(o, 'knight', T['dmg'])
        elif u['type'] == 'archer':
            self.hit_unit(o, 'archer', T['dmg'])
        else:
            d = math.hypot(o['x'] - u['x'], o['y'] - u['y'])
            self.proj.append({'sx': u['x'], 'sy': u['y'], 'tx': o['x'], 'ty': o['y'],
                               't': 0.0, 'dur': .5 + d / 380, 'owner': u['owner'],
                               'dmg': T['dmg'], 'castle': -1})

    def fire_at_castle(self, u, ci):
        T = TYPES[u['type']]
        c = self.players[ci]
        u['cd'] = T['cd']
        lx, ly = to_local(c.seat, u['x'], u['y'])
        nx, ny = to_world(c.seat, clamp(lx, -HW, HW), clamp(ly, -HD, HD))
        u['face'] = math.atan2(ny - u['y'], nx - u['x'])
        if u['type'] == 'knight':
            self.hit_castle(ci, u['owner'], 'knight', T['dmg'])
        elif u['type'] == 'archer':
            self.hit_castle(ci, u['owner'], 'archer', T['dmg'])
        else:
            d = math.hypot(nx - u['x'], ny - u['y'])
            self.proj.append({'sx': u['x'], 'sy': u['y'], 'tx': nx, 'ty': ny,
                               't': 0.0, 'dur': .5 + d / 380, 'owner': u['owner'],
                               'dmg': T['dmg'], 'castle': ci})

    def move_toward(self, u, tx, ty, dt, T):
        dx, dy = tx - u['x'], ty - u['y']
        d = math.hypot(dx, dy) or 1
        m = min(T['speed'] * dt, d)
        u['face'] = math.atan2(dy, dx)
        u['x'] += dx / d * m
        u['y'] += dy / d * m

    def update_unit(self, u, dt):
        T = TYPES[u['type']]
        me = self.players[u['owner']]
        u['cd'] -= dt
        bu, bs = None, 1e9
        for o in self.units:
            if o['dead'] or o['owner'] == u['owner']:
                continue
            d = math.hypot(o['x'] - u['x'], o['y'] - u['y'])
            if d > T['sight']:
                continue
            gap = d - u['r'] - o['r']
            if u['type'] == 'catapult' and (gap > T['range'] or gap < T.get('minRange', 0)):
                continue
            s = d - (40 if MULT.get(u['type'], {}).get(o['type']) else 0)
            if s < bs:
                bs, bu = s, o
        tc = me.target
        castle = self.players.get(tc)
        in_castle = bool(castle) and castle.alive and tc != u['owner'] and \
            rect_dist(castle.seat, u['x'], u['y']) <= T['range'] + u['r'] + .5
        moving = True
        if u['type'] == 'catapult':
            if in_castle:
                moving = False
                if u['cd'] <= 0:
                    self.fire_at_castle(u, tc)
            elif bu and u['cd'] <= 0:
                self.fire_at_unit(u, bu)
        elif bu:
            gap = math.hypot(bu['x'] - u['x'], bu['y'] - u['y']) - u['r'] - bu['r']
            moving = False
            if gap <= T['range']:
                u['face'] = math.atan2(bu['y'] - u['y'], bu['x'] - u['x'])
                if u['cd'] <= 0:
                    self.fire_at_unit(u, bu)
            else:
                self.move_toward(u, bu['x'], bu['y'], dt, T)
        elif in_castle:
            moving = False
            if u['cd'] <= 0:
                self.fire_at_castle(u, tc)
        if moving and castle and castle.alive:
            lx, ly = to_local(castle.seat, u['x'], u['y'])
            nx, ny = clamp(lx, -HW, HW), clamp(ly, -HD, HD)
            if ly < -HD:
                nx = clamp(lx + u['off'], -150, 150)
            wx, wy = to_world(castle.seat, nx, ny)
            self.move_toward(u, wx, wy, dt, T)

    def step(self, dt):
        if self.mode != 'playing' or self.winner is not None:
            return
        self.time += dt
        for b in self.banners:
            b['t'] -= dt
        self.banners = [b for b in self.banners if b['t'] > 0]

        # mine control: most units inside wins it (ties = nobody)
        cnt = [0, 0, 0, 0]
        for u in self.units:
            if not u['dead'] and math.hypot(u['x'] - 450, u['y'] - 450) <= MINE_R + u['r']:
                cnt[u['owner']] += 1
        mo, mx, sec = -1, 0, 0
        for i in range(4):
            if cnt[i] > mx:
                sec, mx, mo = mx, cnt[i], i
            elif cnt[i] > sec:
                sec = cnt[i]
        self.mine_owner = mo if (mx > 0 and mx > sec) else -1

        # underdog rule: a clear leader takes extra damage
        alive = [p for p in self.players.values() if p.alive]
        self.leader = -1
        if len(alive) >= 3:
            s = sorted(alive, key=lambda p: -p.hp)
            if s[0].hp >= s[1].hp * 1.15:
                self.leader = s[0].id

        for p in self.players.values():
            if not p.alive:
                continue
            p.income = BASE_INCOME + (MINE_BONUS if self.mine_owner == p.id else 0)
            p.gold = min(GOLD_CAP, p.gold + p.income * dt)
            p.spawn_cd -= dt
            p.flash = max(0.0, p.flash - dt)
            if p.target == p.id or p.target not in self.players or not self.players[p.target].alive:
                p.target = self.next_target(p)

        for u in self.units:
            if not u['dead']:
                self.update_unit(u, dt)

        # separation between units
        us = self.units
        for i in range(len(us)):
            a = us[i]
            if a['dead']:
                continue
            for j in range(i + 1, len(us)):
                b = us[j]
                if b['dead']:
                    continue
                dx, dy = b['x'] - a['x'], b['y'] - a['y']
                m = a['r'] + b['r']
                if abs(dx) > m or abs(dy) > m:
                    continue
                d2 = dx * dx + dy * dy
                if 0.0001 < d2 < m * m:
                    d = math.sqrt(d2)
                    push = (m - d) / 2
                    nx, ny = dx / d, dy / d
                    a['x'] -= nx * push
                    a['y'] -= ny * push
                    b['x'] += nx * push
                    b['y'] += ny * push

        # keep units out of castle rectangles, clamp to board
        for u in us:
            if u['dead']:
                continue
            for p in self.players.values():
                if not p.alive:
                    continue
                lx, ly = to_local(p.seat, u['x'], u['y'])
                px, py = HW + u['r'] - abs(lx), HD + u['r'] - abs(ly)
                if px > 0 and py > 0:
                    nx, ny = lx, ly
                    if px < py:
                        nx = math.copysign(HW + u['r'], lx or 1)
                    else:
                        ny = math.copysign(HD + u['r'], ly or -1)
                    wx, wy = to_world(p.seat, nx, ny)
                    u['x'], u['y'] = wx, wy
            u['x'] = clamp(u['x'], u['r'], W - u['r'])
            u['y'] = clamp(u['y'], u['r'], W - u['r'])

        # castle defences
        for p in self.players.values():
            if not p.alive:
                continue
            p.fire_cd -= dt
            if p.fire_cd > 0:
                continue
            best, bd = None, 1e9
            for u in self.units:
                if u['dead'] or u['owner'] == p.id:
                    continue
                d = rect_dist(p.seat, u['x'], u['y']) - u['r']
                if d <= CASTLE_RANGE and d < bd:
                    bd, best = d, u
            if best:
                p.fire_cd = CASTLE_CD
                self.hit_unit(best, 'castle', CASTLE_DMG)

        # catapult shots landing
        for pr in self.proj:
            pr['t'] += dt / pr['dur']
            if pr['t'] >= 1:
                pr['done'] = True
                if pr['castle'] >= 0:
                    self.hit_castle(pr['castle'], pr['owner'], 'catapult', pr['dmg'])
                else:
                    for o in self.units:
                        if not o['dead'] and o['owner'] != pr['owner'] and \
                                math.hypot(o['x'] - pr['tx'], o['y'] - pr['ty']) <= TYPES['catapult']['splash'] + o['r']:
                            self.hit_unit(o, 'catapult', pr['dmg'])
        self.proj = [p for p in self.proj if not p.get('done')]
        self.units = [u for u in self.units if not u['dead']]

    def placement_of(self, seat_index):
        if seat_index == self.winner:
            return 1
        if seat_index in self.order:
            return list(reversed(self.order)).index(seat_index) + 2
        return None

    def snapshot(self):
        """Everything a client needs to render one frame. Sent every tick."""
        return {
            'time': round(self.time, 1),
            'mode': self.mode,
            'winner': self.winner,
            'mineOwner': self.mine_owner,
            'leader': self.leader,
            'players': [p.to_dict() for p in self.players.values()],
            'units': [
                {'id': u['id'], 'owner': u['owner'], 'type': u['type'],
                 'x': round(u['x'], 1), 'y': round(u['y'], 1),
                 'hp': round(u['hp'], 1), 'maxHp': u['maxHp'], 'face': round(u['face'], 2)}
                for u in self.units
            ],
            'proj': [
                {'sx': round(p['sx'], 1), 'sy': round(p['sy'], 1),
                 'tx': round(p['tx'], 1), 'ty': round(p['ty'], 1),
                 't': round(p['t'], 2), 'castle': p['castle']}
                for p in self.proj
            ],
            'banners': self.banners,
        }