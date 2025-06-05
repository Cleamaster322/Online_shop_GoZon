import os

from django.core.files.storage import default_storage
from django.middleware.csrf import get_token
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import User, Category, Product, CartItem, Delivery, ProductImage
from .serializers import UserSerializer, CategorySerializer, ProductSerializer, CartItemSerializer, DeliverySerializer, \
    ProductImageSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import City
from .serializers import CitySerializer


# --- CITY FUNCTIONS ---
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_cities(request):
    try:
        cities = City.objects.all()
        serializer = CitySerializer(cities, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_city(request, pk):
    try:
        city = City.objects.get(pk=pk)
        serializer = CitySerializer(city)
        return Response(serializer.data)
    except City.DoesNotExist:
        return Response({'detail': 'Город не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def post_city(request):
    try:
        serializer = CitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
def update_city(request, pk):
    try:
        city = City.objects.get(pk=pk)
        serializer = CitySerializer(city, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except City.DoesNotExist:
        return Response({'detail': 'Город не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_city(request, pk):
    try:
        city = City.objects.get(pk=pk)
        city.delete()
        return Response({'detail': 'Город удалён'}, status=status.HTTP_204_NO_CONTENT)
    except City.DoesNotExist:
        return Response({'detail': 'Город не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- CITY FUNCTIONS ---
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_users(request):
    try:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении пользователей', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'detail': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении пользователя', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def post_user(request):
    try:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при создании пользователя', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
def update_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'detail': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при обновлении пользователя', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.delete()
        return Response({'detail': 'Пользователь удалён'}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({'detail': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при удалении пользователя', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


# --- CATEGORY FUNCTIONS ---

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_categories(request):
    try:
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении категорий', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({'detail': 'Категория не найдена'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении категории', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def post_category(request):
    try:
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при создании категории', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
def update_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
        serializer = CategorySerializer(category, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Category.DoesNotExist:
        return Response({'detail': 'Категория не найдена'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при обновлении категории', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
        category.delete()
        return Response({'detail': 'Категория удалена'}, status=status.HTTP_204_NO_CONTENT)
    except Category.DoesNotExist:
        return Response({'detail': 'Категория не найдена'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при удалении категории', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- PRODUCT FUNCTIONS ---

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_products(request):
    try:
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении товаров', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Товар не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении товара', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_product(request):
    try:
        data = request.data.copy()
        data['seller'] = request.user.id  # ← автоматически проставляем seller
        print(data)
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при создании товара', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
def update_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Product.DoesNotExist:
        return Response({'detail': 'Товар не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при обновлении товара', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        product.delete()
        return Response({'detail': 'Товар удалён'}, status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response({'detail': 'Товар не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при удалении товара', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- CARTITEM FUNCTIONS ---

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_cartitems(request):
    try:
        items = CartItem.objects.all()
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении корзины', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_cartitem(request, pk):
    try:
        item = CartItem.objects.get(pk=pk)
        serializer = CartItemSerializer(item)
        return Response(serializer.data)
    except CartItem.DoesNotExist:
        return Response({'detail': 'Элемент корзины не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении элемента корзины', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def post_cartitem(request):
    try:
        serializer = CartItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при добавлении в корзину', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
def update_cartitem(request, pk):
    try:
        item = CartItem.objects.get(pk=pk)
        serializer = CartItemSerializer(item, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except CartItem.DoesNotExist:
        return Response({'detail': 'Элемент корзины не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при обновлении корзины', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_cartitem(request, pk):
    try:
        item = CartItem.objects.get(pk=pk)
        item.delete()
        return Response({'detail': 'Элемент корзины удалён'}, status=status.HTTP_204_NO_CONTENT)
    except CartItem.DoesNotExist:
        return Response({'detail': 'Элемент корзины не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при удалении элемента корзины', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- DELIVERY FUNCTIONS ---

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_deliveries(request):
    try:
        deliveries = Delivery.objects.all()
        serializer = DeliverySerializer(deliveries, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении доставок', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_delivery(request, pk):
    try:
        delivery = Delivery.objects.get(pk=pk)
        serializer = DeliverySerializer(delivery)
        return Response(serializer.data)
    except Delivery.DoesNotExist:
        return Response({'detail': 'Доставка не найдена'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении доставки', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def post_delivery(request):
    try:
        serializer = DeliverySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при создании доставки', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
def update_delivery(request, pk):
    try:
        delivery = Delivery.objects.get(pk=pk)
        serializer = DeliverySerializer(delivery, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Delivery.DoesNotExist:
        return Response({'detail': 'Доставка не найдена'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при обновлении доставки', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_delivery(request, pk):
    try:
        delivery = Delivery.objects.get(pk=pk)
        delivery.delete()
        return Response({'detail': 'Доставка удалена'}, status=status.HTTP_204_NO_CONTENT)
    except Delivery.DoesNotExist:
        return Response({'detail': 'Доставка не найдена'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при удалении доставки', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- PRODUCTIMAGE FUNCTIONS ---

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_productimages(request):
    try:
        images = ProductImage.objects.all()
        serializer = ProductImageSerializer(images, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении изображений', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_productimage(request, pk):
    try:
        image = ProductImage.objects.get(pk=pk)
        serializer = ProductImageSerializer(image)
        return Response(serializer.data)
    except ProductImage.DoesNotExist:
        return Response({'detail': 'Изображение не найдено'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при получении изображения', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def post_productimage(request):
    try:
        serializer = ProductImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при создании изображения', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
def update_productimage(request, pk):
    try:
        image = ProductImage.objects.get(pk=pk)
        serializer = ProductImageSerializer(image, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ProductImage.DoesNotExist:
        return Response({'detail': 'Изображение не найдено'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при обновлении изображения', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_productimage(request, pk):
    try:
        image = ProductImage.objects.get(pk=pk)
        image.delete()
        return Response({'detail': 'Изображение удалено'}, status=status.HTTP_204_NO_CONTENT)
    except ProductImage.DoesNotExist:
        return Response({'detail': 'Изображение не найдено'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': 'Ошибка сервера при удалении изображения', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def upload_product_image(request):
    try:
        product_id = request.data.get('product_id')
        image = request.FILES.get('image')

        if not product_id or not image:
            return Response({'detail': 'product_id и image обязательны'}, status=status.HTTP_400_BAD_REQUEST)

        filename = '1.jpg'  # сохраняем всегда как 1.jpg (для теста)
        folder_path = os.path.join('media', str(product_id))
        file_path = os.path.join(folder_path, filename)

        full_path = os.path.join(default_storage.location, file_path)

        # Создаём папку, если нужно
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        # Сохраняем файл
        with default_storage.open(file_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)

        # Создаём объект ProductImage
        image_record = ProductImage.objects.create(
            product_id=product_id,
            image_url=f"/media/{product_id}/{filename}"
        )

        return Response({
            'id': image_record.id,
            'image_url': image_record.image_url
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'detail': 'Ошибка загрузки изображения', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
