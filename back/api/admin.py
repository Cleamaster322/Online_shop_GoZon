from django.contrib import admin
from .models import (
    City, DeliveryPoint, User, Category, Product,
    CartItem, Delivery, ProductImage
)

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(DeliveryPoint)
class DeliveryPointAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'city')
    list_filter = ('city',)
    search_fields = ('name',)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'city', 'is_staff', 'is_active', 'created_at')
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active', 'city')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'seller', 'stock', 'price', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('category',)


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity', 'added_at')
    list_filter = ('user', 'product')


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'user', 'delivery_point', 'status', 'added_at')
    list_editable = ('status',)  # <--- делаем статус редактируемым в списке
    list_filter = ('status', 'delivery_point')
    search_fields = ('user__username', 'product__name')
    list_display_links = ('id', 'product')  # <--- обязательно убрать status отсюда


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'image_url')
    search_fields = ('product__name',)
