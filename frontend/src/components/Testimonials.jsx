import React from "react";
import "./Testimonials.css";

const testimonials = [
  {
    name: "Sydney Swaggs",
    quote: "Absolutely love the selection and the vibe! My new favorite bookstore. Always have my favorite smut in stock!!!",
    avatar: "🦄"
  },
  {
    name: "Nikki Maserati",
    quote: "The Gilded Page makes book shopping feel magical. Fast shipping too!",
    avatar: "🚗"
  },
  {
    name: "Naveen Undr-Wahter",
    quote: "I found rare titles I couldn't get anywhere else. Highly recommend!",
    avatar: "🌊"
  },
  {
    name: "Kahan Patraveling",
    quote: "Great deals, beautiful site, and a fantastic community of readers.",
    avatar: "🌍"
  }
];

const Testimonials = () => (
  <section className="gilded-testimonials">
    <h3>What Readers Are Saying</h3>
    <div className="testimonials-list">
      {testimonials.map((t, i) => (
        <div className="testimonial-card" key={i}>
          <div className="testimonial-avatar">{t.avatar}</div>
          <div className="testimonial-quote">"{t.quote}"</div>
          <div className="testimonial-name">— {t.name}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;