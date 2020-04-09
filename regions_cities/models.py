from django.db import models

# Create your models here.
status = [
    ('1', 'ACTIVE'),
    ('2', 'INACTIVE'),
]


class City(models.Model):
    name = models.CharField(max_length=40, blank=False)
    status = models.CharField(max_length=45, choices=status, default='ACTIVE')

    def __str__(self):
        return self.name


class Regions(models.Model):
    name = models.CharField(max_length=40, blank=False)
    cities = models.ManyToManyField(City)

    def __str__(self):
        return self.name
