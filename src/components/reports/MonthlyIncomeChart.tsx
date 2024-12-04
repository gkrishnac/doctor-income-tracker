import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Typography } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAppSelector } from '../../app/hooks';

interface MonthlyIncomeChartProps {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

const MonthlyIncomeChart: React.FC<MonthlyIncomeChartProps> = ({ dateRange }) => {
  const [data, setData] = useState([]);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    if (!user) return;

    const consultationsRef = collection(db, 'consultations');
    const q = query(
      consultationsRef,
      where('doctorId', '==', user.uid),
      where('appointmentDate', '>=', dateRange.startDate),
      where('appointmentDate', '<=', dateRange.endDate)
    );

    const querySnapshot = await getDocs(q);
    // Process data for chart
    // Implementation here
  };

  return (
    <div className="monthly-income-chart">
      <Typography variant="h6" gutterBottom>
        Monthly Income Trend
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyIncomeChart;
