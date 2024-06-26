from rest_framework.test import APITestCase
from api.serializers import EntrySerializer, EntryDateSerializer
from api.models import Entry
from django.utils import timezone


class EntrySerializerTest(APITestCase):

    def setUp(self):
        self.entry_attributes = {
            "title": "Test Entry",
            "post": "This is a test post.",
            "entry_date": timezone.now(),
        }

        self.entry = Entry.objects.create(**self.entry_attributes)
        self.serializer = EntrySerializer(instance=self.entry)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertEqual(
            set(data.keys()), set(["id", "title", "post", "posted_at", "entry_date"])
        )

    def test_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["title"], self.entry_attributes["title"])
        self.assertEqual(data["post"], self.entry_attributes["post"])

        # Normalize the date string for comparison
        entry_date_str = (
            self.entry_attributes["entry_date"].isoformat().replace("+00:00", "Z")
        )
        self.assertEqual(data["entry_date"], entry_date_str)


class EntryDateSerializerTest(APITestCase):

    @classmethod
    def setUpTestData(cls):
        Entry.objects.create(
            title="Test Entry", post="This is a test post.", entry_date=timezone.now()
        )

    def test_entry_date_serialization(self):
        entry = Entry.objects.first()
        serializer = EntryDateSerializer(entry)
        # Normalize the date string for comparison
        entry_date_str = entry.entry_date.isoformat().replace("+00:00", "Z")
        self.assertEqual(serializer.data["entry_date"], entry_date_str)
