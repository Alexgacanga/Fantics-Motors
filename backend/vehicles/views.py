import re
from decimal import Decimal

from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import DEFAULT_FEATURES, Vehicle, VehicleOption
from .serializers import VehicleOptionSerializer, VehicleSerializer


class VehiclePagination(PageNumberPagination):
	page_size = 10
	page_size_query_param = 'page_size'
	max_page_size = 100


class PublicVehiclePagination(VehiclePagination):
	page_size = 8


def _selected_values(params, key):
	return [
		value.strip()
		for item in params.getlist(key)
		for value in item.split(',')
		if value.strip()
	]


def _range_query(field, value, decimal_field=False):
	value = value.strip().lower()
	numbers = re.findall(r'\d+(?:\.\d+)?\s*[km]?', value)
	bounds = [_range_number(number, decimal_field) for number in numbers]
	if not bounds or any(bound is None for bound in bounds):
		return None
	if value.startswith('under'):
		return Q(**{f'{field}__lt': bounds[0]})
	if value.startswith(('above', 'over')):
		return Q(**{f'{field}__gt': bounds[0]})
	if '+' in value:
		return Q(**{f'{field}__gte': bounds[0]})
	if len(bounds) >= 2:
		return Q(**{f'{field}__gte': bounds[0], f'{field}__lte': bounds[1]})
	return None


def _range_number(text, decimal_field=False):
	match = re.fullmatch(r'\s*(\d+(?:\.\d+)?)\s*([km]?)\s*', text, re.IGNORECASE)
	if not match:
		return None
	value = Decimal(match.group(1))
	value *= {'k': 1_000, 'm': 1_000_000, '': 1}.get(match.group(2).lower(), 1)
	return value if decimal_field else int(value)


def _apply_range(queryset, field, value, decimal_field=False):
	return _apply_ranges(queryset, field, [value], decimal_field)


def _apply_ranges(queryset, field, values, decimal_field=False):
	queries = [
		query
		for value in values
		if (query := _range_query(field, value, decimal_field)) is not None
	]
	if not queries:
		return queryset
	combined = queries[0]
	for query in queries[1:]:
		combined |= query
	return queryset.filter(combined)


class VehicleViewSet(viewsets.ModelViewSet):
	serializer_class = VehicleSerializer
	permission_classes = (IsAdminUser,)
	pagination_class = VehiclePagination

	def get_permissions(self):
		if self.action in ('public', 'retrieve') or (self.action == 'options' and self.request.method == 'GET'):
			return [AllowAny()]
		return [IsAdminUser()]

	def get_queryset(self):
		params = self.request.query_params
		queryset = Vehicle.objects.all()
		if self.action == 'retrieve' and not self.request.user.is_staff and not self.request.user.is_superuser:
			queryset = queryset.filter(status='Available')
		search = params.get('search', '').strip()
		if search:
			queryset = queryset.filter(
				Q(brand__icontains=search)
				| Q(model__icontains=search)
				| Q(description__icontains=search)
			)

		makes = _selected_values(params, 'make')
		models = _selected_values(params, 'model')
		if makes:
			queryset = queryset.filter(brand__in=makes)
		if models:
			queryset = queryset.filter(model__in=models)
		if params.get('year'):
			queryset = queryset.filter(year=params['year'])

		for param in ('condition', 'transmission', 'drive_type', 'fuel_type', 'body_type', 'color', 'status'):
			values = _selected_values(params, param)
			if values:
				queryset = queryset.filter(**{f'{param}__in': values})

		price_ranges = _selected_values(params, 'price_range')
		mileage_ranges = _selected_values(params, 'mileage_range')
		if price_ranges:
			queryset = _apply_ranges(queryset, 'price', price_ranges, decimal_field=True)
		if mileage_ranges:
			queryset = _apply_ranges(queryset, 'mileage', mileage_ranges)

		engine_filters = _selected_values(params, 'engine_cc')
		if engine_filters:
			engine_ranges = [value for value in engine_filters if re.search(r'[a-z+\-]', value, re.IGNORECASE)]
			engine_values = [value for value in engine_filters if value not in engine_ranges]
			engine_query = Q(engine_cc__in=engine_values) if engine_values else Q()
			for value in engine_ranges:
				range_filter = _range_query('engine_cc', value)
				if range_filter:
					engine_query |= range_filter
			queryset = queryset.filter(engine_query)

		seat_values = []
		for value in _selected_values(params, 'seats'):
			seat_count = re.search(r'\d+', value)
			if seat_count:
				seat_values.append(int(seat_count.group()))
		if seat_values:
			queryset = queryset.filter(seats__in=seat_values)

		return queryset.order_by('-created_at', '-id')

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		features = _selected_values(request.query_params, 'features')
		if features:
			queryset = [vehicle for vehicle in queryset if any(feature in (vehicle.features or []) for feature in features)]
		page = self.paginate_queryset(queryset)
		serializer = self.get_serializer(page, many=True)
		return self.get_paginated_response(serializer.data)

	@action(detail=False, methods=('get',), url_path='public')
	def public(self, request):
		queryset = self.filter_queryset(self.get_queryset().filter(status='Available'))
		features = _selected_values(request.query_params, 'features')
		if features:
			queryset = [vehicle for vehicle in queryset if any(feature in (vehicle.features or []) for feature in features)]
		self.pagination_class = PublicVehiclePagination
		page = self.paginate_queryset(queryset)
		serializer = self.get_serializer(page, many=True)
		return self.get_paginated_response(serializer.data)

	@action(detail=False, methods=('get', 'post'), url_path='options')
	def options(self, request):
		if request.method == 'POST':
			serializer = VehicleOptionSerializer(data=request.data)
			serializer.is_valid(raise_exception=True)
			kind = serializer.validated_data['kind']
			value = serializer.validated_data['value']
			option, _ = VehicleOption.objects.get_or_create(
				kind=kind,
				normalized_value=value.casefold(),
				defaults={'value': value},
			)
			return Response(VehicleOptionSerializer(option).data, status=status.HTTP_200_OK)

		custom = {}
		for option in VehicleOption.objects.all():
			custom.setdefault(option.kind, []).append(option.value)
		vehicle_values = Vehicle.objects.all()
		feature_values = {
			feature
			for feature_list in vehicle_values.values_list('features', flat=True)
			for feature in (feature_list or [])
		}
		return Response({
			'makes': list(vehicle_values.order_by('brand').values_list('brand', flat=True).distinct()),
			'models': list(vehicle_values.order_by('model').values_list('model', flat=True).distinct()),
			'body_types': sorted(set(dict(Vehicle.BODY_TYPE_CHOICES)) | set(custom.get('body_type', [])) | set(vehicle_values.exclude(body_type='').values_list('body_type', flat=True)), key=str.casefold),
			'colors': sorted(set(dict(Vehicle.COLOR_CHOICES)) | set(custom.get('color', [])) | set(vehicle_values.exclude(color='').values_list('color', flat=True)), key=str.casefold),
			'features': sorted(set(DEFAULT_FEATURES) | set(custom.get('feature', [])) | feature_values, key=str.casefold),
			'seats': list(vehicle_values.exclude(seats__isnull=True).order_by('seats').values_list('seats', flat=True).distinct()),
		})
