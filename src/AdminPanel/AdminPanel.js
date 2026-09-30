import React, { useEffect, useState } from "react";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { getAppContent, getChatMessages, getServiceRequests, saveAppContent, createChatMessage } from "../services/appContent";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./AdminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("content");
  const [content, setContent] = useState(null);
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [reply, setReply] = useState("");

  const load = async () => {
    const [app, req, chat] = await Promise.all([getAppContent(), getServiceRequests(), getChatMessages()]);
    setContent(app); setRequests(req); setMessages(chat);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true); setNotice("");
    try { await saveAppContent(content); setNotice("App settings saved successfully."); }
    catch (error) { setNotice(error?.message || "Could not save settings."); }
    finally { setSaving(false); }
  };

  const updateService = (index, key, value) => {
    setContent((prev) => ({ ...prev, services: prev.services.map((item, i) => i === index ? { ...item, [key]: value } : item) }));
  };

  const addService = () => setContent((prev) => ({ ...prev, services: [...prev.services, { id: `service-${Date.now()}`, icon: "✦", title: "New Service", text: "Add service description.", active: true }] }));

  const removeService = (index) => setContent((prev) => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));

  const updateRequestStatus = async (item, status) => {
    try {
      if (isFirebaseConfigured) await updateDoc(doc(collection(db, "serviceRequests"), item.id), { status });
      else {
        const next = requests.map((row) => row.id === item.id ? { ...row, status } : row);
        localStorage.setItem("punar_axis_requests", JSON.stringify(next));
      }
      await load();
    } catch (error) { setNotice(error?.message || "Could not update request."); }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    await createChatMessage({ name: "Clinic Team", phone: "", text: reply.trim(), sender: "admin" });
    setReply(""); await load();
  };

  const logout = async () => { await signOut(auth); navigate("/management-login", { replace: true }); };

  if (!content) return <div className="admin-loading">Loading admin controls...</div>;

  return (
    <div className="admin-panel-page">
      <header className="admin-panel-top"><div><span>ADMIN CONTROL CENTER</span><h1>Manage your app</h1><p>Change public content, review requests and manage chat.</p></div><button onClick={logout}>Sign out</button></header>
      <div className="admin-tabs"><button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")}>⚙ App Content</button><button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>📩 Requests <b>{requests.filter((x) => x.status === "New").length}</b></button><button className={tab === "chat" ? "active" : ""} onClick={() => setTab("chat")}>💬 Chat</button></div>

      {tab === "content" && <section className="admin-section">
        <div className="section-head"><div><span>PUBLIC APP</span><h2>Brand & contact settings</h2></div><button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button></div>
        {notice && <div className="admin-notice">{notice}</div>}
        <div className="admin-form-grid">
          <label>Clinic name<input value={content.clinicName} onChange={(e) => setContent({ ...content, clinicName: e.target.value })} /></label>
          <label>Tagline<input value={content.tagline} onChange={(e) => setContent({ ...content, tagline: e.target.value })} /></label>
          <label>WhatsApp number<input value={content.whatsappNumber} onChange={(e) => setContent({ ...content, whatsappNumber: e.target.value })} /></label>
          <label>Phone<input value={content.phone} onChange={(e) => setContent({ ...content, phone: e.target.value })} /></label>
          <label className="wide">WhatsApp message<input value={content.whatsappMessage} onChange={(e) => setContent({ ...content, whatsappMessage: e.target.value })} /></label>
          <label className="wide">Home headline<input value={content.heroTitle} onChange={(e) => setContent({ ...content, heroTitle: e.target.value })} /></label>
          <label className="wide">Home description<textarea rows="3" value={content.heroText} onChange={(e) => setContent({ ...content, heroText: e.target.value })} /></label>
        </div>
        <div className="service-editor-head"><div><span>SERVICES</span><h2>Edit services shown in the app</h2></div><button onClick={addService}>+ Add Service</button></div>
        <div className="admin-service-list">{content.services.map((service, index) => <div className="admin-service-row" key={service.id || index}><input className="icon-input" value={service.icon} onChange={(e) => updateService(index, "icon", e.target.value)} /><input value={service.title} onChange={(e) => updateService(index, "title", e.target.value)} /><input value={service.text} onChange={(e) => updateService(index, "text", e.target.value)} /><label className="switch"><input type="checkbox" checked={service.active !== false} onChange={(e) => updateService(index, "active", e.target.checked)} /> Active</label><button className="danger" onClick={() => removeService(index)}>Delete</button></div>)}</div>
      </section>}

      {tab === "requests" && <section className="admin-section"><div className="section-head"><div><span>INCOMING</span><h2>Service requests</h2></div><button onClick={load}>Refresh</button></div><div className="admin-request-list">{requests.length === 0 ? <div className="empty-admin">No requests yet.</div> : requests.map((item) => <article className="request-row" key={item.id}><div><strong>{item.name}</strong><span>{item.phone}{item.email ? ` • ${item.email}` : ""}</span><p><b>{item.service}</b>{item.message ? ` — ${item.message}` : ""}</p></div><select value={item.status || "New"} onChange={(e) => updateRequestStatus(item, e.target.value)}><option>New</option><option>Contacted</option><option>In Progress</option><option>Completed</option><option>Closed</option></select></article>)}</div></section>}

      {tab === "chat" && <section className="admin-section"><div className="section-head"><div><span>LIVE INBOX</span><h2>Visitor chat</h2></div><button onClick={load}>Refresh</button></div><div className="admin-chat-list">{messages.map((item) => <div className={`admin-chat-row ${item.sender === "admin" ? "mine" : ""}`} key={item.id}><strong>{item.sender === "admin" ? "You / Clinic Team" : item.name || "Visitor"}</strong><p>{item.text}</p><small>{item.phone || ""}</small></div>)}</div><form className="admin-reply" onSubmit={sendReply}><input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply to the chat..." /><button>Send Reply</button></form></section>}
    </div>
  );
}

export default AdminPanel;
