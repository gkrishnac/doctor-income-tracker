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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Deductible {
  id?: string;
  name: string;
  type: 'PRE_SHARE' | 'POST_SHARE';
  amount: number;
}

const DeductiblesSettings: React.FC = () => {
  const [deductibles, setDeductibles] = useState<Deductible[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Deductible | null>(null);
  const [formData, setFormData] = useState<Deductible>({
    name: '',
    type: 'PRE_SHARE',
    amount: 0,
  });

  useEffect(() => {
    fetchDeductibles();
  }, []);

  const fetchDeductibles = async () => {
    const deductiblesRef = collection(db, 'deductibles');
    const snapshot = await getDocs(deductiblesRef);
    const deductiblesList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Deductible));
    setDeductibles(deductiblesList);
  };

  // ... Rest of the component similar to EstablishmentSettings
  // with appropriate modifications for deductibles
};

export default DeductiblesSettings;
