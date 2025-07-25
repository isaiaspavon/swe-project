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
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        const promoRef = ref(db, `promotions/${id}`);
        await remove(promoRef);
      } catch (error) {
        console.error('Error deleting promotion:', error);
        alert('Error deleting promotion');
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
            name="code"
            placeholder="Promo Code"
            value={form.code}
            onChange={handleChange}
            required
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#333',
              color: '#f4f4f5',
              width: '250px',
            }}
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#333',
              color: '#f4f4f5',
              width: '620px',
            }}
          />
          <input
            name="discountValue"
            placeholder="Discount %"
            value={form.discountValue}
            onChange={handleChange}
            type="number"
            step="0.01"
            min="0"
            max="100"
            required
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#333',
              color: '#f4f4f5',
              width: '100px',
            }}
          />
          <input
            name="minOrderAmount"
            placeholder="Min Order ($)"
            value={form.minOrderAmount}
            onChange={handleChange}
            type="number"
            step="0.01"
            min="0"
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#333',
              color: '#f4f4f5',
              width: '120px',
            }}
          />
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#333',
              color: '#f4f4f5',
            }}
          />
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            required
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#333',
              color: '#f4f4f5',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(#a8d6f5ff, #82c7f5ff)',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              fontWeight: '500',
            }}
          >
            Add Promotion
          </button>
        </div>
      </form>

      <table
        style={{
          width: '100%',
          background: '#232323',
          color: '#f4f4f5',
          borderRadius: '8px',
          border: '0.2px solid #59595aff',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #444' }}>
            <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>Code</th>
            <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>Description</th>
            <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>Discount</th>
            <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>Min Order</th>
            <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>Start Date</th>
            <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>End Date</th>
            <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promos.map((promo, index) => {
            const expired = isExpired(promo.endDate);
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
                      color: expired ? '#f87171' : promo.isActive ? '#4ade80' : '#f87171',
                      fontWeight: 'bold',
                      fontSize: '0.9em',
                    }}
                  >
                    {expired ? 'Expired' : promo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      style={{
                        borderRadius: '4px',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.9em',
                        fontWeight: '500',
                        backgroundColor: 'transparent',
                         color: 'white',
                         border: '1.5px solid #e22929ff'
                      }}
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
