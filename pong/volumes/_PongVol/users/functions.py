
import jwt, datetime
from .models import User



def gen_token(user):
    payload = {
        'id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=2),
        'iat': datetime.datetime.utcnow()
    }
    token  = jwt.encode(payload, 'secret', algorithm='HS256')
    return token