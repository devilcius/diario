from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from api.models import Entry
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token


class EntryListViewTest(APITestCase):

    @classmethod
    def setUpTestData(self):
        self.user = User.objects.create_superuser(username="testowy", password="test")
        self.client = APIClient()
        # Create 15 entries for pagination test
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

    def test_pagination_is_applied(self):
        url = reverse("entry-list")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Default PAGE_SIZE is 10
        self.assertEqual(len(response.data["results"]), 10)

    def test_second_page(self):
        url = reverse("entry-list")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, {"page": 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Remaining entries on the second page
        self.assertEqual(len(response.data["results"]), 7)

    def test_entries_order(self):
        url = reverse("entry-list")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        entries = Entry.objects.all().order_by("-entry_date")
        for i in range(10):
            self.assertEqual(response.data["results"][i]["title"], entries[i].title)

    def test_filter_entries_by_post_content(self):
        url = reverse("entry-list")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, {"post": "yet another"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["post"], "Another yet another content."
        )

    def test_unauthenticated_access(self):
        url = reverse("entry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_access(self):
        url = reverse("entry-list")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_authentication(self):
        # Create a token for the user
        token, created = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        url = reverse("entry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
