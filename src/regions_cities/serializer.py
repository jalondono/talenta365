from rest_framework import serializers
from .models import City, Regions


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Regions
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'
