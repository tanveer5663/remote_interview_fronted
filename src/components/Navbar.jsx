import React, { useContext } from "react";
import { Link, useLocation } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
} from "lucide-react";

import { authApi } from "../api/auth";

function Navbar({ data }) {
  // const checkauth = async () => {
  //   try {
  //     const res = await authApi.signUp({
  //       email: "example@example.com",
  //       name: "Tanveer",
  //       password: "tanveer",
  //     });
  //   } catch (error) {
  //     console.error("Error checking auth:", error);
  //   }
  // };

  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to={"/"}
          className="flex items-center gap-3 hover:scale-105 transition-transform duration-500"
        >
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <SparklesIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Remote Interview
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">
              Code Together
            </span>
          </div>
        </Link>
        {/* <button onClick={checkauth} className=" cursor-pointer">
          tanvee
        </button> */}
        {/* NAV LINKS */}
        <div className="flex items-center gap-3">
          {/* PROBLEMS PAGE LINK */}
          {data && (
            <Link
              to={"/problems"}
              className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/problems")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
            >
              <div className="flex items-center gap-x-2.5">
                <BookOpenIcon className="size-4" />
                <span className="font-medium hidden sm:inline">Problems</span>
              </div>
            </Link>
          )}

          {/* DASHBORD PAGE LINK */}
          {data && (
            <Link
              to={"/dashboard"}
              className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
            >
              <div className="flex items-center gap-x-2.5">
                <LayoutDashboardIcon className="size-4" />
                <span className="font-medium hidden sm:inline">Dashbord</span>
              </div>
            </Link>
          )}

          {/* AUTH BTN */}

          {!data ? (
            <button className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 flex items-center gap-2 cursor-pointer">
              <span>Get Started</span>
              <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <h1>Please Login</h1>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
