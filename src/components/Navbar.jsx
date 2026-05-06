import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ArrowRightIcon,
  SparklesIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  LogOut,
  LoaderIcon,
} from "lucide-react";
import { myContext } from "../context/contextProvider.jsx";

import { authApi } from "../api/auth";

function Navbar({ data }) {
  const { setUserData } = useContext(myContext);
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    isLoading: false,
    errorMessage: "",
  });
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handlAuth = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(authData);
    if (
      !authData.email ||
      !authData.password ||
      (isSigningUp && !authData.name)
    ) {
      setAuthData((prev) => ({
        ...prev,
        errorMessage: "All fields are required",
      }));
      return;
    }

    setAuthData((prev) => ({ ...prev, isLoading: true, errorMessage: "" }));

    try {
      let res;
      if (isSigningUp) {
        res = await authApi.signUp({
          email: authData.email,
          name: authData.name || authData.email.split("@")[0],
          password: authData.password,
        });
      } else {
        res = await authApi.signIn({
          email: authData.email,
          password: authData.password,
        });
      }

      console.log("Auth response:", res);
      document.getElementById("my_modal_2").close();
      setUserData(res?.data);
    } catch (error) {
      // console.error("Error checking auth:", error);
      console.error(
        "Error checking auth:",
        error?.response?.data?.message || error.message,
      );
      const err = error?.response?.data?.message;
      console.log(err);

      setAuthData((prev) => ({
        ...prev,
        errorMessage: err || "Failed to sign up. Please try again.",
      }));
    } finally {
      setAuthData((prev) => ({ ...prev, isLoading: false }));
    }
  };
  const logout = async () => {
    try {
      await authApi.logout();
      setUserData(null);

      ; // Redirect to home page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  return (
    <>
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

          {/* NAV LINKS */}
          <div className="flex items-center gap-4">
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
            {data && (
              <Link
                to={"/test"}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/test")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
              >
                <div className="flex items-center gap-x-2.5">
                  <BookOpenIcon className="size-4" />
                  <span className="font-medium hidden sm:inline">Test</span>
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
              <button
                className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 flex items-center gap-2 cursor-pointer"
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
              >
                <span>Get Started</span>
                <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <>
                <LogOut
                  className="h-8 w-8 cursor-pointer   transition-all duration-500 hover:scale-110   "
                  strokeWidth={2.6}
                  onClick={logout}
                />
              </>
            )}
          </div>
        </div>
      </nav>
      <dialog id="my_modal_2" className="modal  ">
        <div className="modal-box p-0 border-2  ">
          <div className="z-50 flex items-center justify-center ">
            <div className="w-full h-full rounded-2xl p-6  ">
              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center">
                {isSigningUp ? "Sign Up" : "Sign In"}
              </h2>

              {/* Google Button */}
              {/* <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-sm font-medium text-white hover:bg-[#1f1f1f] transition">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 48 48">
                  <path
                    fill="currentColor"
                    d="M43.6 20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-4z"
                  />
                </svg>
                Continue with Google
              </button> */}

              {/* Divider */}
              {/* <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-zinc-500">OR</span>
                <div className="h-px flex-1 bg-white/10" />
              </div> */}

              {/* Form */}
              <form>
                <div className="space-y-4">
                  {isSigningUp && (
                    <div>
                      <label className="text-sm text-zinc-200">Name</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        autoComplete="name"
                        className="mt-1 w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500"
                        onChange={(e) =>
                          setAuthData((prev) => ({
                            ...prev,
                            name: e.target.value,
                            errorMessage: "",
                          }))
                        }
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-zinc-200">Email</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500"
                      onChange={(e) =>
                        setAuthData((prev) => ({
                          ...prev,
                          email: e.target.value,
                          errorMessage: "",
                        }))
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <label className="text-sm text-zinc-200">Password</label>
                    <input
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500"
                      onChange={(e) =>
                        setAuthData((prev) => ({
                          ...prev,
                          password: e.target.value,
                          errorMessage: "",
                        }))
                      }
                    />
                  </div>
                  <p className="text-sm text-red-500 min-h-5 ">
                    {authData?.errorMessage}
                  </p>

                  {/* Submit */}
                  <button
                    className="group w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl   cursor-pointer flex items-center justify-center"
                    onClick={handlAuth}
                    disabled={authData.isLoading}
                  >
                    {authData.isLoading && (
                      <LoaderIcon className="size-5 animate-spin mr-3" />
                    )}
                    <span>Sign In</span>
                  </button>
                </div>
              </form>

              {/* Footer */}
              <p className="mt-5 text-center text-sm text-zinc-400">
                Don’t have an account?{" "}
                <span
                  className=" bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text hover:underline font-bold cursor-pointer "
                  onClick={() => setIsSigningUp((prev) => !prev)}
                >
                  {isSigningUp ? "Sign In" : "Sign Up"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default Navbar;
