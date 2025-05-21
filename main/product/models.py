import os
from django.db import models
from django.core.files.storage import default_storage
from django.utils.deconstruct import deconstructible

#Что бы сохранять и восстанавливать объекты класса при миграциях
@deconstructible
class PathAndRename:
    def __call__(self, instance, filename):
        if instance.pk:
            return f'product_images/{instance.pk}/{filename}'
        return f'product_images/temp/{filename}'  # Временный путь до получения ID

path_and_rename = PathAndRename()

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to=path_and_rename, blank=True, default='static/img/default_product.jpg')
    price = models.DecimalField(decimal_places=2, max_digits=10)
    in_stock = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        first_save = self.pk is None
        super().save(*args, **kwargs)

        # Перемещаем файл после первого сохранения
        if first_save and self.image:
            filename = os.path.basename(self.image.name)
            new_path = f'product_images/{self.pk}/{filename}'

            # Чтение и запись файла в новое место
            file = self.image
            new_file = default_storage.save(new_path, file)

            # Обновление поля
            self.image.name = new_path
            super().save(update_fields=['image'])