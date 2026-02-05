from django.urls import path
from .views import UploadDatasetView, DatasetListView, DatasetDetailView, export_pdf

urlpatterns = [
    # Matches: /api/datasets/
    path('datasets/', DatasetListView.as_view(), name='history'),
    
    # Matches: /api/datasets/upload/
    path('datasets/upload/', UploadDatasetView.as_view(), name='upload'),
    
    # Matches: /api/datasets/<id>/
    path('datasets/<int:pk>/', DatasetDetailView.as_view(), name='detail'),
    
    # Matches: /api/report/<id>/
    path('report/<int:dataset_id>/', export_pdf, name='report_pdf'),
]