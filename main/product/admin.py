from django.contrib import admin
from .models import City, Category, User, Product, CartItem, Delivery, ProductImage


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'userName', 'email', 'city', 'created_at')
    search_fields = ('userName', 'email')
    list_filter = ('city',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'seller', 'price', 'stock', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('category', 'seller')


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity', 'added_at')
    search_fields = ('user__userName', 'product__name')
    list_filter = ('added_at',)


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'status')
    list_filter = ('status',)
    search_fields = ('user__userName', 'product__name')


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'image_url')
    search_fields = ('product__name',)
