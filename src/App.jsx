import { useContext, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePages.jsx";

import "./App.css";
import Navbar from "./components/Navbar.jsx";
import New from "./components/New.jsx";
import { myContext } from "./context/contextProvider.jsx";

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
        {/* <Route
          path="/dashboard"
          element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />}
        /> */}

        {/* <Route
          path="/problems"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}
        /> */}
        {/* <Route
          path="/problem/:id"
          element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />}
        /> */}
        {/* <Route
          path="/session/:id"
          element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />}
        /> */}
      </Routes>

      {/* <Toaster toastOptions={{ duration: 3000 }} /> */}
    </>
  );
}

export default App;
