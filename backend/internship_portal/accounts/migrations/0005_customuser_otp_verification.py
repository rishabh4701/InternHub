# Generated by Django 5.1 on 2024-09-01 06:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_remove_customuser_adress_remove_customuser_college_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='otp_verification',
            field=models.IntegerField(max_length=999999, null=True),
        ),
    ]
