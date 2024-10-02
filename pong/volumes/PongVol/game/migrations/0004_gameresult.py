# Generated by Django 3.2.5 on 2024-10-02 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_delete_gameresult'),
    ]

    operations = [
        migrations.CreateModel(
            name='GameResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('winner_username', models.CharField(max_length=255)),
                ('loser_username', models.CharField(max_length=255)),
                ('time', models.DateTimeField()),
                ('winner_score', models.IntegerField()),
                ('loser_score', models.IntegerField()),
            ],
        ),
    ]