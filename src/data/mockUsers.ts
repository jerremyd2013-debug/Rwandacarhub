import { UserAccount } from '../types';

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-admin',
    name: 'Website Administrator',
    email: 'admin@rwandacarhub.com',
    phone: '+250 788 225 193',
    role: 'admin',
    status: 'approved',
    accountType: 'agency',
    companyName: 'RwandaCarHub Head Office',
    createdAt: '2024-01-15',
    approvalNotes: 'Platform Super Administrator with authority to approve accounts and manage listings.'
  },
  {
    id: 'usr-approved-1',
    name: 'Jean-Damascène Habimana',
    email: 'jean.habimana@gmail.com',
    phone: '+250 788 225 193',
    role: 'user',
    status: 'approved',
    accountType: 'individual',
    createdAt: '2024-03-10',
    approvalNotes: 'Verified individual seller in Kicukiro, Kigali.'
  },
  {
    id: 'usr-pending-1',
    name: 'Patrick Mugisha',
    email: 'patrick.mugisha@gmail.com',
    phone: '+250 788 555 777',
    role: 'user',
    status: 'pending',
    accountType: 'dealer',
    companyName: 'Mugisha Motors Rwanda',
    createdAt: '2026-09-08',
    approvalNotes: 'New dealership account pending admin review and license verification.'
  },
  {
    id: 'usr-pending-2',
    name: 'Diane Mukamana',
    email: 'diane.mukamana@yahoo.com',
    phone: '+250 788 444 888',
    role: 'user',
    status: 'pending',
    accountType: 'individual',
    createdAt: '2026-09-09',
    approvalNotes: 'Individual seller waiting for verification.'
  }
];
