from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AdminAuthenticationTests(APITestCase):
	def setUp(self):
		self.staff_user = get_user_model().objects.create_user(
			username='inventory-admin',
			email='admin@example.com',
			password='LocalTestPassword!42',
			is_staff=True,
		)

	def test_staff_login_returns_access_token_and_user(self):
		response = self.client.post(
			reverse('admin-login'),
			{'email': 'ADMIN@example.com', 'password': 'LocalTestPassword!42'},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('access', response.data)
		self.assertEqual(response.data['user']['email'], 'admin@example.com')
		self.assertTrue(response.data['user']['is_staff'])

	def test_current_user_requires_token_and_returns_staff_status(self):
		login_response = self.client.post(
			reverse('admin-login'),
			{'email': 'admin@example.com', 'password': 'LocalTestPassword!42'},
			format='json',
		)
		self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

		response = self.client.get(reverse('current-user'))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['id'], self.staff_user.id)

	def test_staff_can_login_using_username(self):
		response = self.client.post(
			reverse('admin-login'),
			{'email': 'inventory-admin', 'password': 'LocalTestPassword!42'},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('access', response.data)

	def test_non_staff_user_cannot_login_to_admin(self):
		get_user_model().objects.create_user(
			username='buyer',
			email='buyer@example.com',
			password='LocalTestPassword!42',
		)

		response = self.client.post(
			reverse('admin-login'),
			{'email': 'buyer@example.com', 'password': 'LocalTestPassword!42'},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
