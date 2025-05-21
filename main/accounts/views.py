from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import (api_view, authentication_classes, permission_classes)
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import  AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def registration(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username , password=password)
    token, _ = Token.objects.get_or_create(user=user) # Второе значение мне не нужно, передает Создал или взял(True, False)
    return Response({"token": token.key}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def logout(request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    logout(request) # Удаляет данные сессии
    return Response({"message": "Logged out succesfuly"},status=status.HTTP_200_OK)

# ------------------ Sessions
@api_view(['POST'])
def save_to_session(request):
    request.session['cart'] = {'product_id': 42, 'qty': 3}
    return Response({'detail': 'Cart saved'})

@api_view(['GET'])
def get_from_session(request):
    cart = request.session.get('cart', {})
    return Response({'cart': cart})

@api_view(['POST'])
def clear_session(request):
    request.session.flush()
    return Response({'detail': 'Session cleared'})


