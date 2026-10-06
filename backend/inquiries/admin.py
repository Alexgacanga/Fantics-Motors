from django.contrib import admin
from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
	list_display = ('name', 'email', 'vehicle', 'status', 'created_at')
	list_filter = ('status', 'created_at')
	search_fields = ('name', 'email', 'phone', 'message')
