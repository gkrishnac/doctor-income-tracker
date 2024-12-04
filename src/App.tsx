import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import PatientList from './components/patients/PatientList';
import PatientForm from './components/patients/PatientForm';
import ConsultationForm from './components/consultations/ConsultationForm';
import ConsultationList from './components/consultations/ConsultationList';
import ReportsDashboard from './components/reports/ReportsDashboard';
import Settings from './components/settings/Settings';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SyncStatus from './components/sync/SyncStatus';
import './App.scss';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientForm />} />
            <Route path="/consultations" element={<ConsultationList />} />
            <Route path="/consultations/new" element={<ConsultationForm />} />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <SyncStatus />
        </MainLayout>
      </Router>
    </Provider>
  );
};

export default App;
