from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser')


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=254, trim_whitespace=True)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        identifier = attrs['email'].strip()
        try:
            if '@' in identifier:
                account = User.objects.get(email__iexact=identifier)
            else:
                account = User.objects.get(username__iexact=identifier)
        except (User.DoesNotExist, User.MultipleObjectsReturned):
            account = None

        user = None
        if account:
            user = authenticate(
                request=self.context.get('request'),
                username=account.get_username(),
                password=attrs['password'],
            )

        if not user or not user.is_active or not (user.is_staff or user.is_superuser):
            raise AuthenticationFailed('Invalid email or password.')

        attrs['user'] = user
        return attrs