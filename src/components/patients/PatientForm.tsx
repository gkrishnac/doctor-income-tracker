import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAppSelector } from '../../app/hooks';
import './PatientForm.scss';

interface PatientData {
  name: string;
  contact: string;
  email: string;
  address: string;
  notes: string;
}

const PatientForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);
  const [formData, setFormData] = useState<PatientData>({
    name: '',
    contact: '',
    email: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    if (!id) return;
    
    const docRef = doc(db, 'patients', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setFormData(docSnap.data() as PatientData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (id) {
        await updateDoc(doc(db, 'patients', id), formData);
      } else {
        const newPatientRef = doc(collection(db, 'patients'));
        await setDoc(newPatientRef, {
          ...formData,
          doctorId: user.uid,
          createdAt: new Date(),
          totalVisits: 0,
        });
      }
      navigate('/patients');
     {
      console.}
  };

  return (
    <Paper className="patient-form">
      <Typography variant="h6">
        {id ? 'Edit Patient' : 'New Patient'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {id ? 'Update' : 'Save'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/patients')}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PatientForm;
