import io
import pandas as pd
from django.db import transaction
from django.http import HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from reportlab.pdfgen import canvas

from .models import Dataset, Equipment
from .serializers import DatasetSerializer, EquipmentSerializer

# --- 1. UPLOAD & ANALYTICS VIEW ---
class UploadDatasetView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"message": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Parse CSV using Pandas
            df = pd.read_csv(file)
            
            # Calculate metrics
            avg_data = df[['Flowrate', 'Pressure', 'Temperature']].mean()
            type_counts = df['Type'].value_counts().to_dict()

            with transaction.atomic():
                # 2. Save Dataset Summary
                dataset = Dataset.objects.create(
                    filename=file.name,
                    total_equipment=len(df),
                    avg_flowrate=round(avg_data['Flowrate'], 2),
                    avg_pressure=round(avg_data['Pressure'], 2),
                    avg_temperature=round(avg_data['Temperature'], 2),
                    type_distribution=type_counts
                )

                # 3. Save Equipment Rows
                equipment_objs = [
                    Equipment(
                        dataset=dataset,
                        name=row.get('Equipment Name', 'Unknown'),
                        type=row.get('Type', 'Unknown'),
                        flowrate=row.get('Flowrate', 0),
                        pressure=row.get('Pressure', 0),
                        temperature=row.get('Temperature', 0)
                    ) for _, row in df.iterrows()
                ]
                Equipment.objects.bulk_create(equipment_objs)

                # 4. Cleanup Logic: Keep only the 10 most recent datasets
                all_datasets = Dataset.objects.order_by('-upload_timestamp')
                if all_datasets.count() > 10:
                    ids_to_keep = all_datasets.values_list('id', flat=True)[:10]
                    Dataset.objects.exclude(id__in=ids_to_keep).delete()

            return Response(DatasetSerializer(dataset).data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"message": f"Processing error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

# --- 2. HISTORY LIST VIEW ---
class DatasetListView(APIView):
    def get(self, request):
        datasets = Dataset.objects.all().order_by('-upload_timestamp')
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data)

# --- 3. DETAIL & DELETE VIEW ---
class DatasetDetailView(APIView):
    def get(self, request, pk):
        dataset = get_object_or_404(Dataset, pk=pk)
        equipment = Equipment.objects.filter(dataset=dataset)
        
        return Response({
            "dataset": DatasetSerializer(dataset).data,
            "equipment": EquipmentSerializer(equipment, many=True).data
        })

    def delete(self, request, pk):
        dataset = get_object_or_404(Dataset, pk=pk)
        dataset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- 4. PDF GENERATION VIEW ---
def export_pdf(request, dataset_id):
    try:
        dataset = get_object_or_404(Dataset, id=dataset_id)

        # Create an in-memory buffer (Prevents Render filesystem errors)
        buffer = io.BytesIO()

        # Create the PDF object using the buffer
        p = canvas.Canvas(buffer)
        
        # Header
        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, 800, "Industrial Analytics Report")
        p.setFont("Helvetica", 12)
        p.drawString(100, 780, f"Filename: {dataset.filename}")
        p.drawString(100, 760, f"Date: {dataset.upload_timestamp.strftime('%Y-%m-%d %H:%M')}")
        
        # Stats
        p.line(100, 745, 500, 745)
        p.drawString(100, 720, f"Total Equipment: {dataset.total_equipment}")
        p.drawString(100, 700, f"Average Flowrate: {dataset.avg_flowrate} L/min")
        p.drawString(100, 680, f"Average Pressure: {dataset.avg_pressure} PSI")
        p.drawString(100, 660, f"Average Temperature: {dataset.avg_temperature} °C")
        
        # Distribution
        p.drawString(100, 630, "Type Distribution:")
        y = 610
        if isinstance(dataset.type_distribution, dict):
            for eq_type, count in dataset.type_distribution.items():
                p.drawString(120, y, f"- {eq_type}: {count}")
                y -= 20

        p.showPage()
        p.save()

        # Rewind the buffer to the beginning
        buffer.seek(0)
        
        # FileResponse handles content-type and headers automatically
        return FileResponse(
            buffer, 
            as_attachment=True, 
            filename=f"report-{dataset_id}.pdf"
        )
    except Exception as e:
        return HttpResponse(f"Error generating PDF: {str(e)}", status=500)
