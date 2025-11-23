import React, { useState } from "react";
import AuthImagePattern from "../components/AuthImagePattern";
import { Eye, EyeOff, Loader2, Mail, MessageSquare, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthstore } from "../store/useAuthstore";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { isLoggingIn, signin } = useAuthstore();
  const [showPassword, setShowPasword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateform = () => {
    if (!formData.email.trim()) return toast.error("Email is Required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid Email Format");
    if (!formData.password.trim()) return toast.error("Password is Required");
    if (formData.password.trim().length < 6)
      return toast.error("Password must be of min 6 characters");

    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateform();
    if (success) signin(formData);
  };
  return (
    <div className="min-h-screen grid lg: grid-cols-2">
      {/* leftSide */}
      <div className="flex flex-col justify-center items items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 ">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2 ">Log In</h1>
              <p className="text-base-content/60">
                Get Started with Your account
              </p>
            </div>
          </div>
          {/* form */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>

              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40 z-20" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="JohnDoe@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="size-5 text-base-content/40 z-20" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0  right-0 pr-3 flex items-center "
                  onClick={() => setShowPasword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40 z-20 cursor-pointer " />
                  ) : (
                    <Eye className="size-5 text-base-content/40 z-20 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5  animate-spin" />
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60 ">
              New Here?{" "}
              <Link to="/signup" className="link link-primary">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join Our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones"
      />
    </div>
  );
};

export default LoginPage;
