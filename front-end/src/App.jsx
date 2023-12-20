import { useState } from "react";
import Login from "./components/login";
import SignUp from "./components/signup";
import Home from "./components/homePage/home";
import Admin from "./components/admin";
import NoAccess from "./components/noAccess";

import { Route, Link, Routes } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

import "./App.css";
import PrivateRoute from "./components/SignedInRoute";
import ApprovedRoute from "./components/approvedRoute";
import AdminRoute from "./components/adminRoute";

import NewClient from "./components/newClientPage/newClient";
import ClientDetails from "./components/clientDetailsPage/clientDetails";
import NewRepair from "./components/newRepairPage/newRepair";
import RepairDetails from "./components/repairDetails/repairDetails";
import NotFoundPage from "./components/NotFoundPage";
import BadRequestPage from "./components/BadRequestPage";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <br />
        <br />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<SignUp />} />

          <Route path="/no-access" element={<PrivateRoute />}>
            <Route path="/no-access" element={<NoAccess />} />
          </Route>

          <Route path="/" element={<ApprovedRoute />}>
            {" "}
            //this is a private route for home make sure they are tech or admin
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="/newClient" element={<ApprovedRoute />}>
            <Route path="/newClient" element={<NewClient />} />
          </Route>

          <Route path="/clientDetails/:clientId" element={<ApprovedRoute />}>
            <Route
              path="/clientDetails/:clientId"
              element={<ClientDetails />}
            />
          </Route>

          <Route
            path="/newRepair/:clientId/:deviceId"
            element={<ApprovedRoute />}
          >
            <Route
              path="/newRepair/:clientId/:deviceId"
              element={<NewRepair />}
            />
          </Route>

          <Route path="/repair/:repairId" element={<ApprovedRoute />}>
            <Route path="/repair/:repairId" element={<RepairDetails />} />
          </Route>

          <Route path="/adminTools" element={<AdminRoute />}>
            {" "}
            //this is a private route for a manager ... change the private route
            for manager route eventually
            <Route path="/adminTools" element={<Admin />} />
          </Route>
          <Route path="/400" element={<BadRequestPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
