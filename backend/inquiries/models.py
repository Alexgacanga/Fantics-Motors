from django.db import models

from vehicles.models import Vehicle


class Inquiry(models.Model):
	STATUS_CHOICES = [
		('New', 'New'),
		('In progress', 'In progress'),
		('Resolved', 'Resolved'),
	]

	name = models.CharField(max_length=120)
	email = models.EmailField()
	phone = models.CharField(max_length=32, blank=True)
	message = models.TextField()
	vehicle = models.ForeignKey(Vehicle, null=True, blank=True, on_delete=models.SET_NULL, related_name='inquiries')
	status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='New')
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('-created_at',)

	def __str__(self):
		return f'{self.name} · {self.created_at:%Y-%m-%d}'
