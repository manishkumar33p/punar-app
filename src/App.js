// import React from "react";
// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import Home from "./Home/Home";
// import Services from "./services/services";
// import ServiceRequest from "./ServiceRequest/ServiceRequest";
// import Chat from "./Chat/Chat";
// import AdminPanel from "./AdminPanel/AdminPanel";
// import Appointment from "./Appointment/Appointment";
// import AppointmentDetails from "./Appointment/AppointmentDetails";
// import EmployeeAttendance from "./EmployeeAttendance/EmployeeAttendance";
// import Inventory from "./Inventory/Inventory";
// import OwnerDashboard from "./OwnerDashboard/OwnerDashboard";
// import PatientManagement from "./PatientManagement/PatientManagement";
// import ManagementLogin from "./ManagementLogin/ManagementLogin";
// import ProtectedRoute from "./ProtectedRoute";
// import PatientLogin from "./PatientLogin/PatientLogin";
// import PatientDashboard from "./PatientDashboard/PatientDashboard";
// import PatientProtectedRoute from "./PatientProtectedRoute";
// import ManagementDashboard from "./ManagementDashboard/ManagementDashboard";
// import CommonLayout from "./CommonNavbar/CommonLayout";

// const publicPage = (element) => <CommonLayout>{element}</CommonLayout>;
// const protectedPage = (element) => <CommonLayout><ProtectedRoute>{element}</ProtectedRoute></CommonLayout>;

// const router = createBrowserRouter([
//   { path: "/", element: publicPage(<Home />) },
//   { path: "/services", element: publicPage(<Services />) },
//   { path: "/request", element: publicPage(<ServiceRequest />) },
//   { path: "/chat", element: publicPage(<Chat />) },
//   { path: "/management-login", element: <ManagementLogin /> },
//   { path: "/management-dashboard", element: protectedPage(<ManagementDashboard />) },
//   { path: "/admin-panel", element: protectedPage(<AdminPanel />) },
//   { path: "/appointment", element: protectedPage(<Appointment />) },
//   { path: "/appointment-details", element: protectedPage(<AppointmentDetails />) },
//   { path: "/patient-management", element: protectedPage(<PatientManagement />) },
//   { path: "/employee-attendance", element: protectedPage(<EmployeeAttendance />) },
//   { path: "/inventory", element: protectedPage(<Inventory />) },
//   { path: "/owner-dashboard", element: protectedPage(<OwnerDashboard />) },
//   { path: "/patient-login", element: publicPage(<PatientLogin />) },
//   { path: "/patient-dashboard", element: publicPage(<PatientProtectedRoute><PatientDashboard /></PatientProtectedRoute>) },
// ]);

// function App() { return <RouterProvider router={router} />; }
// export default App;



import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./Home/Home";
import Services from "./services/Services";
import ServiceRequest from "./ServiceRequest/ServiceRequest";
import Chat from "./Chat/Chat";
import AdminPanel from "./AdminPanel/AdminPanel";

import Appointment from "./Appointment/Appointment";
import AppointmentDetails from "./Appointment/AppointmentDetails";
import EmployeeAttendance from "./EmployeeAttendance/EmployeeAttendance";
import Inventory from "./Inventory/Inventory";

import OwnerDashboard from "./OwnerDashboard/OwnerDashboard";
import PatientManagement from "./PatientManagement/PatientManagement";

import ManagementLogin from "./ManagementLogin/ManagementLogin";
import ProtectedRoute from "./ProtectedRoute";

import PatientLogin from "./PatientLogin/PatientLogin";
import PatientDashboard from "./PatientDashboard/PatientDashboard";
import PatientProtectedRoute from "./PatientProtectedRoute";

import ManagementDashboard from "./ManagementDashboard/ManagementDashboard";

import CommonLayout from "./CommonNavbar/CommonLayout";


const publicPage = (element) => (
  <CommonLayout>
    {element}
  </CommonLayout>
);

const protectedPage = (element) => (
  <CommonLayout>
    <ProtectedRoute>
      {element}
    </ProtectedRoute>
  </CommonLayout>
);


const router = createBrowserRouter([
  {
    path: "/",
    element: publicPage(<Home />),
  },

  {
    path: "/services",
    element: publicPage(<Services />),
  },

  {
    path: "/request",
    element: publicPage(<ServiceRequest />),
  },

  {
    path: "/chat",
    element: publicPage(<Chat />),
  },

  {
    path: "/management-login",
    element: <ManagementLogin />,
  },

  // Friendly aliases for the clinic admin portal.
  {
    path: "/admin",
    element: <ManagementLogin />,
  },

  {
    path: "/management-dashboard",
    element: protectedPage(<ManagementDashboard />),
  },

  {
    path: "/admin-panel",
    element: protectedPage(<AdminPanel />),
  },

  {
    path: "/admin-portal",
    element: protectedPage(<AdminPanel />),
  },

  {
    // Patients/users must be able to book without entering the management portal.
    path: "/appointment",
    element: publicPage(<Appointment />),
  },

  {
    path: "/appointment-details",
    element: protectedPage(<AppointmentDetails />),
  },

  {
    path: "/patient-management",
    element: protectedPage(<PatientManagement />),
  },

  {
    path: "/employee-attendance",
    element: protectedPage(<EmployeeAttendance />),
  },

  {
    path: "/inventory",
    element: protectedPage(<Inventory />),
  },

  {
    path: "/owner-dashboard",
    element: protectedPage(<OwnerDashboard />),
  },

  {
    path: "/patient-login",
    element: publicPage(<PatientLogin />),
  },

  {
    path: "/patient-dashboard",
    element: publicPage(
      <PatientProtectedRoute>
        <PatientDashboard />
      </PatientProtectedRoute>
    ),
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;