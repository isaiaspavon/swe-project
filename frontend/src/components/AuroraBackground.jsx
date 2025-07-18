import React from "react";
import "./AuroraBackground.css";

const AuroraBackground = ({ children }) => {
  return (
    <main>
      <div className="aurora-container">
        <div className="aurora-gradient" />
        {children}
      </div>
    </main>
  );
};

export default AuroraBackground;