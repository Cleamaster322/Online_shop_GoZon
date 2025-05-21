from rest_framework import serializers
from .models import City, User, Category, Product, CartItem, Delivery, ProductImage

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)  # вложенный сериализатор для города, если нужен

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'city', 'is_staff', 'is_active', 'created_at']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    seller = UserSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'category', 'seller', 'name', 'description', 'stock', 'price', 'created_at']

class CartItemSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)

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
