import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import './Register.scss';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: formData.email,
        displayName: formData.displayName,
        role: 'doctor',
        createdAt: new Date(),
      });

    
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} className="register-paper">
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="register-form">
          <TextField
            margin="normal"
            required
            fullWidth
            name="displayName"
            label="Full Name"
            autoFocus
            value={formData.displayName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email Address"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="submit-button"
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
