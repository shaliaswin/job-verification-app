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

const EmployeeList = styled.div`
  margin-top: 1.5rem;
`;

const EmployeeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
`;

const Checkbox = styled.input`
  margin-right: 0.75rem;
`;

const ReplacementSection = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 5px;
`;

const Absensi = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [employees, setEmployees] = useState([]);
  const [hasReplacement, setHasReplacement] = useState(false);
  const [replacementCount, setReplacementCount] = useState(0);
  const [projectPersonnel, setProjectPersonnel] = useState({
    count: 0,
    placement: ''
  });

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setLocation(selectedLocation);
    
    // Initialize employees based on location
    let empCount = 0;
    switch(selectedLocation) {
      case 'Batavia': empCount = 10; break;
      case 'Puri': empCount = 12; break;
      case 'Bliss': empCount = 4; break;
      case 'WP Batavia': empCount = 9; break;
      case 'WP Sepatan': empCount = 2; break;
      default: empCount = 0;
    }
    
    const newEmployees = Array(empCount).fill().map((_, i) => ({
      id: i+1,
      name: `Pegawai ${i+1}`,
      present: true
    }));
    
    setEmployees(newEmployees);
  };

  const toggleEmployeePresence = (id) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? {...emp, present: !emp.present} : emp
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
  };

  return (
    <FormContainer>
      <FormTitle>Entry Data Absensi</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Lokasi</Label>
          <Select 
            value={location}
            onChange={handleLocationChange}
            required
          >
            <option value="">Pilih Lokasi</option>
            <option value="Batavia">Batavia</option>
            <option value="Puri">Puri</option>
            <option value="Bliss">Bliss</option>
            <option value="WP Batavia">WP Batavia</option>
            <option value="WP Sepatan">WP Sepatan</option>
            <option value="Proyek">Proyek</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Tanggal</Label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormGroup>

        {location && location !== 'Proyek' && (
          <>
            <EmployeeList>
              <h3>Daftar Pegawai Inti</h3>
              {employees.map(emp => (
                <EmployeeItem key={emp.id}>
                  <label>
                    <Checkbox 
                      type="checkbox" 
                      checked={emp.present}
                      onChange={() => toggleEmployeePresence(emp.id)}
                    />
                    {emp.name}
                  </label>
                </EmployeeItem>
              ))}
            </EmployeeList>

            {employees.some(emp => !emp.present) && (
              <ReplacementSection>
                <FormGroup>
                  <Label>Ada tenaga kerja pengganti?</Label>
                  <div>
                    <label>
                      <input 
                        type="radio" 
                        checked={hasReplacement}
                        onChange={() => setHasReplacement(true)}
                      /> Ya
                    </label>
                    <label style={{marginLeft: '1rem'}}>
                      <input 
                        type="radio" 
                        checked={!hasReplacement}
                        onChange={() => setHasReplacement(false)}
                      /> Tidak
                    </label>
                  </div>
                </FormGroup>

                {hasReplacement && (
                  <FormGroup>
                    <Label>Jumlah tenaga kerja pengganti</Label>
                    <input 
                      type="number" 
                      value={replacementCount}
                      onChange={(e) => setReplacementCount(parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </FormGroup>
                )}
              </ReplacementSection>
            )}
          </>
        )}

        {location === 'Proyek' && (
          <>
            <FormGroup>
              <Label>Jumlah Personil yang Hadir</Label>
              <input 
                type="number" 
                value={projectPersonnel.count}
                onChange={(e) => setProjectPersonnel({
                  ...projectPersonnel,
                  count: parseInt(e.target.value) || 0
                })}
                min="0"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Ditempatkan di</Label>
              <Select 
                value={projectPersonnel.placement}
                onChange={(e) => setProjectPersonnel({
                  ...projectPersonnel,
                  placement: e.target.value
                })}
                required
              >
                <option value="">Pilih Penempatan</option>
                <option value="Kebersihan Cluster">Kebersihan Cluster</option>
                <option value="Kebersihan Kali">Kebersihan Kali</option>
                <option value="Proyek">Proyek</option>
                <option value="Backup pegawai Puri">Backup pegawai Puri</option>
                <option value="Backup Pegawai Batavia">Backup Pegawai Batavia</option>
                <option value="Backup Pegawai Bliss">Backup Pegawai Bliss</option>
                <option value="Backup Pegawai WP Batavia">Backup Pegawai WP Batavia</option>
                <option value="Backup Pegawai WP Sepatan">Backup Pegawai WP Sepatan</option>
              </Select>
            </FormGroup>
          </>
        )}

        <Button type="submit">Simpan Data</Button>
      </form>
    </FormContainer>
  );
};

export default Absensi;
