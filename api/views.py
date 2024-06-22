from rest_framework import viewsets
from .models import Entry
from .serializers import EntrySerializer, EntryDateSerializer
from .filters import EntryFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from django.utils import timezone


class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all().order_by("-entry_date")
    serializer_class = EntrySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EntryFilter
    permission_classes = [IsAuthenticated]


class EntryCalendarView(generics.ListAPIView):
    serializer_class = EntryDateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Entry.objects.all().order_by("entry_date")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PreviousYearsEntriesView(generics.ListAPIView):
    serializer_class = EntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        today = timezone.now().date()
        month = today.month
        day = today.day
        return Entry.objects.filter(
            entry_date__month=month, entry_date__day=day
        ).exclude(entry_date__year=today.year)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
