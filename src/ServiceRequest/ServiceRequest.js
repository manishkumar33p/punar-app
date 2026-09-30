import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createServiceRequest } from "../services/appContent";
import WhatsAppButton from "../components/WhatsAppButton";
import "./ServiceRequest.css";

function ServiceRequest() {
  const [params] = useSearchParams();
  const selectedService = params.get("service") || "";
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: selectedService, message: "" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const serviceOptions = useMemo(() => ["Physiotherapy", "Ayurveda", "Rehabilitation", "Sports Rehab", "Other"], []);

  const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.service) {
      setError("Please enter your name, mobile number and select a service.");
      return;
    }
    setSaving(true);
    try {
      await createServiceRequest(form);
      setDone(true);
      setForm({ name: "", phone: "", email: "", service: selectedService, message: "" });
    } catch (err) {
      setError(err?.message || "Request could not be submitted.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="request-page">
      <div className="request-card">
        <div className="request-copy">
          <span className="section-kicker">SERVICE REQUEST</span>
          <h1>Tell us what you need.</h1>
          <p>Send your details and our team can contact you about the selected service.</p>
          <WhatsAppButton />
        </div>

        <form className="request-form" onSubmit={submit}>
          {done && <div className="request-success">✓ Request submitted successfully. Our team will contact you.</div>}
          {error && <div className="request-error">{error}</div>}
          <label>Name<input name="name" value={form.name} onChange={update} placeholder="Your name" /></label>
          <label>Mobile<input name="phone" value={form.phone} onChange={update} inputMode="numeric" placeholder="10-digit mobile number" /></label>
          <label>Email <span>(optional)</span><input name="email" value={form.email} onChange={update} type="email" placeholder="you@example.com" /></label>
          <label>Service<select name="service" value={form.service} onChange={update}><option value="">Select a service</option>{serviceOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Message <span>(optional)</span><textarea name="message" value={form.message} onChange={update} rows="4" placeholder="Tell us briefly what you need..." /></label>
          <button disabled={saving}>{saving ? "Sending..." : "Send Request →"}</button>
        </form>
      </div>
    </div>
  );
}

export default ServiceRequest;
