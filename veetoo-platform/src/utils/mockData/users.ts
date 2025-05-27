import { SalesPerson, Supervisor, CEO } from '../../types/user';

export const mockUsers: (SalesPerson | Supervisor | CEO)[] = [
  {
    id: 'sp1',
    name: 'John Mwangi',
    email: 'john@veetoo.com',
    role: 'salesperson',
    phoneNumber: '+254700123456',
    region: 'Eastleigh North',
    dateJoined: '2023-01-15T00:00:00.000Z',
    isActive: true,
    supervisorId: 'sv1',
    supervisorName: 'Sarah Kiprop',
    totalDebt: 12500,
    dailySavings: 500,
    isFlagged: false
  },
  {
    id: 'sp2',
    name: 'Alice Kamau',
    email: 'alice@veetoo.com',
    role: 'salesperson',
    phoneNumber: '+254700123457',
    region: 'Eastleigh South',
    dateJoined: '2023-02-20T00:00:00.000Z',
    isActive: true,
    supervisorId: 'sv1',
    supervisorName: 'Sarah Kiprop',
    totalDebt: 28000,
    dailySavings: 500,
    isFlagged: true
  },
  {
    id: 'sp3',
    name: 'David Odhiambo',
    email: 'david@veetoo.com',
    role: 'salesperson',
    phoneNumber: '+254700123458',
    region: 'Eastleigh Central',
    dateJoined: '2023-03-10T00:00:00.000Z',
    isActive: true,
    supervisorId: 'sv2',
    supervisorName: 'Michael Otieno',
    totalDebt: 8200,
    dailySavings: 500,
    isFlagged: false
  },
  {
    id: 'sv1',
    name: 'Sarah Kiprop',
    email: 'sarah@veetoo.com',
    role: 'supervisor',
    phoneNumber: '+254700123459',
    region: 'Eastleigh Main',
    dateJoined: '2022-11-05T00:00:00.000Z',
    isActive: true,
    salesPersonCount: 8,
    regions: ['Eastleigh North', 'Eastleigh South']
  },
  {
    id: 'sv2',
    name: 'Michael Otieno',
    email: 'michael@veetoo.com',
    role: 'supervisor',
    phoneNumber: '+254700123460',
    region: 'Eastleigh Main',
    dateJoined: '2022-12-10T00:00:00.000Z',
    isActive: true,
    salesPersonCount: 6,
    regions: ['Eastleigh Central', 'Eastleigh West']
  },
  {
    id: 'ceo1',
    name: 'Grace Nyambura',
    email: 'grace@veetoo.com',
    role: 'ceo',
    phoneNumber: '+254700123461',
    dateJoined: '2022-01-01T00:00:00.000Z',
    isActive: true
  }
];