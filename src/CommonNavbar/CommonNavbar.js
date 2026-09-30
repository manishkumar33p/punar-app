import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppContent } from "../services/appContent";
import WhatsAppButton from "../components/WhatsAppButton";
import "./CommonNavbar.css";

function CommonNavbar() {
  const [managementOpen, setManagementOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => { getAppContent().then(setContent); }, []);
  const closeMenu = () => { setMobileMenuOpen(false); setManagementOpen(false); };

  return (
    <header className="common-navbar">
      <div className="common-nav-container">
        <Link to="/" className="common-logo" onClick={closeMenu}><div className="common-logo-mark"><span>PA</span></div><div className="common-logo-text"><strong>{content?.clinicName?.split(" ").slice(0,2).join(" ") || "PUNAR AXIS"}</strong><span>{content?.tagline || "THERAPY"}</span></div></Link>
        <button className="common-mobile-btn" type="button" onClick={() => setMobileMenuOpen((prev) => !prev)}>{mobileMenuOpen ? "✕" : "☰"}</button>
        <nav className={`common-nav-menu ${mobileMenuOpen ? "common-mobile-open" : ""}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/services" onClick={closeMenu}>Services</Link>
          <Link to="/request" onClick={closeMenu}>Request</Link>
          <Link to="/chat" onClick={closeMenu}>Chat</Link>
          <Link to="/patient-login" onClick={closeMenu}>Patient Portal</Link>
          <div className="common-dropdown"><button type="button" onClick={() => setManagementOpen((prev) => !prev)}>Admin <span>▾</span></button>{managementOpen && <div className="common-dropdown-menu"><Link to="/management-login" onClick={closeMenu}>🔐 Admin Login</Link><Link to="/management-dashboard" onClick={closeMenu}>📊 Dashboard</Link><Link to="/appointment" onClick={closeMenu}>📅 Appointment</Link><Link to="/patient-management" onClick={closeMenu}>👤 Patients</Link><Link to="/inventory" onClick={closeMenu}>📦 Inventory</Link><Link to="/employee-attendance" onClick={closeMenu}>🧑 Attendance</Link><Link to="/admin-panel" onClick={closeMenu}>⚙ App Control</Link></div>}</div>
        </nav>
        <WhatsAppButton compact />
      </div>
    </header>
  );
}

export default CommonNavbar;
