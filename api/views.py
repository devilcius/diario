from rest_framework import viewsets
from .models import Entry
from .serializers import EntrySerializer, EntryDateSerializer
from .filters import EntryFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response


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
