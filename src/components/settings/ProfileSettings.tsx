import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAppSelector } from '../../app/hooks';

const ProfileSettings: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.uid) return;
    
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setProfile(docSnap.data() as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), profile);
      // Show success message
    }
      //
  };

  return (
    <Paper className="profile-settings">
      <Typography variant="h6" gutterBottom>
        Profile Settings
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Display Name"
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={profile.email}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProfileSettings;
