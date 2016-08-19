from rest_framework import generics
from rest_framework import filters
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth.models import User
from APPS.accounts.serializers import UserSerializer
from django.views.generic import TemplateView

# Create your views here.
@authentication_classes((TokenAuthentication, SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
class UserListAPI(generics.ListAPIView):
    serializer_class = UserSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields =  ('username',)

    def get_queryset(self):
        user = self.request.user
        print(user)
        if user.is_superuser or user.study_manager:
            users = User.objects.all()
            return users
        return User.objects.none()


