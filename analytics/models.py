from django.db import models

class Dataset(models.Model):
    filename = models.CharField(max_length=255)
    upload_timestamp = models.DateTimeField(auto_now_add=True)
    total_equipment = models.IntegerField()
    avg_flowrate = models.DecimalField(max_digits=10, decimal_places=2)
    avg_pressure = models.DecimalField(max_digits=10, decimal_places=2)
    avg_temperature = models.DecimalField(max_digits=10, decimal_places=2)
    # Using JSONField for type distribution { "Pump": 4, "Valve": 3 }
    type_distribution = models.JSONField()

    class Meta:
        ordering = ['-upload_timestamp']

class Equipment(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='equipment')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    flowrate = models.DecimalField(max_digits=10, decimal_places=2)
    pressure = models.DecimalField(max_digits=10, decimal_places=2)
    temperature = models.DecimalField(max_digits=10, decimal_places=2)