from django_filters import rest_framework as filters
from .models import Entry


class EntryFilter(filters.FilterSet):
    post = filters.CharFilter(field_name="post", lookup_expr="icontains")

    class Meta:
        model = Entry

        fields = ["post"]
