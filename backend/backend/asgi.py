# """
# ASGI config for backend project.

# It exposes the ASGI callable as a module-level variable named ``application``.

# For more information on this file, see
# https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
# """

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# application = get_asgi_application()

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # match your project package name
django_asgi_app = get_asgi_application()  # must be created before importing anything that touches models

from channels.routing import ProtocolTypeRouter, URLRouter          # noqa: E402
from channels.security.websocket import AllowedHostsOriginValidator  # noqa: E402

from player import routing                                             # noqa: E402
from player.middleware import JwtAuthMiddleware                        # noqa: E402

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AllowedHostsOriginValidator(
        JwtAuthMiddleware(URLRouter(routing.websocket_urlpatterns))
    ),
})