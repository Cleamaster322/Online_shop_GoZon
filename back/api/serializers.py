from rest_framework import serializers
from .models import City, User, Category, Product, CartItem, Delivery, ProductImage
from django.contrib.auth.hashers import make_password


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'city', 'is_staff', 'is_active', 'created_at']
        extra_kwargs = {
            'username': {'required': True},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким username уже существует")
        return value

    def validate_password(self, value):
        if not value.strip():
            raise serializers.ValidationError("Пароль не может быть пустым")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'category', 'seller', 'name', 'description', 'stock', 'price', 'created_at']


class CartItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CartItem
        fields = ['id', 'user', 'product', 'quantity', 'added_at']


class DeliverySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Delivery
        fields = ['id', 'user', 'product', 'status']


class ProductImageSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image_url']

    def validate_image_url(self, value):
        if not value.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            raise serializers.ValidationError("Поддерживаются только изображения")
        if not value.startswith('/media/') and not value.startswith('http'):
            raise serializers.ValidationError("Неверный путь к изображению")
        return value
