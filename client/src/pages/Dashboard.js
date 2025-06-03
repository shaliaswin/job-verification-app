import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink, Outlet } from 'react-router-dom';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const Sidebar = styled.div`
  width: 250px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
`;

const Logo = styled.div`
  padding: 0 1.5rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
`;

const NavItem = styled(NavLink)`
  display: block;
  padding: 0.75rem 1.5rem;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: #edf2f7;
    color: #667eea;
  }
  
  &.active {
    background-color: #ebf4ff;
    color: #667eea;
    border-right: 3px solid #667eea;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  color: #2d3748;
  font-size: 1.5rem;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Sidebar>
        <Logo>DataEntry</Logo>
        <NavItem to="/dashboard">Dashboard</NavItem>
        <NavItem to="/kas">Kas</NavItem>
        <NavItem to="/absensi">Absensi</NavItem>
      </Sidebar>
      
      <MainContent>
        <Header>
          <PageTitle>Dashboard Overview</PageTitle>
          <UserProfile>
            <span>Admin User</span>
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          </UserProfile>
        </Header>
        
        <Outlet />
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
