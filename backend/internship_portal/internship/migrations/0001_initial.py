# Generated by Django 5.0.6 on 2024-07-07 19:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Internship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Title', models.CharField(max_length=100)),
                ('Mentor', models.CharField(max_length=50)),
                ('Duration', models.CharField(max_length=20)),
                ('Stipend', models.CharField(max_length=50)),
                ('Description', models.CharField(max_length=50)),
            ],
        ),
    ]
