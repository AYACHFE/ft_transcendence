# Generated by Django 3.2.5 on 2024-09-21 09:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0019_remove_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='1_men.svg', upload_to='avatars/'),
        ),
    ]
