import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";

export const DEFAULT_CONTENT = {
  clinicName: "PUNAR AXIS THERAPY",
  tagline: "Ayurveda & Physiotherapy",
  heroTitle: "Move Better. Heal Better. Live Better.",
  heroText:
    "Personalized physiotherapy, Ayurveda and rehabilitation care with an easy digital patient experience.",
  whatsappNumber: "8796520257",
  whatsappMessage:
    "Hello Punar Axis Therapy, I would like to know more about your services.",
  phone: "8796520257",
  services: [
    {
      id: "physiotherapy",
      icon: "🦴",
      title: "Physiotherapy",
      text: "Personalized therapy for pain, mobility, strength and recovery.",
      active: true,
    },
    {
      id: "ayurveda",
      icon: "🌿",
      title: "Ayurveda",
      text: "Traditional wellness care integrated with a patient-focused approach.",
      active: true,
    },
    {
      id: "rehab",
      icon: "💪",
      title: "Rehabilitation",
      text: "Structured rehabilitation plans for movement and functional recovery.",
      active: true,
    },
    {
      id: "sports",
      icon: "🏃",
      title: "Sports Rehab",
      text: "Recovery support for sports injuries and performance-related needs.",
      active: true,
    },
  ],
};

// const CONTENT_DOC = "appSettings/public";

const cloneDefaults = () => JSON.parse(JSON.stringify(DEFAULT_CONTENT));

export async function getAppContent() {
  if (!isFirebaseConfigured) {
    try {
      const local = JSON.parse(localStorage.getItem("punar_axis_app_content") || "null");
      if (local) return { ...cloneDefaults(), ...local };
    } catch {}
    return cloneDefaults();
  }

  try {
    const snapshot = await getDoc(doc(db, "appSettings", "public"));
    if (!snapshot.exists()) return cloneDefaults();

    return {
      ...cloneDefaults(),
      ...snapshot.data(),
      services: Array.isArray(snapshot.data().services)
        ? snapshot.data().services
        : cloneDefaults().services,
    };
  } catch (error) {
    console.warn("App content read failed:", error);
    try {
      const local = JSON.parse(localStorage.getItem("punar_axis_app_content") || "null");
      if (local) return { ...cloneDefaults(), ...local };
    } catch {}
    return cloneDefaults();
  }
}

export async function saveAppContent(content) {
  const payload = {
    ...cloneDefaults(),
    ...content,
    services: Array.isArray(content.services) ? content.services : [],
    updatedAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured) {
    localStorage.setItem("punar_axis_app_content", JSON.stringify(payload));
    return payload;
  }

  await setDoc(doc(db, "appSettings", "public"), payload, { merge: true });
  return payload;
}

export async function createServiceRequest(request) {
  const payload = {
    ...request,
    status: "New",
    createdAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured) {
    const list = JSON.parse(localStorage.getItem("punar_axis_requests") || "[]");
    const saved = { ...request, status: "New", id: `REQ-${Date.now()}`, createdAt: new Date().toISOString() };
    localStorage.setItem("punar_axis_requests", JSON.stringify([saved, ...list]));
    return saved;
  }

  const ref = await addDoc(collection(db, "serviceRequests"), payload);
  return { ...request, id: ref.id, status: "New" };
}

export async function getServiceRequests() {
  if (!isFirebaseConfigured) {
    try {
      return JSON.parse(localStorage.getItem("punar_axis_requests") || "[]");
    } catch {
      return [];
    }
  }

  try {
    const q = query(collection(db, "serviceRequests"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    console.warn("Request read failed:", error);
    return [];
  }
}

export async function createChatMessage(message) {
  const payload = {
    ...message,
    createdAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured) {
    const list = JSON.parse(localStorage.getItem("punar_axis_chat") || "[]");
    const saved = { ...message, id: `CHAT-${Date.now()}`, createdAt: new Date().toISOString() };
    localStorage.setItem("punar_axis_chat", JSON.stringify([...list, saved]));
    return saved;
  }

  const ref = await addDoc(collection(db, "clinicChat"), payload);
  return { ...message, id: ref.id };
}

export async function getChatMessages() {
  if (!isFirebaseConfigured) {
    try {
      return JSON.parse(localStorage.getItem("punar_axis_chat") || "[]");
    } catch {
      return [];
    }
  }

  try {
    const q = query(collection(db, "clinicChat"), orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    console.warn("Chat read failed:", error);
    return [];
  }
}

export function getWhatsAppLink(number, message) {
  const clean = String(number || DEFAULT_CONTENT.whatsappNumber).replace(/\D/g, "");
  const international = clean.startsWith("91") ? clean : `91${clean}`;
  return `https://wa.me/${international}?text=${encodeURIComponent(
    message || DEFAULT_CONTENT.whatsappMessage
  )}`;
}
