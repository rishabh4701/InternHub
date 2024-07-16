# students/views.py
from rest_framework import viewsets
from .models import Student
from .serializer import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
