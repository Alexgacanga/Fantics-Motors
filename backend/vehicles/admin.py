from django.contrib import admin
from .models import Vehicle


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
	list_display = ('brand', 'model', 'year', 'price', 'status', 'condition')
	list_filter = ('status', 'condition', 'fuel_type', 'body_type')
	search_fields = ('brand', 'model', 'description')
