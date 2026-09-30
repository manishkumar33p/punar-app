import React, { useEffect, useState } from "react";
import { getAppContent, getWhatsAppLink } from "../services/appContent";
import "./WhatsAppButton.css";

function WhatsAppButton({ compact = false }) {
  const [link, setLink] = useState(
    getWhatsAppLink("8796520257", "Hello Punar Axis Therapy, I need assistance.")
  );

  useEffect(() => {
    let mounted = true;
    getAppContent().then((content) => {
      if (mounted) setLink(getWhatsAppLink(content.whatsappNumber, content.whatsappMessage));
    });
    return () => { mounted = false; };
  }, []);

  return (
    <a className={`wa-button ${compact ? "wa-compact" : ""}`} href={link} target="_blank" rel="noreferrer">
      <span>💬</span>
      {!compact && <strong>WhatsApp Us</strong>}
    </a>
  );
}

export default WhatsAppButton;
