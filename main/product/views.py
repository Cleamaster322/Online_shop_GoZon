from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import (api_view, authentication_classes, permission_classes)
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Product, City
from .serializers import ProductSerializer, CitySerializer


# Create your views here.

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def all_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# ----------- Защита от вредоносных атак
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_product(request):
    if 'image' in request.FILES:
        image = request.FILES['image']
        #Проверка типа данных
        if not image.content_type.startswith('image/'):
            return Response({'message': 'Invalid image type'}, status=status.HTTP_400_BAD_REQUEST)
        if image.size > 5 * 1024 * 1024:
            return Response({'message': 'Image is too big'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_object(pk):
    try:
        return Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return None

@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def get_product_by_id(request, pk):
    product = get_object(pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_product(request, pk):
    product = get_object(pk)
    serializer = ProductSerializer(product, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def patch_product(request, pk):
    product = get_object(pk)
    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_product(request, pk):
    product = get_object(pk)
    product.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# Класс для отображения отфильтрованного списка пользователей
class ProductSearch(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']
    permission_classes = [AllowAny]


# --------------------------------------------City-------------------------------------
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_cities(request):
    cities = City.objects.filter()
    serializer = CitySerializer(cities, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_city_by_id(request, pk):
    city = City.objects.filter(id=pk).first()
    if not city:
        return Response({"detail": "City not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = CitySerializer(city)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_city(request):
    serializer = CitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_city_put(request, pk):
    city = City.objects.filter(id=pk).first()
    if not city:
        return Response({"detail": "City not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CitySerializer(city, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_city_patch(request, pk):
    city = City.objects.filter(id=pk).first()
    if not city:
        return Response({"detail": "City not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CitySerializer(city, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_city(request, pk):
    city = City.objects.filter(id=pk).first()
    if not city:
        return Response({"detail": "City not found"}, status=status.HTTP_404_NOT_FOUND)

    city.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
