import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, push, set, onValue, remove, get } from 'firebase/database';
import { db } from '../firebaseConfig';
import emailjs from 'emailjs-com';

const AdminPromotions = () => {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountValue: '',
    minOrderAmount: '',
    startDate: '',
    endDate: '',
    isActive: true, // The promotion is by default active
  });

  // Load promos from Firebase on component mount
  useEffect(() => {
    const promosRef = ref(db, 'promotions');
    onValue(promosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const promosArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPromos(promosArray);
      } else {
        setPromos([]);
      }
    });
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.code || !form.description || !form.discountValue || !form.startDate || !form.endDate) return;

    // Validate dates
    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);

    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    try {
      const promosRef = ref(db, 'promotions');
      const newPromo = await push(promosRef, {
        code: form.code.toUpperCase(),
        description: form.description,
        discountType: 'percentage',
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: parseFloat(form.minOrderAmount) || 0,
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive, // The promotion is by default active
        createdAt: new Date().toISOString(),
        emailSent: false, // New field to track if email was sent
      });
      setForm({
        code: '',
        description: '',
        discountValue: '',
        minOrderAmount: '',
        startDate: '',
        endDate: '',
        isActive: true, // Keep the default value as active
      });

      // Check if the promo should be emailed right after adding
      const promo = {
        ...form,
        id: newPromo.key,
      };
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      if (promo.startDate <= today && promo.endDate >= today && !promo.emailSent) {
        await handleSendPromoEmail(promo);
      }
    } catch (error) {
      console.error('Error adding promotion:', error);
      alert('Error adding promotion');
    }
  };

  const handleDelete = async (id) => {
    // Find the promotion to check if it's active
    const promotion = promos.find(promo => promo.id === id);
    
    if (!promotion) {
      alert('Promotion not found');
      return;
    }

    // Check if promotion is currently active
    const currentDate = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    const isCurrentlyActive = promotion.isActive && 
                             currentDate >= startDate && 
                             currentDate <= endDate;

    if (isCurrentlyActive) {
      alert('Cannot delete an active promotion. Please deactivate it first by setting it to inactive, then delete it.');
      return;
    }

    // Check if promotion is expired
    const isExpired = currentDate > endDate;

    if (!isExpired && promotion.isActive) {
      alert('Cannot delete a future active promotion. Please deactivate it first.');
      return;
    }

    // Only allow deletion of inactive or expired promotions
    if (window.confirm(`Are you sure you want to delete the promotion "${promotion.code}"? This action cannot be undone.`)) {
      try {
        const promoRef = ref(db, `promotions/${id}`);
        await remove(promoRef);
        console.log('Promotion deleted successfully');
      } catch (error) {
        console.error('Error deleting promotion:', error);
        alert('Error deleting promotion');
      }
    }
  };

  // Add a function to deactivate promotions
  const handleDeactivate = async (id) => {
    const promotion = promos.find(promo => promo.id === id);
    
    if (!promotion) {
      alert('Promotion not found');
      return;
    }

    if (window.confirm(`Are you sure you want to deactivate the promotion "${promotion.code}"?`)) {
      try {
        const promoRef = ref(db, `promotions/${id}`);
        await set(promoRef, { ...promotion, isActive: false });
        console.log('Promotion deactivated successfully');
      } catch (error) {
        console.error('Error deactivating promotion:', error);
        alert('Error deactivating promotion');
      }
    }
  };

  const handleSendPromoEmail = async (promo) => {
    try {
      const usersRef = ref(db, 'users');
      onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        if (!users) return;

        Object.entries(users).forEach(([uid, user]) => {
          if (user.promotions?.subscribed && user.email) {
            emailjs
              .send(
                'service_tsqwzy7',
                'template_00hb1z2',
                {
                  to_email: user.email,
                  to_name: user.name || 'Valued Customer',
                  promo_code: promo.code,
                  promo_description: promo.description,
                  discount: `${promo.discountValue}%`,
                  min_order: `$${promo.minOrderAmount}`,
                  valid_dates: `From ${formatDate(promo.startDate)} to ${formatDate(promo.endDate)}`,
                },
                '5PxilDqp-n8urSbtG' // Replace with your EmailJS user ID
              )
              .then(
                (response) => {
                  console.log('SUCCESS!', response.status, response.text);
                  // Update the promo to mark email as sent
                  const promoRef = ref(db, `promotions/${promo.id}`);
                  set(promoRef, { ...promo, emailSent: true });
                },
                (err) => {
                  console.error('FAILED...', err);
                }
              );
          }
        });
      }, { onlyOnce: true });
    } catch (err) {
      console.error('Error sending emails:', err);
      alert('Failed to send promotional emails.');
    }
  };

  // Helper function to check if promotion has expired
  const isExpired = (endDate) => {
    return new Date() > new Date(endDate);
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={{ padding: '2rem', background: 'transparent', color: '#f4f4f5', minHeight: '100vh' }}>
      <Link to="/admin" style={{ color: '#bbdef4ff', textDecoration: 'underline' }}>← Back to Dashboard</Link>
      <h2 style={{ backgroundImage: 'linear-gradient(#b5a8eeff, #f6a0edff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    fontSize: '3.2 rem' }}>Manage Promotions</h2>

      <form
        onSubmit={handleAdd}
        style={{
          marginBottom: '1.5rem',
          background: '#232323',
          padding: '1rem',
          borderRadius: '8px',
          border: '0.2px solid #59595aff',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Promo Code"
            required
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#1a1a1a',
              color: '#f4f4f5',
              flex: '1',
              minWidth: '120px'
            }}
          />
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#1a1a1a',
              color: '#f4f4f5',
              flex: '2',
              minWidth: '200px'
            }}
          />
          <input
            type="number"
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            placeholder="Discount %"
            required
            min="0"
            max="100"
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#1a1a1a',
              color: '#f4f4f5',
              flex: '1',
              minWidth: '100px'
            }}
          />
          <input
            type="number"
            name="minOrderAmount"
            value={form.minOrderAmount}
            onChange={handleChange}
            placeholder="Min Order $"
            min="0"
            step="0.01"
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#1a1a1a',
              color: '#f4f4f5',
              flex: '1',
              minWidth: '120px'
            }}
          />
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#1a1a1a',
              color: '#f4f4f5',
              flex: '1',
              minWidth: '140px'
            }}
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#1a1a1a',
              color: '#f4f4f5',
              flex: '1',
              minWidth: '140px'
            }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f4f4f5' }}>
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              style={{ margin: 0 }}
            />
            Active
          </label>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: 'linear-gradient(#a8d6f5ff, #82c7f5ff)',
              color: 'black',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Add Promotion
          </button>
        </div>
      </form>

      <table style={{ width: '100%', background: '#232323', color: '#f4f4f5', borderRadius: '8px', border: '0.2px solid #59595aff' }}>
        <thead>
          <tr>
            <th style={{ padding: 8 }}>Code</th>
            <th style={{ padding: 8 }}>Description</th>
            <th style={{ padding: 8 }}>Discount</th>
            <th style={{ padding: 8 }}>Min Order</th>
            <th style={{ padding: 8 }}>Start Date</th>
            <th style={{ padding: 8 }}>End Date</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promos.map((promo, index) => {
            const expired = isExpired(promo.endDate);
            const currentDate = new Date();
            const startDate = new Date(promo.startDate);
            const endDate = new Date(promo.endDate);
            const isCurrentlyActive = promo.isActive && 
                                    currentDate >= startDate && 
                                    currentDate <= endDate;
            
            return (
              <tr key={promo.id} style={{ borderBottom: index < promos.length - 1 ? '1px solid #333' : 'none' }}>
                <td style={{ padding: '12px 8px' }}>{promo.code}</td>
                <td style={{ padding: '12px 8px' }}>{promo.description}</td>
                <td style={{ padding: '12px 8px' }}>{promo.discountValue}%</td>
                <td style={{ padding: '12px 8px' }}>${promo.minOrderAmount}</td>
                <td style={{ padding: '12px 8px' }}>{formatDate(promo.startDate)}</td>
                <td style={{ padding: '12px 8px' }}>{formatDate(promo.endDate)}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span
                    style={{
                      color: expired ? '#f87171' : isCurrentlyActive ? '#4ade80' : '#fbbf24',
                      fontWeight: 'bold',
                      fontSize: '0.9em',
                    }}
                  >
                    {expired ? 'Expired' : isCurrentlyActive ? 'Active' : promo.isActive ? 'Future Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* Deactivate button for active promotions */}
                    {isCurrentlyActive && (
                      <button
                        onClick={() => handleDeactivate(promo.id)}
                        style={{
                          borderRadius: '4px',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.9em',
                          fontWeight: '500',
                          backgroundColor: '#fbbf24',
                          color: 'black',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Deactivate
                      </button>
                    )}
                    
                    {/* Delete button - only for inactive/expired promotions */}
                    <button
                      onClick={() => handleDelete(promo.id)}
                      disabled={isCurrentlyActive}
                      style={{
                        borderRadius: '4px',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.9em',
                        fontWeight: '500',
                        backgroundColor: 'transparent',
                        color: isCurrentlyActive ? '#666' : 'white',
                        border: `1.5px solid ${isCurrentlyActive ? '#666' : '#e22929ff'}`,
                        cursor: isCurrentlyActive ? 'not-allowed' : 'pointer'
                      }}
                      title={isCurrentlyActive ? 'Cannot delete active promotion' : 'Delete promotion'}
                    >
                      Delete
                    </button>
                    
                    <span
                      style={{
                        color: promo.emailSent ? '#4ade80' : '#f87171',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        paddingLeft: '0.5rem',
                        textAlign: 'center'
                      }}
                    >
                      {promo.emailSent ? 'Email Sent' : 'Not Sent'}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {promos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          No promotions found. Add your first promotion above!
        </div>
      )}
    </div>
  );
};

export default AdminPromotions;