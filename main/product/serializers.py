from rest_framework import serializers
from .models import *
import bleach

class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'in_stock', 'image', 'created_at']

# Защита от XSS
    def validate_name(self, value):
        if '<script>' in value.lower():
            raise serializers.ValidationError("В названии не может быть HTML!")
        return value

    def validate_description(self, value):
        clean_value = bleach.clean(value, tags=[], strip=True)
        return clean_value

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']

    def validate_name(self, value):
        if '<script>' in value.lower():
            raise serializers.ValidationError("В названии не может быть HTML!")

        value = value.strip()
        if not value:
            raise serializers.ValidationError("Название не может быть пустым.")
        value = value[0].upper() + value[1:].lower()
        print(value,"**********************")
        return value
