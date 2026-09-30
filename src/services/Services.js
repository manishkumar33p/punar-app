import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppContent } from "../services/appContent";
import "./Services.css";

function Services() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    getAppContent().then(setContent);
  }, []);

  const services = (content?.services || []).filter((item) => item.active !== false);

  return (
    <section className="services-page">
      <div className="services-shell">
        <span className="section-kicker">OUR SERVICES</span>
        <h1>Care designed around you.</h1>
        <p className="services-intro">Choose a service and send a request. Our team can follow up with you directly.</p>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id || service.title}>
              <div className="service-icon">{service.icon || "✦"}</div>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
              <Link to={`/request?service=${encodeURIComponent(service.title)}`}>Request this service →</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
