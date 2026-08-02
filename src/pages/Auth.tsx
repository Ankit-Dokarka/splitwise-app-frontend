import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiLogIn,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
} from "react-icons/fi";

import type { AuthForm } from "../types/auth";
import useAuth from "../hooks/useAuth";

import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<AuthForm>();

  const { error, login, signUp, isLoading, clearError } = useAuth();

  const onSubmit = async (data: AuthForm) => {
    if (activeTab === "login") {
      const success = await login(data);

      if (success) {
        console.log("login-sucessfull");
        navigate("/dashboard");
      }

      return;
    }

    const success = await signUp(data);

    if (success) {
      console.log("sucess");
      navigate("/verify-email", { state: { fromSignup: true } });
    }
  };

  const handleTabChange = (tab: string) => {
    if (isLoading) return;
    clearErrors();
    if (error) clearError();
    reset({ email: "", password: "", username: "" });
    setActiveTab(tab);
  };

  const handleInputChange = () => {
    if (error) clearError();
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-(--color-bg) font-sans">
      <div className="hidden md:flex md:w-1/2 justify-center items-center overflow-hidden relative bg-(--color-primary)/10">
        <img
          src="/login-page-image.png"
          alt="image for login page"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none"></div>
      </div>

      <div className="flex w-full md:w-1/2 justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md bg-(--color-surface) border border-(--color-border) shadow-xl rounded-(--btn-radius) p-6 md:p-8 flex flex-col gap-6">
          <div className="text-center flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-(--color-text)">
              Splitwise
            </h1>
            <p className="text-sm text-(--color-text-muted) font-medium">
              {activeTab === "login"
                ? "Welcome back! Please enter your details."
                : "Create your account to get started."}
            </p>
          </div>

          <div className="bg-(--color-bg) p-1 flex gap-1 justify-center rounded-(--btn-radius)">
            <button
              className={`flex-1 p-2 rounded-(--btn-radius) text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              } ${
                activeTab === "login"
                  ? "bg-(--color-surface) text-(--color-primary) shadow-sm"
                  : "text-(--color-text-muted) hover:text-(--color-text)"
              }`}
              onClick={() => handleTabChange("login")}
              type="button"
              disabled={isLoading}
            >
              Login
            </button>
            <button
              className={`flex-1 p-2 rounded-(--btn-radius) text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              } ${
                activeTab === "signup"
                  ? "bg-(--color-surface) text-(--color-primary) shadow-sm"
                  : "text-(--color-text-muted) hover:text-(--color-text)"
              }`}
              onClick={() => handleTabChange("signup")}
              type="button"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            onChange={handleInputChange}
            noValidate
          >
            <div className="min-h-5 flex items-center justify-center">
              {error && (
                <p className="w-full p-2 text-center text-xs font-medium text-(--color-danger) bg-(--color-danger)/10 border border-(--color-danger)/20 rounded-(--btn-radius) transition-all duration-200">
                  {error}
                </p>
              )}
            </div>

            {activeTab === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-(--color-text)"
                >
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10" />
                  <input
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 5,
                        message: "Username must be at least 5 characters",
                      },
                    })}
                    type="text"
                    id="username"
                    placeholder="john_doe"
                    className="w-full border border-(--color-border) rounded-(--btn-radius) pl-9 pr-3 py-2.5 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/60 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 focus:outline-none transition-all bg-(--color-surface)"
                  />
                </div>
                <p className="text-(--color-danger) text-xs font-medium min-h-4">
                  {errors.username?.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-(--color-text)"
              >
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  className="w-full border border-(--color-border) rounded-(--btn-radius) pl-9 pr-3 py-2.5 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/60 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 focus:outline-none transition-all bg-(--color-surface)"
                />
              </div>
              <p className="text-(--color-danger) text-xs font-medium min-h-4">
                {errors.email?.message}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-(--color-text)"
              >
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10" />
                <input
                  key={activeTab}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    validate: (value: string) => {
                      if (activeTab === "login") {
                        return (
                          value.length >= 6 ||
                          "Password must be at least 6 characters"
                        );
                      }
                      if (activeTab === "signup") {
                        const regex =
                          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
                        return (
                          regex.test(value) ||
                          "Min 6 chars, 1 uppercase, 1 number & 1 symbol"
                        );
                      }
                      return true;
                    },
                  })}
                  className="w-full border border-(--color-border) rounded-(--btn-radius) pl-9 pr-10 py-2.5 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/60 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 focus:outline-none transition-all bg-(--color-surface)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text) transition-colors z-10"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <p className="text-(--color-danger) text-xs font-medium min-h-4">
                {errors.password?.message}
              </p>
            </div>

            <button
              className="w-full p-2.5 mt-1 rounded-(--btn-radius) bg-(--color-primary) hover:bg-(--color-primary-hover) text-(--color-surface) font-medium flex justify-center items-center gap-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                  {activeTab === "login" ? "Logging in..." : "Signing up..."}
                </>
              ) : (
                <>
                  <FiLogIn size={18} />
                  {activeTab === "login" ? "Login" : "Sign Up"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
