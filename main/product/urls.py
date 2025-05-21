from django.urls import path
from .views import *

urlpatterns = [
    path('all_products/', all_products),
    path('add_product/', add_product),
    path('product/<int:pk>/', get_product_by_id),
    path('product/<int:pk>/update/', update_product),
    path('product/<int:pk>/patch/', patch_product),
    path('product/<int:pk>/delete/', delete_product),
    path('product/search/', ProductSearch.as_view()),

    path('city', get_all_cities),
    path('user', get_all_users),
    path('city/<int:pk>/', get_city_by_id),
    path('user/<int:pk>/', get_user_by_id),
    path('create_city/', create_city),
    path('register/', register_user),

    path('get_csrf_token/', get_csrf_token),
    path("user/me/", get_current_user),
    path('test2/', test2),
]
