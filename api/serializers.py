from rest_framework import serializers
from api.models import Entry


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = "__all__"


class EntryDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ["id", "entry_date", "title"]
