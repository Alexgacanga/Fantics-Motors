from django.db import models

DEFAULT_FEATURES = ('Sunroof', 'Power liftgate')


class VehicleOption(models.Model):
	KIND_CHOICES = [
		('body_type', 'Body type'),
		('color', 'Color'),
		('feature', 'Feature'),
	]

	kind = models.CharField(max_length=16, choices=KIND_CHOICES)
	value = models.CharField(max_length=80)
	normalized_value = models.CharField(max_length=80, editable=False)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('value',)
		constraints = [
			models.UniqueConstraint(
				fields=('kind', 'normalized_value'),
				name='unique_normalized_vehicle_option',
			)
		]

	def save(self, *args, **kwargs):
		self.value = self.value.strip()
		self.normalized_value = self.value.casefold()
		super().save(*args, **kwargs)

	def __str__(self):
		return f'{self.get_kind_display()}: {self.value}'


class Vehicle(models.Model):
	STATUS_CHOICES = [('Available', 'Available'), ('Sold', 'Sold')]
	CONDITION_CHOICES = [
		('New', 'New'),
		('Kenyan Used', 'Kenyan Used'),
		('Foreign Used', 'Foreign Used'),
	]
	TRANSMISSION_CHOICES = [('Automatic', 'Automatic'), ('Manual', 'Manual')]
	DRIVE_TYPE_CHOICES = [(value, value) for value in ('FWD', 'RWD', '4WD', 'AWD')]
	FUEL_TYPE_CHOICES = [
		(value, value)
		for value in ('Petrol', 'Diesel', 'Hybrid', 'Plug-in hybrid (PHEV)', 'Electric (EV)')
	]
	BODY_TYPE_CHOICES = [
		(value, value)
		for value in (
			'Saloon', 'HatchBack', 'Station Wagon', 'SUV / Offroad', 'Cross-over',
			'Pick Up', 'Truck / Trailer', 'Van / Bus', 'Coupe', 'Mini-van', 'Bike',
			'Convertible', 'Three wheeler',
		)
	]
	COLOR_CHOICES = [
		(value, value)
		for value in (
			'Black', 'White', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Brown',
			'Beige', 'Gold', 'Maroon', 'Other',
		)
	]

	brand = models.CharField(max_length=100)
	model = models.CharField(max_length=120)
	year = models.PositiveSmallIntegerField()
	price = models.DecimalField(max_digits=14, decimal_places=2)
	status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='Available')
	condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, blank=True)
	mileage = models.PositiveIntegerField(null=True, blank=True)
	transmission = models.CharField(max_length=16, choices=TRANSMISSION_CHOICES, blank=True)
	drive_type = models.CharField(max_length=8, choices=DRIVE_TYPE_CHOICES, blank=True)
	engine_cc = models.PositiveIntegerField(null=True, blank=True)
	fuel_type = models.CharField(max_length=32, choices=FUEL_TYPE_CHOICES, blank=True)
	body_type = models.CharField(max_length=32, blank=True)
	color = models.CharField(max_length=24, blank=True)
	seats = models.PositiveSmallIntegerField(null=True, blank=True)
	features = models.JSONField(default=list, blank=True)
	description = models.TextField(blank=True)
	images = models.JSONField(default=list, blank=True)
	image = models.ImageField(upload_to='vehicles/', null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ('-created_at', '-id')

	def __str__(self):
		return f'{self.year} {self.brand} {self.model}'
