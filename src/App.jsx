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
  const data = useContext(myContext);

  return (
    <>
      <Navbar data={data} />

      <Routes>
        <Route
          path="/"
          element={!data ? <HomePage /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/dashboard"
          element={data ? <DashboardPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/problems"
          element={data ? <ProblemsPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problem/:id"
          element={data ? <ProblemPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/session/:id"
          element={data ? <SessionPage /> : <Navigate to={"/"} />}
        />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
