import express from "express";
import UsuarioRoutes from "./routes/userRoutes";
import DiseaseRoutes from "./routes/diseaseRoutes";
import NotificationRoutes from "./routes/notificationRoutes";
import MedicineRoutes from "./routes/MedicinesRoutes";
import histRoutes from "./routes/histRoutes";
import MedicalRecordsRoutes from "./routes/MedicalRecordsRoutes";
import PatientRoutes from "./routes/patientRoutes";
import assessmentRoutes from "./routes/assessmentRoutes";

const app = express();

app.use(UsuarioRoutes);
app.use(DiseaseRoutes);
app.use(NotificationRoutes);
app.use(MedicineRoutes);
app.use(histRoutes);
app.use(MedicalRecordsRoutes);
app.use(PatientRoutes);
app.use(assessmentRoutes);

export default app;
