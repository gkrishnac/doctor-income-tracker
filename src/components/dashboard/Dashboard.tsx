import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAppSelector } from '../../app/hooks';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    monthlyIncome: 0,
    totalPatients: 0,
    pendingFollowups: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch consultations for income calculation
        const consultationsRef = collection(db, 'consultations');
        const q = query(consultationsRef, where('doctorId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        // Calculate statistics
        let total = 0;
        let monthly = 0;
        const currentMonth = new Date().getMonth();
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += data.finalAmount;
          if (data.appointmentDate.toDate().getMonth() === currentMonth) {
            monthly += data.finalAmount;
          }
        });

        setStats({
          totalIncome: total,
          monthlyIncome: monthly,
          totalPatients: querySnapshot.size,
          pendingFollowups: 0, // Calculate based on your follow-up logic
        });

        setLoading(false););
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Dashboard</Typography>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h5">
                ₹{stats.totalIncome.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Monthly Income
              </Typography>
              <Typography variant="h5">
                ₹{stats.monthlyIncome.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Patients
              </Typography>
              <Typography variant="h5">
                {stats.totalPatients}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper className="chart-container">
            <Typography variant="h6">Monthly Income Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
