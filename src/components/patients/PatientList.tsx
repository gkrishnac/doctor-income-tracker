import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Add, Search, Edit } from '@mui/icons-material';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import './PatientList.scss';

interface Patient {
  id: string;
  name: string;
  contact: string;
  lastVisit: Date;
  totalVisits: number;
}

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const user = useAppSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    if (!user) return;

    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, where('doctorId', '==', user.uid));
    const snapshot = await getDocs(q);
    const patientsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Patient));
    setPatients(patientsList);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  return (
    <div className="patient-list">
      <div className="header">
        <Typography variant="h5">Patients</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/patients/new')}
        >
          Add Patient
        </Button>
      </div>

      <TextField
        className="search-field"
        variant="outlined"
        placeholder="Search patients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Total Visits</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.contact}</TableCell>
                <TableCell>
                  {patient.lastVisit?.toDate().toLocaleDateString()}
                </TableCell>
                <TableCell>{patient.totalVisits}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/patients/${patient.id}`)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PatientList;
