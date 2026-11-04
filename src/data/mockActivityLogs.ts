import { ActivityLog } from '../types';

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-001',
    type: 'vehicle_status',
    category: 'vehicles',
    title: 'Vehicle Status Updated',
    description: '2022 Toyota Land Cruiser Prado TX-L marked as Available in Kigali stock',
    timestamp: '10 minutes ago',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    actor: {
      name: 'Website Administrator',
      role: 'Administrator',
      email: 'admin@rwandacarhub.com'
    },
    metadata: {
      entityId: 'veh-001',
      entityName: '2022 Toyota Land Cruiser Prado TX-L',
      previousState: 'pending',
      newState: 'available',
      badge: 'Available',
      tag: 'Stock Update'
    }
  },
  {
    id: 'log-002',
    type: 'account_approval',
    category: 'accounts',
    title: 'Dealership Account Approved',
    description: 'Kigali City Motors Ltd was approved with VIP Verified Dealership access',
    timestamp: '45 minutes ago',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    actor: {
      name: 'Website Administrator',
      role: 'Administrator',
      email: 'admin@rwandacarhub.com'
    },
    metadata: {
      entityId: 'acc-deal-01',
      entityName: 'Kigali City Motors Ltd',
      previousState: 'pending',
      newState: 'approved',
      badge: 'Approved',
      tag: 'User Verification'
    }
  },
  {
    id: 'log-003',
    type: 'ad_status',
    category: 'adverts',
    title: 'Partner Campaign Approved',
    description: 'Equity Bank "Drive Now, Pay Later" Auto Loan ad campaign approved and featured',
    timestamp: '2 hours ago',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actor: {
      name: 'Website Administrator',
      role: 'Administrator',
      email: 'admin@rwandacarhub.com'
    },
    metadata: {
      entityId: 'ad-equity-01',
      entityName: 'Equity Bank Auto Loan',
      previousState: 'pending',
      newState: 'approved',
      badge: 'Active Campaign',
      tag: 'Partner Ads'
    }
  },
  {
    id: 'log-004',
    type: 'vehicle_added',
    category: 'vehicles',
    title: 'New Vehicle Published',
    description: '2023 Toyota Hilux Double Cabin 4x4 (GD-6) published with real photos & watermark',
    timestamp: '4 hours ago',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    actor: {
      name: 'Kigali City Motors Ltd',
      role: 'Verified Dealer',
      email: 'trust@rwandacarhub.com'
    },
    metadata: {
      entityId: 'veh-004',
      entityName: '2023 Toyota Hilux Double Cabin 4x4',
      newState: 'active',
      badge: 'New Listing',
      tag: 'Marketplace Post'
    }
  },
  {
    id: 'log-005',
    type: 'ad_status',
    category: 'adverts',
    title: 'Advert Frequency Boosted to VIP',
    description: 'Sonarwa Comprehensive Motor Insurance frequency set to 5x VIP Priority display',
    timestamp: 'Yesterday',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    actor: {
      name: 'Website Administrator',
      role: 'Administrator',
      email: 'admin@rwandacarhub.com'
    },
    metadata: {
      entityId: 'ad-sonarwa-01',
      entityName: 'Sonarwa Motor Insurance',
      previousState: '2x (Normal)',
      newState: '5x (VIP Top Frequency)',
      badge: '5x VIP',
      tag: 'Ad Weight'
    }
  },
  {
    id: 'log-006',
    type: 'vehicle_status',
    category: 'vehicles',
    title: 'Vehicle Marked as Sold',
    description: '2020 Mercedes-Benz GLE 350 4MATIC marked as Sold (Yagurishijwe in Kigali)',
    timestamp: 'Yesterday',
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    actor: {
      name: 'Website Administrator',
      role: 'Administrator',
      email: 'admin@rwandacarhub.com'
    },
    metadata: {
      entityId: 'veh-003',
      entityName: '2020 Mercedes-Benz GLE 350 AMG Line',
      previousState: 'available',
      newState: 'sold',
      badge: 'Sold',
      tag: 'Status Change'
    }
  },
  {
    id: 'log-007',
    type: 'account_registered',
    category: 'accounts',
    title: 'New Account Registered',
    description: 'Akagera Prestige Auto Imports submitted registration requesting Dealer status',
    timestamp: '2 days ago',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    actor: {
      name: 'Akagera Prestige Auto Imports',
      role: 'Applicant',
      email: 'sales@akageraprestige.rw'
    },
    metadata: {
      entityId: 'acc-deal-02',
      entityName: 'Akagera Prestige Auto Imports',
      previousState: 'unregistered',
      newState: 'pending',
      badge: 'Pending Review',
      tag: 'New Registration'
    }
  }
];
