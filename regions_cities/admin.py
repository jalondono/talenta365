from django.contrib import admin

# Register your models here.
from .models import Regions, City


# Register your models here.

class RegionAdmin(admin.ModelAdmin):
    list_display = ('name',)


class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'status')


admin.site.register(Regions, RegionAdmin)
admin.site.register(City, CityAdmin)
