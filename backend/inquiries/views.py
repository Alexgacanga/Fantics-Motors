from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Inquiry
from .serializers import InquirySerializer


class InquiryViewSet(viewsets.ModelViewSet):
	serializer_class = InquirySerializer

	def get_queryset(self):
		return Inquiry.objects.select_related('vehicle').all()

	def get_permissions(self):
		if self.action == 'create':
			return (AllowAny(),)
		return (IsAdminUser(),)
