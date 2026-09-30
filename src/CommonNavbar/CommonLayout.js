import React from "react";
import CommonNavbar from "./CommonNavbar";
import WhatsAppButton from "../components/WhatsAppButton";

function CommonLayout({ children }) {
  return (
    <div className="app-layout">
      <CommonNavbar />
      <main className="app-content">{children}</main>
      <div className="common-floating-whatsapp"><WhatsAppButton compact /></div>
    </div>
  );
}

export default CommonLayout;
