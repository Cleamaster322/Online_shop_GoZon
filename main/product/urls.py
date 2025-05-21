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
    path('city/<int:pk>/', get_city_by_id),
    path('create_city/', create_city),
]
