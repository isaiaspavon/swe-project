import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AccountSidebar from '../components/AccountSidebar';
import AccountOverview from '../components/AccountOverview';
import OrderHistory from '../components/OrderHistory';
import AccountSettings from '../components/AccountSettings';
import PaymentMethods from '../components/PaymentMethods';
import AddressBook from '../components/AddressBook';
import EmailPreferences from '../components/EmailPreferences';

const sectionContent = {
  account: (onNavigate) => <AccountOverview onNavigate={onNavigate} />,
  orders: () => <OrderHistory />,
  settings: () => <AccountSettings />,
  payments: () => <PaymentMethods/>,
  address: () => <AddressBook/>,
  email: () => <EmailPreferences/>,
};

const validSections = Object.keys(sectionContent);

const AccountPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sectionParam = params.get('section');
  const initialSection = validSections.includes(sectionParam) ? sectionParam : 'account';
  const [activeSection, setActiveSection] = useState(initialSection);

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