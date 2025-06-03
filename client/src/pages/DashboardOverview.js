import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  color: #718096;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
`;

const ChartContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const FilterButton = styled.button`
  padding: 0.375rem 0.75rem;
  background: ${props => props.active ? '#ebf4ff' : 'white'};
  color: ${props => props.active ? '#667eea' : '#4a5568'};
  border: 1px solid ${props => props.active ? '#667eea' : '#e2e8f0'};
  border-radius: 5px;
  font-size: 0.875rem;
  cursor: pointer;
`;

const DashboardOverview = () => {
  const [timeRange, setTimeRange] = useState('day');
  const [locationFilter, setLocationFilter] = useState('all');
  
  // Sample data
  const attendanceData = [
    { name: 'Puri', day: 12, month: 360, year: 4320 },
    { name: 'Batavia', day: 10, month: 300, year: 3600 },
    { name: 'Bliss', day: 4, month: 120, year: 1440 },
    { name: 'WP Batavia', day: 9, month: 270, year: 3240 },
    { name: 'WP Sepatan', day: 2, month: 60, year: 720 },
    { name: 'Proyek', day: 15, month: 450, year: 5400 },
  ];

  const cashFlowData = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
  ];

  const filteredAttendanceData = locationFilter === 'all' 
    ? attendanceData 
    : attendanceData.filter(item => item.name === locationFilter);

  return (
    <div>
      <DashboardGrid>
        <StatCard>
          <StatTitle>Total Kehadiran Hari Ini</StatTitle>
          <StatValue>52</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Kas Masuk Bulan Ini</StatTitle>
          <StatValue>Rp 12.450.000</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Kas Keluar Bulan Ini</StatTitle>
          <StatValue>Rp 8.730.000</StatValue>
        </StatCard>
      </DashboardGrid>

      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Data Kehadiran</ChartTitle>
          <FilterGroup>
            <FilterButton 
              active={timeRange === 'day'} 
              onClick={() => setTimeRange('day')}
            >
              Harian
            </FilterButton>
            <FilterButton 
              active={timeRange === 'month'} 
              onClick={() => setTimeRange('month')}
            >
              Bulanan
            </FilterButton>
            <FilterButton 
              active={timeRange === 'year'} 
              onClick={() => setTimeRange('year')}
            >
              Tahunan
            </FilterButton>
          </FilterGroup>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredAttendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={timeRange} fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
        <FilterGroup style={{ marginTop: '1rem' }}>
          <FilterButton 
            active={locationFilter === 'all'} 
            onClick={() => setLocationFilter('all')}
          >
            Semua Lokasi
          </FilterButton>
          {attendanceData.map(loc => (
            <FilterButton 
              key={loc.name}
              active={locationFilter === loc.name} 
              onClick={() => setLocationFilter(loc.name)}
            >
              {loc.name}
            </FilterButton>
          ))}
        </FilterGroup>
      </ChartContainer>

      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Arus Kas</ChartTitle>
          <FilterGroup>
            <FilterButton active>Bulanan</FilterButton>
          </FilterGroup>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#4fd1c5" />
            <Bar dataKey="expense" fill="#f56565" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default DashboardOverview;
