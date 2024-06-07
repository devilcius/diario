from rest_framework import generics
from .models import Entry
from .serializers import EntrySerializer
from .filters import EntryFilter
from django_filters.rest_framework import DjangoFilterBackend


class EntryListView(generics.ListAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EntryFilter

    def get_queryset(self):
        return Entry.objects.all().order_by('-entry_date')
