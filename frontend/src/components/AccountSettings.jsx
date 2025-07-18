import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { formatPhone } from '../utils/formatPhone';
import emailjs from 'emailjs-com';


const headerStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: 'black',
  textAlign: 'center',
  marginBottom: '22px',
  marginTop: '56.56px',
  letterSpacing: '0.01em',
};

const cardStyle = {
  background: '#232323',
  border: '1.5px solid #444',
  borderRadius: '8px',
  padding: '2rem',
  marginBottom: '2rem',
  color: 'white',
  width: '100%',
  maxWidth: '725px',
  marginLeft: 'auto',
  marginRight: 'auto',
  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
};
const sectionTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: 'white',
};
const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  color: 'white',
};
const inputStyle = {
  width: '96%',
  padding: '0.7rem',
  borderRadius: '6px',
  border: '1px solid #888',
  marginBottom: '1.2rem',
  fontSize: '1rem',
  background: '#181818',
  color: 'white',
};
const buttonRowStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '0.5rem',
};
const saveButtonStyle = {
  backgroundColor: '#f5b5efff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.7rem 2rem',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
};
const cancelButtonStyle = {
  backgroundColor: 'transparent',
  color: '#f5b5efff',
  border: '1.5px solid #f5b5efff',
  borderRadius: '6px',
  padding: '0.7rem 2rem',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
};
const passwordReqStyle = {
  fontSize: '0.95rem',
  color: '#bbb',
  marginTop: '0.5rem',
  marginBottom: '0.5rem',
};

const sendNotificationEmail = async (user) => {
  try {
    await emailjs.send(
      'service_tsqwzy7',
      'template_8sl9i6e',
      {
        to_name: "user",
        to_email: user.email,
        message: 'Your account settings were updated.',
      },
      '5PxilDqp-n8urSbtG'
    );
    console.log("✅ Custom email sent!");
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
};



const AccountSettings = () => {
  const { currentUser, userProfile, updateProfile, updatePassword } = useAuth();

  const [name, setName] = useState({ first: '', last: '' });
  const [phone, setPhone] = useState({ current: '', new: '', confirm: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    if (userProfile?.firstName || userProfile?.lastName) {
      setName({
        first: userProfile.firstName || '',
        last: userProfile.lastName || ''
      });
    }
    if (userProfile?.phone) {
      setPhone(p => ({ ...p, current: userProfile.phone }));
    }
  }, [userProfile, currentUser]);

  const handleNameSave = async (e) => {
    e.preventDefault();

    const first = name.first.trim();
    const last = name.last.trim();

    if (!first || !last) {
      return alert("Both first and last name are required.");
    }

    const lettersOnly = /^[A-Za-z]+$/;
    if (!lettersOnly.test(first) || !lettersOnly.test(last)) {
      return alert("Names may only contain letters A–Z.");
    }

    try {
      await updateProfile({ firstName: first, lastName: last });
      await sendNotificationEmail(currentUser);
      alert('Name updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update name: ' + err.message);
    }
  };

  const handlePhoneSave = async (e) => {
    e.preventDefault();

    const raw = phone.new.replace(/\D/g, "");
    if (raw.length !== 10) {
      return alert("Please enter a valid 10-digit phone number.");
    }
    if (raw !== phone.confirm.replace(/\D/g, "")) {
      return alert("Phone number and confirmation do not match.");
    }

    try {
      await updateProfile({ phone: raw });
      await sendNotificationEmail(currentUser);
      alert("Phone number updated!");
      setPhone(curr => ({ ...curr, new: "", confirm: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to update phone: " + err.message);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();

    if (!password.current) {
      return alert("Enter your current password.");
    }
    if (password.new.length < 8 || password.new.length > 15) {
      return alert("New password must be between 8 and 15 characters.");
    }
    if (!/[A-Z]/.test(password.new)) {
      return alert("New password must contain at least one uppercase letter.");
    }
    if (!/[0-9]/.test(password.new)) {
      return alert("New password must contain at least one number.");
    }
    if (password.new === currentUser?.email) {
      return alert("New password must be different from your username.");
    }
    if (password.new !== password.confirm) {
      return alert("New password and confirmation do not match.");
    }

    try {
      const cred = EmailAuthProvider.credential(currentUser.email, password.current);
      await reauthenticateWithCredential(currentUser, cred);
      await firebaseUpdatePassword(currentUser, password.new);
      await sendNotificationEmail(currentUser);
      alert("Password changed successfully!");
      setPassword({ current: "", new: "", confirm: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to change password: " + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', width: '100%' }}>
      <h2 style={headerStyle}>Account Settings</h2>

      <form onSubmit={handleNameSave} style={cardStyle}>
        <div style={sectionTitleStyle}>Update Your Name</div>
        <div style={{ color: '#bbb', marginBottom: '0.5rem' }}>Current Name: {userProfile.firstName} {userProfile.lastName}</div>
        <label style={labelStyle}>First Name</label>
        <input style={inputStyle} value={name.first} onChange={e => setName({ ...name, first: e.target.value })} placeholder="First Name" />
        <label style={labelStyle}>Last Name</label>
        <input style={inputStyle} value={name.last} onChange={e => setName({ ...name, last: e.target.value })} placeholder="Last Name" />
        <div style={buttonRowStyle}>
          <button type="submit" style={saveButtonStyle}>Save Changes</button>
          <button type="button" style={cancelButtonStyle}>Cancel</button>
        </div>
      </form>

      <form onSubmit={handlePhoneSave} style={cardStyle}>
        <div style={sectionTitleStyle}>Update Your Mobile Phone Number</div>
        <div style={{ color: '#bbb', marginBottom: '0.5rem' }}>Current Mobile Phone Number: {phone.current ? formatPhone(phone.current) : 'None'}</div>
        <label style={labelStyle}>New Mobile Phone Number</label>
        <input style={inputStyle} value={phone.new} onChange={e => setPhone({ ...phone, new: e.target.value })} placeholder="+1" />
        <label style={labelStyle}>Confirm New Mobile Phone Number</label>
        <input style={inputStyle} value={phone.confirm} onChange={e => setPhone({ ...phone, confirm: e.target.value })} placeholder="+1" />
        <div style={buttonRowStyle}>
          <button type="submit" style={saveButtonStyle}>Save Changes</button>
          <button type="button" style={cancelButtonStyle}>Cancel</button>
        </div>
      </form>

      <form onSubmit={handlePasswordSave} style={cardStyle}>
        <div style={sectionTitleStyle}>Change Your Password</div>
        <label style={labelStyle}>Current Password</label>
        <input style={inputStyle} type="password" value={password.current} onChange={e => setPassword({ ...password, current: e.target.value })} placeholder="Current Password" />
        <label style={labelStyle}>New Password</label>
        <input style={inputStyle} type="password" value={password.new} onChange={e => setPassword({ ...password, new: e.target.value })} placeholder="New Password" />
        <label style={labelStyle}>Confirm New Password</label>
        <input style={inputStyle} type="password" value={password.confirm} onChange={e => setPassword({ ...password, confirm: e.target.value })} placeholder="Confirm New Password" />
        <div style={passwordReqStyle}>
          <div>Your password must:</div>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', color: '#bbb', fontSize: '0.95rem' }}>
            <li>Be between 8-15 characters</li>
            <li>Contain at least one capital letter</li>
            <li>Contain at least one number</li>
            <li>Be different from your username</li>
          </ul>
        </div>
        <div style={buttonRowStyle}>
          <button type="submit" style={saveButtonStyle}>Save Changes</button>
          <button type="button" style={cancelButtonStyle}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
