from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # 1. The Admin route
    path('admin/', admin.site.urls),
    
    # 2. Include the analytics URLs 
    # (Note: We do NOT import views here; we use include() instead)
    path('api/', include('analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)