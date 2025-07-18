import React from "react";
import { useLocation, Link } from "react-router-dom";

const CheckoutConfirmationPage = () => {
  const location = useLocation();
  const order = location.state;

  if (!order) {
    // If no order data, show a fallback
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Order Not Found</h1>
        <Link to="/" style={{
          background: "#facc15",
          color: "#000",
          borderRadius: "8px",
          padding: "0.75rem 1.5rem",
          textDecoration: "none",
          fontWeight: "bold"
        }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ color: "#f065e2ff" }}>Thank you for your order!</h1>
      <p style={{ margin: "1rem 0" }}>
        A confirmation email has been sent to your email address.
      </p>
      <div style={{
        background: "#232323",
        color: "#f4f4f5",
        borderRadius: "12px",
        display: "inline-block",
        padding: "2rem",
        margin: "2rem 0"
      }}>
        <h2>Order Summary</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {order.items.map((item) => (
            <li key={item.id} style={{
              marginBottom: "1.2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "#18181b",
              borderRadius: "8px",
              padding: "0.75rem 1rem"
            }}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "60px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  background: "#2f2f2f"
                }}
              />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{item.title}</div>
                <div style={{ fontSize: "0.95rem", color: "#bbb" }}>x{item.quantity} &nbsp; @ ${item.price.toFixed(2)}</div>
              </div>
            </li>
          ))}
        </ul>
        <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
        <p>Tax (8.5%): ${order.tax.toFixed(2)}</p>
        <p style={{ fontWeight: "bold", color: "#317ab5ff" }}>
          Total: ${order.total.toFixed(2)}
        </p>
      </div>
      <Link to="/" style={{
        background: "#317ab5ff",
        color: "#000",
        borderRadius: "8px",
        padding: "0.75rem 1.5rem",
        textDecoration: "none",
        fontWeight: "bold"
      }}>
        Back to Home
      </Link>
    </div>
  );
};

export default CheckoutConfirmationPage;