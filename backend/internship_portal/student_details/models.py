# students/models.py
from django.db import models

class Student(models.Model):
    first_name = models.CharField(max_length=50, default='null')
    last_name = models.CharField(max_length=50, default='null')
    adddress = models.CharField(max_length=200, default='null')
    email = models.EmailField(unique=False)
    phone_number = models.CharField(max_length=15, default='null')
    college_name = models.CharField(max_length=100, default='null')
    department = models.CharField(max_length=100, default='null')
    roll_no = models.CharField(max_length=20, default='null')
    course = models.CharField(max_length=100, default='null')
    year_of_study = models.IntegerField()
    resume = models.FileField(upload_to='resumes/', default='null')
    idCard = models.FileField(upload_to='id/', default='null')
    i_id = models.CharField(max_length=50, default='null')
    status = models.CharField(max_length=50, default="Applied")
    user_id= models.CharField(max_length=50, default='null')
    skills = models.CharField(max_length=400, default='null')
    addskills = models.CharField(max_length=400, default='null')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
