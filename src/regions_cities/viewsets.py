from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializer import CitySerializer, RegionSerializer
from .models import City, Regions


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class RegionViewSet(viewsets.ModelViewSet):
    queryset = Regions.objects.all()
    serializer_class = RegionSerializer
