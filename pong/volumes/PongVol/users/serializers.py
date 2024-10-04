from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'username', 'avatar_url', 'user_wins']
        extra_kwargs = {
            'password': {'write_only': True}
        }
 
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instace = self.Meta.model(**validated_data)
        if password is not None:
            instace.set_password(password)
        instace.save()
        return instace
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.url
        return None