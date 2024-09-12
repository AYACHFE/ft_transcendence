"""
Django settings for pong project.

Generated by 'django-admin startproject' using Django 3.2.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path
from decouple import config
from decimal import localcontext

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-t-+d!r7qqkym$=5(lpn%)2u3(=ql(+ow$0dqw154)gk85psz72'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["pong", "localhost"]

PING_PONG_UID = config('PING_PONG_UID')
PING_PONG_SECRET = config('PING_PONG_SECRET')

GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = config('GOOGLE_CLIENT_SECRET')

JWT_SECRET = config('JWT_SECRET')


# EMAILING SETTINGS

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# SMTP server settings
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_FROM = 'boulhoujjatmehdi@gmail.com'
EMAIL_HOST_USER = 'boulhoujjatmehdi@gmail.com'    # Your SMTP email
EMAIL_HOST_PASSWORD = 'ltqojbwulvmudhub' 
EMAIL_PORT = 587                       # For TLS use 587, for SSL use 465
EMAIL_USE_TLS = True                   # True for TLS (recommended), False if using SSL

PASSWORD_RESET_TIMEOUT = 14400 # //TODO: CHECK IF THIS NECESSARY, its more likely that its not.-_-

# Default "from" address for emails
# DEFAULT_FROM_EMAIL = 'webmaster@yourdomain.com'

# Email subject prefix (useful for identifying emails from your site)
# EMAIL_SUBJECT_PREFIX = '[Your Website] '




INSTALLED_APPS = [
    'allauth',
    'daphne',
    'channels',
    'chat',
	'settings',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework', 
    'corsheaders',
    'users',
    'main',
	'game',

    'googleauth',

    'django_otp',
    'django_otp.plugins.otp_totp',
    'qrcode',


]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'users.middleware.JWTAuthenticationMiddleware',
    'users.middleware.UpdateLastSeenMiddleware'
]





ROOT_URLCONF = 'pong.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pong.wsgi.application'
ASGI_APPLICATION = 'pong.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis', 6379)],
        },
    },
}


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'db_pong', 
        'USERNAME': 'root', 
        'PASSWORD': 'rootroot',
        'HOST': 'database',
        'PORT': '5432',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR/'main/static']

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'users.User'

CORS_ALLOW_CREDENTIALS= True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080"
]

# CSRF_TRUSTED_ORIGINS = ['http://localhost:8090/'] //TODO CHECK IF NOT A PROBLEM TO REMOVE THIS


AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)
