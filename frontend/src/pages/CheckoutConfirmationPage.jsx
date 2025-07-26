import React, { useEffect, useRef} from "react";
import { useLocation, Link } from "react-router-dom";
import emailjs from 'emailjs-com';

const CheckoutConfirmationPage = () => {
  const location = useLocation();
  const order = location.state;

  const emailSentRef = useRef(false); // 🧠 useRef to track if email was sent

  useEffect(() => {
    if (order && order.userEmail && !emailSentRef.current) {
      sendConfirmationEmail(order);
      emailSentRef.current = true;
    }
  }, [order]);

  const sendConfirmationEmail = (order) => {
    const itemList = order.items.map(item => `${item.title} x${item.quantity}`).join(", ");

    const templateParams = {
      user_email: order.userEmail,
      order_number: order.orderNumber || "N/A",
      order_items: itemList,
      order_total: `$${order.total.toFixed(2)}`
    };

    emailjs.send(
      "service_tsqwzy7",       // 🔁 Replace this with your EmailJS service ID
      "template_818s6n7",      // 🔁 Replace this with your EmailJS template ID
      templateParams,
      "5PxilDqp-n8urSbtG"        // 🔁 Replace this with your EmailJS public key
    ).then((result) => {
      console.log("✅ Email sent:", result.text);
    }).catch((error) => {
      console.error("❌ Email failed:", error);
    });
  };

  if (!order) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Order Not Found</h1>
        <Link to="/" style={{
          background: "#facc15", color: "#000", borderRadius: "8px",
          padding: "0.75rem 1.5rem", textDecoration: "none", fontWeight: "bold"
        }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <h1 style={{
        backgroundImage: 'linear-gradient(#b5a8eeff, #f6a0edff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
        fontSize: '3.2rem'
      }}>
        Thank you for your order!
      </h1>
      <p style={{ margin: "0.5rem 0", fontWeight: 'bold' }}>
        A confirmation email has been sent to your email address.
      </p>

      <div style={{
        background: "#232323", color: "#f4f4f5", borderRadius: "12px",
        display: "inline-block", border: '0.2px solid #59595aff',
        padding: "2rem", margin: "2rem 0"
      }}>
        <h2>Order Summary</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {order.items.map((item) => (
            <li key={item.id} style={{
              marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "1rem",
              background: "#18181b", border: '0.2px solid #59595aff',
              borderRadius: "8px", padding: "0.75rem 1rem"
            }}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "60px", height: "90px", objectFit: "cover",
                  borderRadius: "6px", background: "#2f2f2f"
                }}
              />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{item.title}</div>
                <div style={{ fontSize: "0.95rem", color: "#bbb" }}>
                  x{item.quantity} @ ${item.price.toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
        <p>Tax (8.5%): ${order.tax.toFixed(2)}</p>
        <p style={{ fontWeight: "bold", color: "#aad1f0ff" }}>
          Total: ${order.total.toFixed(2)}
        </p>
      </div>

      <Link to="/" style={{
        background: 'linear-gradient(#b5a8eeff , #f6a0edff)',
        color: 'black', borderRadius: "8px",
        padding: "0.75rem 1.5rem", textDecoration: "none", fontWeight: "bold"
      }}>
        Back to Home
      </Link>
    </div>
  );
};

export default CheckoutConfirmationPage;
