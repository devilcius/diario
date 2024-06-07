from django.db import models


class Entry(models.Model):
    title = models.CharField(max_length=255, null=True, blank=True)
    post = models.TextField()
    posted_at = models.DateTimeField(auto_now_add=True)
    entry_date = models.DateTimeField()

    def __str__(self):
        return self.title or "Untitled"
