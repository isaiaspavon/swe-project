// 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
/*
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
// You'll need to get a free SendGrid API key from sendgrid.com
sgMail.setApiKey(process.env.VITE_SENDGRID_API_KEY);

export const sendProfileChangeEmail = async (userEmail, userName, changes) => {
  try {
    const msg = {
      to: userEmail,
      from: 'noreply@swe-database-3ba25.firebaseapp.com', // Replace with your verified sender
      subject: 'Profile Information Updated - The Gilded Page',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">Profile Update Confirmation</h2>
          <p>Hello ${userName},</p>
          <p>Your profile information has been successfully updated on The Gilded Page.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Changes Made:</h3>
            <ul>
              ${Object.entries(changes).map(([field, value]) => 
                `<li><strong>${field}:</strong> ${value}</li>`
              ).join('')}
            </ul>
          </div>
          
          <p>If you did not make these changes, please contact our support team immediately.</p>
          
          <p>Thank you for using The Gilded Page!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log('Profile change email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending profile change email:', error);
    return false;
  }
};*/