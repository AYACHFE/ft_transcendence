# Generated by Django 3.2.5 on 2024-09-25 11:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_id', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
    ]
