from django.test import TestCase
from api.models import Entry
from django.utils import timezone
import datetime


class EntryModelTest(TestCase):

    def setUp(self):
        self.entry = Entry.objects.create(
            title="Test Entry", post="This is a test post.", entry_date=timezone.now()
        )

    def test_entry_creation(self):
        self.assertTrue(isinstance(self.entry, Entry))
        self.assertEqual(self.entry.__str__(), self.entry.title)

    def test_entry_fields(self):
        self.assertEqual(self.entry.title, "Test Entry")
        self.assertEqual(self.entry.post, "This is a test post.")
        self.assertIsInstance(self.entry.entry_date, datetime.datetime)

    def test_entry_posted_at(self):
        # Assuming auto_now_add=True for posted_at, it should be close to the current time.
        now = timezone.now()
        self.assertLess((now - self.entry.posted_at).total_seconds(), 1)
