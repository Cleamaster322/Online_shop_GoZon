from rest_framework import serializers
from .models import Product
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