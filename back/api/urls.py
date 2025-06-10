"""
URL configuration for back project.

The `urlpatterns` list routes URLs to  For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import *

urlpatterns = [
    # --- CITY FUNCTIONS ---
    path('cities/', get_all_cities),
    path('cities/<int:pk>/', get_city),
    path('cities/create/', post_city),
    path('cities/<int:pk>/update/', update_city),
    path('cities/<int:pk>/delete/', delete_city),

    # --- DeliveryPoint ---
    path('api/deliverypoints/', get_all_delivery_points),
    path('api/deliverypoints/<int:pk>/', get_delivery_point),
    path('api/deliverypoints/create/', post_delivery_point),
    path('api/deliverypoints/<int:pk>/update/', update_delivery_point),
    path('api/deliverypoints/<int:pk>/delete/', delete_delivery_point),

    # --- USER FUNCTIONS ---
    path('users/', get_all_users),
    path('users/<int:pk>/', get_user),
    path('users/create/', post_user),
    path('users/<int:pk>/update/', update_user),
    path('users/<int:pk>/delete/', delete_user),
    path('user/me/', get_me),

    # --- CATEGORY URLS ---
    path('categories/', get_all_categories),
    path('categories/<int:pk>/', get_category),
    path('categories/create/', post_category),
    path('categories/<int:pk>/update/', update_category),
    path('categories/<int:pk>/delete/', delete_category),

    # --- PRODUCT URLS ---
    path('products/', get_all_products),
    path('products/<int:pk>/', get_product),
    path('products/create/', post_product),
    path('products/<int:pk>/update/', update_product),
    path('products/<int:pk>/delete/', delete_product),

    # --- CARTITEM URLS ---
    path('cartitems/', get_all_cartitems),
    path('cartitems/<int:pk>/', get_cartitem),
    path('cartitems/create/', post_cartitem),
    path('cartitems/<int:pk>/update/', update_cartitem),
    path('cartitems/<int:pk>/delete/', delete_cartitem),

    # --- DELIVERY URLS ---
    path('deliveries/', get_all_deliveries),
    path('deliveries/<int:pk>/', get_delivery),
    path('deliveries/create/', post_delivery),
    path('deliveries/<int:pk>/update/', update_delivery),
    path('deliveries/<int:pk>/delete/', delete_delivery),

    # --- PRODUCTIMAGE URLS ---
    path('productimages/', get_all_productimages),
    path('productimages/<int:pk>/', get_productimage),
    path('productimages/create/', post_productimage),
    path('productimages/<int:pk>/update/', update_productimage),
    path('productimages/<int:pk>/delete/', delete_productimage),
    path('productimages/upload/', upload_product_image),

    path('get_csrf_token/', get_csrf_token),
]

urlpatterns += [
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('token/verify/', TokenObtainPairView.as_view()),
]
