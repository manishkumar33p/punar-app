import React, { useEffect, useState } from "react";
import { createChatMessage, getChatMessages } from "../services/appContent";
import WhatsAppButton from "../components/WhatsAppButton";
import "./Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", text: "" });
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  const load = async () => setMessages(await getChatMessages());
  useEffect(() => { load(); }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setSending(true); setNotice("");
    try {
      await createChatMessage({ ...form, sender: "visitor" });
      setForm((prev) => ({ ...prev, text: "" }));
      await load();
      setNotice("Message sent. Our team can respond from the admin panel.");
    } catch (error) {
      setNotice(error?.message || "Message could not be sent.");
    } finally { setSending(false); }
  };

  return (
    <div className="chat-page">
      <div className="chat-card">
        <div className="chat-header"><div><span className="section-kicker">CHAT WITH US</span><h1>Have a question?</h1><p>Leave a message for the clinic team.</p></div><WhatsAppButton compact /></div>
        <div className="chat-messages">
          {messages.length === 0 ? <div className="chat-empty">No messages yet. Start the conversation below.</div> : messages.map((item) => <div className={`chat-bubble ${item.sender === "admin" ? "admin" : "visitor"}`} key={item.id}><strong>{item.sender === "admin" ? "Clinic Team" : item.name || "You"}</strong><p>{item.text}</p></div>)}
        </div>
        <form className="chat-form" onSubmit={send}>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Mobile (optional)" />
          <div className="chat-send-row"><input value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Type your message..." /><button disabled={sending}>{sending ? "..." : "Send"}</button></div>
          {notice && <small>{notice}</small>}
        </form>
      </div>
    </div>
  );
}

export default Chat;
