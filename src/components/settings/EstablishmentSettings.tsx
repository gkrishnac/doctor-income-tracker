import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAppSelector } from '../../app/hooks';

interface Establishment {
  id?: string;
  name: string;
  type: string;
  sharePercentage: number;
}

const EstablishmentSettings: React.FC = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Establishment | null>(null);
  const [formData, setFormData] = useState<Establishment>({
    name: '',
    type: '',
    sharePercentage: 0,
  });
  
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    if (!user) return;
    
    const establishmentsRef = collection(db, 'establishments');
    const snapshot = await getDocs(establishmentsRef);
    const establishmentsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Establishment));
    setEstablishments(establishmentsList);
  };

  const handleOpen = (item?: Establishment) => {
    if (item) {
      setEditItem(item);
      setFormData(item);
    } else {
      setEditItem(null);
      setFormData({ name: '', type: '', sharePercentage: 0 });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
  };

  const handleSubmit = async () => {
    try {
      if (editItem?.id) {
        await updateDoc(doc(db, 'establishments', editItem.id), formData);
      } else {
        await addDoc(collection(db, 'establishments'), {
          ...formData,
          userId: user?.uid,
        });
      }
      fetchEstablishments();const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'establishments', id));
      fetchEstablishments();
    }
  };

  return (
    <div className="establishments-settings">
      <div className="header">
        <Typography variant="h6">Establishments</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Establishment
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Share %</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {establishments.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.sharePercentage}%</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => item.id && handleDelete(item.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editItem ? 'Edit Establishment' : 'Add Establishment'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Share Percentage"
            type="number"
            fullWidth
            value={formData.sharePercentage}
            onChange={(e) => setFormData({ ...formData, sharePercentage: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EstablishmentSettings;
