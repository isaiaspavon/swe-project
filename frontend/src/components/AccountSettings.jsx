import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';

function formatPhone(number = '') {
  // Strip out anything that isn't a digit
  const digits = number.replace(/\D/g, '');
  // If it’s not exactly 10 digits, just return the raw string
  if (digits.length !== 10) return number;
  const [area, prefix, line] = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 10),
  ];
  return `(${area})-${prefix}-${line}`;
}

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
  backgroundColor: '#2e7d32',
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
  color: '#2e7d32',
  border: '1.5px solid #2e7d32',
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

const AccountSettings = () => {
  const { currentUser, userProfile, updateProfile, updateEmail, updatePassword } = useAuth();

  const [name, setName] = useState({ first: '', last: '' });
  const [email, setEmail] = useState({ current: '', new: '', confirm: '' });
  const [phone, setPhone] = useState({ current: '', new: '', confirm: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
    if (userProfile?.name) {
      // if you store full name as one string:
      const [first = '', last = ''] = userProfile.name.split(' ');
    }
    if (currentUser?.email) {
      setEmail(e => ({ ...e, current: currentUser.email }));
    }
    if (userProfile?.phone) {
      setPhone(p => ({ ...p, current: userProfile.phone }));
    }
  }, [userProfile, currentUser]);


const handleNameSave = async (e) => {
  e.preventDefault();
  const fullName = `${name.first.trim()} ${name.last.trim()}`.trim();
  if (!fullName) {
    return alert("Name can't be blank");
  }

  try {
    // 1) Push the change to your AuthContext (Firebase + RTDB)
    await updateProfile({ name: fullName });

    // 2) Success feedback
    alert('Name updated successfully!');

    // 3) Reset your inputs (if you want them to clear out)
    setName({ first: '', last: '' });

  } catch (err) {
    console.error(err);
    alert('Failed to update name: ' + err.message);
  }
};

const handleEmailSave = async (e) => {
  e.preventDefault();

  // 1) Basic validation
  if (!email.new) {
    return alert("Please enter a new email address.");
  }
  if (email.new !== email.confirm) {
    return alert("New email and confirmation do not match.");
  }

  try {
    // 2) Call the context helper
    await updateEmail(email.new);

    // 3) Success feedback
    alert("Email updated! Please check your inbox for any verification links.");

    // 4) Reset only the new/confirm fields
    setEmail(curr => ({ ...curr, new: "", confirm: "" }));
  } catch (err) {
    console.error(err);
    alert("Failed to update email: " + err.message);
  }
};

const handlePhoneSave = async (e) => {
  e.preventDefault();

  const raw = phone.new.replace(/\D/g, "");             // strip non-digits
  if (raw.length !== 10) {
    return alert("Please enter a valid 10-digit phone number.");
  }
  if (raw !== phone.confirm.replace(/\D/g, "")) {
    return alert("Phone number and confirmation do not match.");
  }

  try {
    await updateProfile({ phone: raw });

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
  if (password.new.length < 8) {
    return alert("New password must be at least 8 characters.");
  }
  if (password.new !== password.confirm) {
    return alert("New password and confirmation do not match.");
  }

  try {
    // some backends require both current & new; Firebase Auth only needs new
     const cred = EmailAuthProvider.credential(
        currentUser.email,
        password.current
      );
      await reauthenticateWithCredential(currentUser, cred);
    
    // after re-authentication, update the password
    await firebaseUpdatePassword(currentUser, password.new);
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
      {/* Update Name */}
      <form onSubmit={handleNameSave} style={cardStyle}>
        <div style={sectionTitleStyle}>Update Your Name</div>
        <div style={{ color: '#bbb', marginBottom: '0.5rem' }}>Current Name: {userProfile.name}</div>
        <label style={labelStyle}>First Name</label>
        <input style={inputStyle} value={name.first} onChange={e => setName({ ...name, first: e.target.value })} placeholder="First Name" />
        <label style={labelStyle}>Last Name</label>
        <input style={inputStyle} value={name.last} onChange={e => setName({ ...name, last: e.target.value })} placeholder="Last Name" />
        <div style={buttonRowStyle}>
          <button type="submit" style={saveButtonStyle}>Save Changes</button>
          <button type="button" style={cancelButtonStyle}>Cancel</button>
        </div>
      </form>

      {/* Update Email Address */}
      <form onSubmit={handleEmailSave} style={cardStyle}>
        <div style={sectionTitleStyle}>Update Your Email Address</div>
        <div style={{ color: '#bbb', marginBottom: '0.5rem' }}>Current Email Address: {email.current}</div>
        <label style={labelStyle}>New Email Address</label>
        <input style={inputStyle} value={email.new} onChange={e => setEmail({ ...email, new: e.target.value })} placeholder="New Email Address" />
        <label style={labelStyle}>Confirm New Email Address</label>
        <input style={inputStyle} value={email.confirm} onChange={e => setEmail({ ...email, confirm: e.target.value })} placeholder="Confirm New Email Address" />
        <div style={buttonRowStyle}>
          <button type="submit" style={saveButtonStyle}>Save Changes</button>
          <button type="button" style={cancelButtonStyle}>Cancel</button>
        </div>
      </form>

      {/* Update Mobile Phone Number */}
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

      {/* Change Password */}
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