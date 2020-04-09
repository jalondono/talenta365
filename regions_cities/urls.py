from rest_framework import routers
from .viewsets import *

router = routers.DefaultRouter()
router.register('city', CityViewSet)
router.register('region', RegionViewSet)
