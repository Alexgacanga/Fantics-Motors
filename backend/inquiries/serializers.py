from rest_framework import serializers

from .models import Inquiry


class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ('id', 'name', 'email', 'phone', 'message', 'vehicle', 'status', 'created_at')
        read_only_fields = ('id', 'status', 'created_at')

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError('Please include a message.')
        return value.strip()