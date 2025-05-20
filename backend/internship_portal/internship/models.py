from django.db import models

# Create your models here.
class Internship(models.Model):
    user_id = models.CharField(max_length = 500, default='null')
    username = models.CharField(max_length = 400, default='null')
    Title = models.CharField(max_length = 100, default='null')
    Mentor = models.CharField(max_length = 50, default='null')
    Duration = models.CharField(max_length = 20, default='null')
    Stipend = models.CharField(max_length = 50)
    Description = models.CharField(max_length = 50, default='null')
    Status = models.CharField(max_length = 20, default='null')
    Skills = models.CharField(max_length=500, default='null')
    

    def __str__(self):
        return f"{self.Title} - {self.Mentor}"
