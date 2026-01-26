import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AppContext } from "../../context/userProvider";
import type { BadRequest } from "../../types/request";
import type { LoginResponse } from "../../types/common";

export default function DiscordSignup() {
  const ctx = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(false);

  if (!ctx) {
    return null;
  }

  const { setJwtToken } = ctx;
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5200/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          Password: password,
          UserName: user_name,
        }),
      });

      if (!res.ok) {
        const err: BadRequest = await res.json().catch(() => null);
        console.error("Register failed:", err || res.statusText);
        toast.error(err.message);
        return;
      }

      // Başarılı olduysa
      const data: LoginResponse = await res.json();
      console.log("Register success:", data);
      if (data.token) setJwtToken(data.token);
      toast.success("Başarıyla giriş yapıldı");
      navigate("/friends");
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Sunucuya bağlanırken hata oluştu.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-900 via-purple-900 to-blue-800 relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-40 left-20 w-48 h-48 bg-indigo-600 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-1/4 right-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-40 w-1 h-1 bg-white rounded-full animate-pulse delay-75"></div>
      <div className="absolute bottom-1/4 right-60 w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-150"></div>

      {/* Discord Logo */}
      <div className="absolute top-12 left-12">
        <h1 className="text-white text-3xl font-bold">Discord</h1>
      </div>

      {/* Main Form Card */}
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          Create an account
        </h2>

        <form onSubmit={(e) => handleSignUp(e)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Display Name Field */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Email Opt-in Checkbox */}
          <div className="flex items-start space-x-3 pt-2">
            <input
              type="checkbox"
              id="emailOptIn"
              checked={emailOptIn}
              onChange={(e) => setEmailOptIn(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <label
              htmlFor="emailOptIn"
              className="text-gray-400 text-xs leading-relaxed"
            >
              (Optional) It's okay to send me emails with Discord updates, tips
              and special offers. You can opt out at any time.
            </label>
          </div>

          {/* Terms and Privacy */}
          <p className="text-gray-400 text-xs leading-relaxed">
            By clicking 'Create Account', you agree to Discord's{" "}
            <a className="text-blue-400 hover:underline">Terms of Service</a>{" "}
            and have read the{" "}
            <a className="text-blue-400 hover:underline">Privacy Policy</a>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded transition-colors"
          >
            Create Account
          </button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <Link to={"/"} className="text-blue-400 hover:underline text-sm">
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
