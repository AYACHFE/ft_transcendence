

from django.core.mail import EmailMessage
from .models import User , verification_code
import random
import string



class Emailing():

    def __init__(self, email):
        self.email = email
    
    
    def send_mail(self):
        code = ''.join(random.choices(string.digits, k=6))
        codeclass = verification_code(email=self.email, code=code)
        codeclass.save()
        mail_subject = "Verification Code From Ping Pong."
        mail_message = f'this is the verification code [{codeclass.code}].'
        mail_email = self.email
        mail = EmailMessage(subject=mail_subject , body=mail_message, to=[mail_email])
        if mail.send():
            return 1
        else:
            return 0