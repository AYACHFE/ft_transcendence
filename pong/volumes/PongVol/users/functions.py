
import jwt, datetime
from .models import User, TokensCustom
from django.utils import timezone
from django.conf import settings



def gen_token(user):
    if user:
        payload = {
            'id': user.id,
            'otp':False,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=2),
            'iat': datetime.datetime.utcnow()
        }
        token  = jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')
        decoded = jwt.decode(token,settings.JWT_SECRET, algorithms=['HS256'])
        TokensCustom.delete_expired_tokens(user)
        savetoken = TokensCustom()
        savetoken.token = token
        savetoken.created_at = datetime.datetime.fromtimestamp(decoded['iat'])
        savetoken.expires_at = datetime.datetime.fromtimestamp(decoded['exp'])
        savetoken.user_id = user
        savetoken.save()
        return token
    
def gen_token_otp(user):
    if user:
        payload = {
            'id': user.id,
            'otp':True,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=2),
            'iat': datetime.datetime.utcnow()
        }
        token  = jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')
        return token
    

def verify_token_otp(token):
    if not token:
        raise Exception('not token')
        return None
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
    if datetime.datetime.fromtimestamp(payload['exp'], tz=timezone.utc) < timezone.now():
        raise Exception('time exceeded')    
        return None
    user = User.objects.filter(id = payload['id']).first()
    if not user:
        raise Exception('not user')
        return None
    return user

    





import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from django_otp.models import Device
from django_otp.plugins.otp_totp.models import TOTPDevice





def create_totp_device(user):
    totp_device , created = TOTPDevice.objects.get_or_create(user=user, confirmed=False)
    if created:
        totp_device.generate_challenge()
    return totp_device



def generate_qr_code(totp_device):
    qr_url = totp_device.config_url
    qr_image = qrcode.make(qr_url)
    buffer = BytesIO()
    qr_image.save(buffer, "PNG")
    qr_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return qr_base64

import urllib.parse
from django_otp.plugins.otp_totp.models import TOTPDevice
import base64