from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from api.models import Entry
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token


class EntryViewSetTest(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_superuser(username="testowy", password="test")
        cls.client = APIClient()
        # Create 18 entries for pagination test
        number_of_entries = 15
        for entry_id in range(number_of_entries):
            Entry.objects.create(
                title=f"Test Entry {entry_id}",
                post="This is a test post.",
                entry_date=timezone.now(),
            )
        Entry.objects.create(
            title="Test Entry 1",
            post="This is another test post.",
            entry_date=timezone.now(),
        )
        Entry.objects.create(
            title="Test Entry 2",
            post="Another yet another content.",
            entry_date=timezone.now(),
        )

    def setUp(self):
        # Authenticate user for each test
        self.client.force_authenticate(user=self.user)

    def test_pagination_is_applied(self):
        url = reverse("entry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Default PAGE_SIZE is 10
        self.assertEqual(len(response.data["results"]), 10)

    def test_second_page(self):
        url = reverse("entry-list")
        response = self.client.get(url, {"page": 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 7)

    def test_entries_order(self):
        url = reverse("entry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        entries = Entry.objects.all().order_by("-entry_date")
        for i in range(10):
            self.assertEqual(response.data["results"][i]["title"], entries[i].title)

    def test_filter_entries_by_post_content(self):
        url = reverse("entry-list")
        response = self.client.get(url, {"post": "yet another"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["post"], "Another yet another content."
        )

    def test_unauthenticated_access(self):
        # Ensure no user is authenticated
        self.client.force_authenticate(user=None)
        url = reverse("entry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_access(self):
        url = reverse("entry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_authentication(self):
        # Create a token for the user
        token, created = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        url = reverse("entry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_entry(self):
        url = reverse("entry-list")
        data = {
            "title": "New Entry",
            "post": "This is a new post.",
            "entry_date": timezone.now().isoformat(),
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Entry.objects.count(), 18)

    def test_update_entry(self):
        entry = Entry.objects.first()
        url = reverse("entry-detail", args=[entry.id])
        data = {
            "title": "Updated Entry",
            "post": "This post has been updated.",
            "entry_date": entry.entry_date.isoformat(),
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        entry.refresh_from_db()
        self.assertEqual(entry.title, "Updated Entry")
        self.assertEqual(entry.post, "This post has been updated.")

    def test_partial_update_entry(self):
        entry = Entry.objects.first()
        url = reverse("entry-detail", args=[entry.id])
        data = {"title": "Partially Updated Entry"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        entry.refresh_from_db()
        self.assertEqual(entry.title, "Partially Updated Entry")

    def test_delete_entry(self):
        entry = Entry.objects.first()
        url = reverse("entry-detail", args=[entry.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Entry.objects.count(), 16)

    def test_get_single_entry(self):
        entry = Entry.objects.first()
        url = reverse("entry-detail", args=[entry.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], entry.title)
        self.assertEqual(response.data["post"], entry.post)


class EntryCalendarViewTest(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_superuser(username="testowy", password="test")
        cls.client = APIClient()

        # Create some entries with different dates
        now = timezone.now()
        Entry.objects.create(
            title="Test Entry 1", post="This is a test post 1.", entry_date=now
        )
        Entry.objects.create(
            title="Test Entry 2",
            post="This is a test post 2.",
            entry_date=now - timezone.timedelta(days=1),
        )
        Entry.objects.create(
            title="Test Entry 3",
            post="This is a test post 3.",
            entry_date=now - timezone.timedelta(days=2),
        )

    def setUp(self):
        # Authenticate user for each test
        self.client.force_authenticate(user=self.user)

    def test_entry_dates_retrieval(self):
        url = reverse("entry-calendar")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check the length of the results array
        self.assertEqual(len(response.data), 3)

    def test_entries_ordering(self):
        url = reverse("entry-calendar")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Extract entry dates
        entry_dates = [entry["entry_date"] for entry in response.data]

        # Ensure dates are ordered
        self.assertEqual(entry_dates, sorted(entry_dates))

    def test_unauthenticated_access(self):
        # Ensure no user is authenticated
        self.client.force_authenticate(user=None)
        url = reverse("entry-calendar")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
