from io import BytesIO
from tempfile import TemporaryDirectory

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.test import override_settings
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Vehicle, VehicleOption


class VehicleApiTests(APITestCase):
	def setUp(self):
		admin_user = get_user_model().objects.create_user(
			username='vehicle-admin',
			email='vehicles@example.com',
			password='LocalTestPassword!42',
			is_staff=True,
		)
		self.client.force_authenticate(admin_user)

	def create_vehicle(self, **overrides):
		values = {
			'brand': 'Fantics Test',
			'model': 'GT',
			'year': 2024,
			'price': '4200000.00',
			'status': 'Available',
			'fuel_type': 'Petrol',
			'features': ['Sunroof'],
		}
		values.update(overrides)
		return Vehicle.objects.create(**values)

	def test_vehicle_crud_and_filtering(self):
		create_response = self.client.post(
			reverse('vehicle-list'),
			{
				'brand': 'Fantics Test',
				'model': 'GT',
				'year': 2024,
				'price': '4200000',
				'features': ['Sunroof'],
				'images': ['https://example.com/fantics-test.jpg'],
			},
			format='json',
		)
		self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
		vehicle_id = create_response.data['id']

		list_response = self.client.get(
			reverse('vehicle-list'),
			{'make': 'Fantics Test', 'price_range': 'Above 3.5M', 'features': 'Sunroof'},
		)
		self.assertEqual(list_response.status_code, status.HTTP_200_OK)
		self.assertEqual(list_response.data['count'], 1)

		update_response = self.client.patch(
			reverse('vehicle-detail', args=[vehicle_id]),
			{'status': 'Sold'},
			format='json',
		)
		self.assertEqual(update_response.status_code, status.HTTP_200_OK)
		self.assertEqual(update_response.data['status'], 'Sold')

		delete_response = self.client.delete(reverse('vehicle-detail', args=[vehicle_id]))
		self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

	def test_admin_vehicle_list_defaults_to_ten_item_pages(self):
		Vehicle.objects.bulk_create([
			Vehicle(brand='Page Test', model=f'Car {index}', year=2020, price='1000000', images=['https://example.com/car.jpg'])
			for index in range(11)
		])

		response = self.client.get(reverse('vehicle-list'), {'page': 1})

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 11)
		self.assertEqual(len(response.data['results']), 10)

	def test_vehicle_cover_image_upload(self):
		image_buffer = BytesIO()
		Image.new('RGB', (2, 2), color='blue').save(image_buffer, format='PNG')
		image = SimpleUploadedFile('vehicle.png', image_buffer.getvalue(), content_type='image/png')

		response = self.client.post(
			reverse('vehicle-list'),
			{
				'brand': 'Image Test',
				'model': 'Roadster',
				'year': 2024,
				'price': '2500000',
				'image_upload': image,
			},
			format='multipart',
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertIn('/media/vehicles/', response.data['image'])

	def test_vehicle_requires_at_least_one_image(self):
		response = self.client.post(
			reverse('vehicle-list'),
			{'brand': 'No Image', 'model': 'Car', 'year': 2024, 'price': '1000000'},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('images', response.data)

	def test_vehicle_accepts_multiple_uploaded_images(self):
		def upload(name):
			buffer = BytesIO()
			Image.new('RGB', (2, 2), color='blue').save(buffer, format='PNG')
			return SimpleUploadedFile(name, buffer.getvalue(), content_type='image/png')

		with TemporaryDirectory() as media_root, override_settings(MEDIA_ROOT=media_root):
			response = self.client.post(
				reverse('vehicle-list'),
				{
					'brand': 'Multi Image',
					'model': 'Tourer',
					'year': 2024,
					'price': '3000000',
					'image_upload': upload('cover.png'),
					'image_uploads': [upload('interior.png'), upload('side.png')],
				},
				format='multipart',
			)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertIn('/media/vehicles/', response.data['image'])
		self.assertEqual(len(response.data['images']), 2)

	def test_vehicle_api_requires_admin_access(self):
		self.client.force_authenticate(user=None)

		response = self.client.get(reverse('vehicle-list'))

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_public_inventory_only_shows_available_and_pages_eight(self):
		Vehicle.objects.bulk_create([
			Vehicle(brand='Public Make', model=f'Car {index}', year=2024, price='1000000', status='Available', images=['https://example.com/car.jpg'])
			for index in range(9)
		] + [Vehicle(brand='Public Make', model='Sold Car', year=2024, price='1000000', status='Sold')])

		response = self.client.get(reverse('vehicle-public'), {'page': 1})

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 9)
		self.assertEqual(len(response.data['results']), 8)

	def test_public_detail_is_available_for_available_vehicle(self):
		vehicle = self.create_vehicle(images=['https://example.com/vehicle.jpg'])
		self.client.force_authenticate(user=None)

		response = self.client.get(reverse('vehicle-detail', args=[vehicle.id]))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['model'], vehicle.model)

	def test_public_detail_hides_sold_vehicle(self):
		vehicle = self.create_vehicle(status='Sold', images=['https://example.com/vehicle.jpg'])
		self.client.force_authenticate(user=None)

		response = self.client.get(reverse('vehicle-detail', args=[vehicle.id]))

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_dynamic_option_catalog_includes_existing_vehicle_values(self):
		self.create_vehicle(brand='Catalog Make', model='Catalog Model', body_type='Roadster', color='Midnight Blue', seats=3, features=['Massage seats'])

		response = self.client.get(reverse('vehicle-options'))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('Catalog Make', response.data['makes'])
		self.assertIn('Catalog Model', response.data['models'])
		self.assertIn('Roadster', response.data['body_types'])
		self.assertIn('Midnight Blue', response.data['colors'])
		self.assertIn('Massage seats', response.data['features'])
		self.assertIn(3, response.data['seats'])

	def test_staff_can_add_persistent_vehicle_option(self):
		response = self.client.post(
			reverse('vehicle-options'),
			{'kind': 'body_type', 'value': '  Roadster  '},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['value'], 'Roadster')
		self.assertTrue(VehicleOption.objects.filter(kind='body_type', normalized_value='roadster').exists())
