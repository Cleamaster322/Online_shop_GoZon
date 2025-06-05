from django.middleware.csrf import get_token
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_user(request):
    try:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'detail': 'Ошибка сервера при получении пользователей', 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


from django.middleware.csrf import get_token


@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    try:
        token = get_token(request)
        return Response({'csrf_token': token})
    except Exception as e:
        return Response(
            {'detail': 'Ошибка сервера при получении CSRF токена', 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    try:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'detail': 'Ошибка сервера при получении данных пользователя', 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    try:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
