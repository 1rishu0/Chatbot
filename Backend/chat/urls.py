from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet, health_check

router = DefaultRouter()
router.register(r"conversations", ConversationViewSet, basename="conversation")

urlpatterns = [
    path("health/", health_check),
    *router.urls,
]