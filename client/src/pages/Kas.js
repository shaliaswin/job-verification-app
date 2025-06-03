import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 600;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #5a67d8;
  }
`;

const Kas = () => {
  const [transactionType, setTransactionType] = useState('masuk');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
  };

  return (
    <FormContainer>
      <FormTitle>Entry Data Kas</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Jenis Transaksi</Label>
          <Select 
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="masuk">Kas Masuk</option>
            <option value="keluar">Kas Keluar</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Tanggal</Label>
          <Input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormGroup>

        {transactionType === 'keluar' && (
          <>
            <FormGroup>
              <Label>Lokasi</Label>
              <Select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              >
                <option value="">Pilih Lokasi</option>
                <option value="Batavia">Batavia</option>
                <option value="Puri">Puri</option>
                <option value="Proyek">Proyek</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Jenis Pengeluaran</Label>
              <Select 
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value)}
                required
              >
                <option value="">Pilih Jenis Pengeluaran</option>
                <option value="bensin">Bensin</option>
                <option value="oli">Oli</option>
                <option value="sparepart">Sparepart</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Jumlah (Rp)</Label>
              <Input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </FormGroup>
          </>
        )}

        <Button type="submit">Simpan Data</Button>
      </form>
    </FormContainer>
  );
};

export default Kas;
