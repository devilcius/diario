from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EntryViewSet, EntryCalendarView

router = DefaultRouter()
router.register(r"entries", EntryViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("entry-dates/", EntryCalendarView.as_view(), name="entry-calendar"),
]
