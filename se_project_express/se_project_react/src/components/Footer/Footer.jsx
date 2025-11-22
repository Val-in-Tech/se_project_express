import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__text-container">
        <span className="footer__text">
          © {new Date().getFullYear()} Developed by Valarie A. Paiz
        </span>
      </div>
    </footer>
  );
}

export default Footer;