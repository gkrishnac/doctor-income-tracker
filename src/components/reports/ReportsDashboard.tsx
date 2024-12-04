import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Download } from '@mui/icons-material';
import MonthlyIncomeChart from './MonthlyIncomeChart';
import EstablishmentAnalysis from './EstablishmentAnalysis';
import IncomeBreakdown from './IncomeBreakdown';
import { exportToExcel } from '../../utils/exportUtils';
import './Reports.scss';

const ReportsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });
  const [selectedView, setSelectedView] = useState('monthly');

  const handleExport = async () => {
    // Implementation of export functionality
  };

  return (
    <div className="reports-dashboard">
      <Box className="header">
        <Typography variant="h5">Financial Reports</Typography>
        <Box className="controls">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>View</InputLabel>
            <Select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            label="Start Date"
            value={dateRange.startDate}
            onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
          />
          <DatePicker
            label="End Date"
            value={dateRange.endDate}
            onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
          />
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className="chart-paper">
            <MonthlyIncomeChart dateRange={dateRange} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="chart-paper">
            <EstablishmentAnalysis dateRange={dateRange} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="chart-paper">
            <IncomeBreakdown dateRange={dateRange} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReportsDashboard;
