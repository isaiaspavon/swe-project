import React, { useState } from 'react';
import AccountSidebar from '../components/AccountSidebar';
import AccountOverview from '../components/AccountOverview';
import OrderHistory from '../components/OrderHistory';
import AccountSettings from '../components/AccountSettings';

const sectionContent = {
  account: (onNavigate) => <AccountOverview onNavigate={onNavigate} />,
  orders: () => <OrderHistory />,
  settings: () => <AccountSettings />,
  payments: () => <div>Payment Methods (manage cards, etc.)</div>,
  address: () => <div>Address Book (manage addresses)</div>,
  email: () => <div>Email Preferences (manage email settings)</div>,
};

const AccountPage = () => {
  const [activeSection, setActiveSection] = useState('account');

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem', minHeight: '80vh' }}>
      <AccountSidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
      />
      <div style={{ flex: 1, background: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {sectionContent[activeSection](setActiveSection)}
      </div>
    </div>
  );
};

export default AccountPage; 