from rest_framework import viewsets
from .models import Entry
from .serializers import EntrySerializer
from .filters import EntryFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated


class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all().order_by("-entry_date")
    serializer_class = EntrySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EntryFilter
    permission_classes = [IsAuthenticated]
