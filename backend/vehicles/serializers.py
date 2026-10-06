import json

from django.core.files.storage import default_storage
from django.utils import timezone
from rest_framework import serializers

from .models import Vehicle, VehicleOption


class VehicleSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_upload = serializers.ImageField(write_only=True, required=False, allow_null=True, source='image')
    image_uploads = serializers.ListField(child=serializers.ImageField(), required=False, write_only=True)
    features = serializers.ListField(child=serializers.CharField(max_length=80), required=False)
    images = serializers.ListField(child=serializers.URLField(), required=False)

    class Meta:
        model = Vehicle
        fields = (
            'id', 'brand', 'model', 'year', 'price', 'status', 'condition', 'mileage',
            'transmission', 'drive_type', 'engine_cc', 'fuel_type', 'body_type', 'color',
            'seats', 'features', 'description', 'images', 'image', 'image_upload', 'image_uploads',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'image', 'created_at', 'updated_at')

    def to_internal_value(self, data):
        if hasattr(data, 'getlist'):
            payload = data.dict()
            uploaded_files = data.getlist('image_uploads')
            if uploaded_files:
                payload['image_uploads'] = uploaded_files
        else:
            payload = dict(data)
        for field in ('features', 'images'):
            value = payload.get(field)
            if isinstance(value, str):
                try:
                    payload[field] = json.loads(value)
                except json.JSONDecodeError as error:
                    raise serializers.ValidationError({field: 'Provide a valid JSON list.'}) from error
        return super().to_internal_value(payload)

    def get_image(self, vehicle):
        if not vehicle.image:
            return None
        request = self.context.get('request')
        url = vehicle.image.url
        return request.build_absolute_uri(url) if request else url

    def validate_year(self, value):
        if value < 1900 or value > timezone.now().year:
            raise serializers.ValidationError('Enter a valid model year.')
        return value

    def validate(self, attrs):
        has_cover = bool(attrs.get('image')) or bool(self.instance and self.instance.image)
        has_gallery = bool(attrs.get('images', getattr(self.instance, 'images', [])))
        has_uploaded_gallery = bool(attrs.get('image_uploads'))
        if not (has_cover or has_gallery or has_uploaded_gallery):
            raise serializers.ValidationError({'images': 'Upload or provide at least one vehicle image.'})
        return attrs

    def _store_gallery_uploads(self, vehicle, uploads):
        if not uploads:
            return vehicle
        request = self.context.get('request')
        stored_urls = []
        for upload in uploads:
            filename = default_storage.save(f'vehicles/{upload.name}', upload)
            url = default_storage.url(filename)
            stored_urls.append(request.build_absolute_uri(url) if request else url)
        vehicle.images = [*(vehicle.images or []), *stored_urls]
        vehicle.save(update_fields=('images', 'updated_at'))
        return vehicle

    def create(self, validated_data):
        uploads = validated_data.pop('image_uploads', [])
        vehicle = super().create(validated_data)
        return self._store_gallery_uploads(vehicle, uploads)

    def update(self, instance, validated_data):
        uploads = validated_data.pop('image_uploads', [])
        vehicle = super().update(instance, validated_data)
        return self._store_gallery_uploads(vehicle, uploads)


class VehicleOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleOption
        fields = ('id', 'kind', 'value')
        read_only_fields = ('id',)

    def validate_value(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Enter an option value.')
        return value
