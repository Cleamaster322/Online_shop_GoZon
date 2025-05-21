from django.middleware.csrf import get_token
from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer


# Create your views here.
@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def test(request):
    return Response({"test": 123321})

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def test_post(request):
    name = request.data.get('name','default')
    return Response({"name": name})

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def get_all_user(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def get_csrf_token(request):
    token = get_token(request)
    return Response({'csrf_token': token})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)