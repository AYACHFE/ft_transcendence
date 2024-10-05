
FROM python:3.9


WORKDIR /usr/src/app
COPY requirements.txt ./
COPY /volumes/PongVol/ssl .
RUN pip install -r requirements.txt
RUN if [ ! -f /usr/src/app/manage.py ];then django-admin startproject pong . ; fi

EXPOSE 8443
ENV DJANGO_SETTINGS_MODULE=pong.settings


CMD python manage.py makemigrations &&  python manage.py migrate && daphne -e ssl:8443:privateKey=./ssl/private.key:certKey=./ssl/certificate.crt pong.asgi:application


# CMD python manage.py runserver 0.0.0.0:8000