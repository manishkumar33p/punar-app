import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppContent, getWhatsAppLink } from "../services/appContent";
import WhatsAppButton from "../components/WhatsAppButton";
import "./Home.css";

function Home() {
  const [content, setContent] = useState(null);

  useEffect(() => { getAppContent().then(setContent); }, []);

  const data = content || {};
  const services = (data.services || []).filter((item) => item.active !== false).slice(0, 4);

  return (
    <div className="public-home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-kicker">{data.clinicName || "PUNAR AXIS THERAPY"}</span>
          <h1>{data.heroTitle || "Move Better. Heal Better. Live Better."}</h1>
          <p>{data.heroText || "Personalized physiotherapy, Ayurveda and rehabilitation care with an easy digital patient experience."}</p>
          <div className="home-actions"><Link className="primary-action" to="/appointment">Book Appointment →</Link><Link className="secondary-action" to="/request">Request a Service</Link><WhatsAppButton /></div>
          <div className="home-trust"><span>✓ Easy service request</span><span>✓ Patient portal</span><span>✓ Direct WhatsApp support</span></div>
        </div>
        <div className="home-hero-visual"><div className="hero-orb"><span>PA</span></div><div className="hero-float-card"><strong>Care + Convenience</strong><small>Everything you need in one app.</small></div></div>
      </section>

      <section className="home-section"><div className="home-section-head"><div><span className="home-kicker">SERVICES</span><h2>Care that fits your needs.</h2></div><Link to="/services">View all services →</Link></div><div className="home-services-grid">{services.map((service) => <article key={service.id} className="home-service-card"><div>{service.icon || "✦"}</div><h3>{service.title}</h3><p>{service.text}</p><Link to={`/request?service=${encodeURIComponent(service.title)}`}>Request →</Link></article>)}</div></section>

      <section className="home-tools"><div><span className="home-kicker">PATIENT EXPERIENCE</span><h2>Everything is connected.</h2><p>Book appointments, send service requests, chat with the clinic and access your patient portal from one place.</p></div><div className="home-tool-grid"><Link to="/services"><span>✦</span><strong>Services</strong><small>Explore care options</small></Link><Link to="/request"><span>📩</span><strong>Request</strong><small>Send your requirement</small></Link><Link to="/chat"><span>💬</span><strong>Chat</strong><small>Message the clinic</small></Link><Link to="/patient-login"><span>👤</span><strong>Patient Portal</strong><small>Appointments & records</small></Link></div></section>

      <section className="home-cta"><div><span className="home-kicker">NEED HELP?</span><h2>Talk to the clinic directly.</h2><p>For a quick conversation, use WhatsApp and send your question.</p></div><a href={getWhatsAppLink(data.whatsappNumber, data.whatsappMessage)} target="_blank" rel="noreferrer" className="cta-wa">💬 Open WhatsApp</a></section>
    </div>
  );
}

export default Home;
