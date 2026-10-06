from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class InquiryApiTests(APITestCase):
	def test_public_user_can_submit_inquiry(self):
		response = self.client.post(
			reverse('inquiry-list'),
			{
				'name': 'Test Customer',
				'email': 'customer@example.com',
				'message': 'Please contact me about a vehicle.',
			},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['status'], 'New')

	def test_inquiry_management_requires_staff(self):
		response = self.client.get(reverse('inquiry-list'))

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
