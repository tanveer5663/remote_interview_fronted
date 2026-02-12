import "./App.css";

import { useContext, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePages.jsx";
import Navbar from "./components/Navbar.jsx";
import { myContext } from "./context/contextProvider.jsx";
import { Toaster } from "react-hot-toast";
import ProblemsPage from "./pages/ProblemsPage.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import SessionPage from "./pages/SessionPage.jsx";

function App() {
  const { userData } = useContext(myContext);

  return (
    <>
      <Navbar data={userData} />
      <Routes>
        <Route
          path="/"
          element={!userData ? <HomePage /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/dashboard"
          element={userData ? <DashboardPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/problems"
          element={userData ? <ProblemsPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problem/:id"
          element={userData ? <ProblemPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/session/:id"
          element={userData ? <SessionPage /> : <Navigate to={"/"} />}
        />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
