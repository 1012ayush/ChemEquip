⚗️ Chemical Equipment Parameter Visualizer

Hybrid Web + Desktop Analytics Suite

  
📖 Project Overview

This application is a full-stack hybrid solution designed for the chemical industry. It enables engineers to upload CSV data, perform automated analytics via a Django backend, and visualize critical parameters (Flowrate, Pressure, Temperature) across both Web and Desktop environments.

✨ Key Features

🌐 Dual-Frontend Architecture: Modern React web app and a robust PyQt5 desktop application.

📊 Advanced Analytics: Automated processing using Pandas for statistical summaries.

📈 Dynamic Visualization: High-fidelity charts using Chart.js (Web) and Matplotlib (Desktop).

📜 History Tracking: Automatic persistence of the last 5 datasets for quick comparison.

📄 PDF Reporting: One-click generation of professional PDF summaries.

🔒 Secure Access: Integrated authentication layer to protect industrial data.

🛠️ Tech Stack

Layer,Technology,Purpose

Backend,+ DRF,Centralized REST API & Business Logic

Data Engine,,CSV Parsing & Automated Statistical Analysis

Web Frontend,+ Vite,Responsive browser-based UI with fast HMR

Desktop Frontend,,High-performance native desktop environment

Visualization,Chart.js / Matplotlib,High-fidelity interactive data plotting & charting

Database,,Production-grade storage (Hosted on Neon)

Type Safety,+ Zod,Shared schemas for end-to-end API consistency

📁 Project Structure

.
├── analytics/           # Django App: Logic, Parsing & Models

│   ├── migrations/      # Database migrations

│   ├── models.py        # Equipment & History schemas

│   └── views.py         # API logic for data processing

├── client/              # React.js Web Application (Vite)

│   ├── src/             # Frontend components & hooks

│   └── public/          # Static assets

├── desktop/             # PyQt5 Desktop Application

│   ├── main.py          # Desktop Entry point

│   └── ui_components/   # Matplotlib integration logic

├── industrial_api/      # Django Project Settings & Routing

├── shared/              # Shared TypeScript API contracts

├── manage.py            # Django CLI tool

└── requirements.txt     # Python dependencies

Setup Instructions

1️⃣ Backend (API)# Create & Activate Virtual Environment
python -m venv venv
.\venv\Scripts\activate# Install & Migrate
pip install -r requirements.txt
python manage.py migrate# Start Engine
python manage.py runserver

2️⃣ Web Frontendcd client
npm install
npm run dev

3️⃣ Desktop Frontend

cd desktop
python main.py

Testing with Sample Data
A file named sample_equipment_data.csv is provided in the root directory. Use this file to test:
Upload functionality via the Web or Desktop dashboard.
Chart generation to verify parameter scaling.
PDF export to ensure report formatting is correct.

Submission Details
Developer: 1012ayush
## 🔗 Project Links

- 🎥 **Demo Video:** [Watch on Google Drive](https://drive.google.com/drive/folders/1TFnamXvHcHbSywNUvFkj9d5VapKCc9Z1?usp=drive_link)
- 🚀 **Live App:** [Open Live Application](https://chemequip-fronts.onrender.com)  make the demo video , live app link clickable 
