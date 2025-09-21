"use client";

import { useState } from "react";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // This is a simple client-side redirect. In a real Next.js app,
  // you would use the useRouter hook from 'next/navigation'
  // to perform a proper client-side navigation without a full page reload.
  const handleRedirect = (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // This is a simulated, in-memory database.
    const USERS = [
      { id: 1, email: "admin@example.com", username: "admin", role: "admin" },
      { id: 2, email: "faculty@example.com", username: "faculty", role: "faculty" },
      { id: 3, email: "student@example.com", username: "student", role: "student" },
    ];

    const userExists = USERS.find((u) => u.email === email || u.username === username);
    if (userExists) {
      setMessage("Account with this email or username already exists.");
    } else {
      const newUser = {
        id: USERS.length + 1,
        firstName,
        lastName,
        username,
        email,
        password,
        role,
      };
      USERS.push(newUser);
      setMessage(`Signed up successfully as ${role}! You can now log in.`);
      handleRedirect("/login");
    }
    setLoading(false);
  };

  const roles = ["student", "faculty", "admin"];

  const getRoleColor = (r: string) => {
    switch (r) {
      case "student":
        return "bg-blue-500";
      case "faculty":
        return "bg-green-500";
      case "admin":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Sign Up</h1>

        {/* Role Slider Tabs */}
        <div className="flex justify-end mb-6">
          <div className="flex justify-between items-center p-1 bg-gray-200 rounded-full shadow-inner w-full max-w-xs">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`w-1/3 py-2 text-sm font-semibold capitalize rounded-full transition-all duration-300 ${
                  role === r
                    ? "text-white shadow-md " + getRoleColor(r)
                    : "text-gray-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md text-center mb-4 text-sm font-medium ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold ml-1 transition-colors">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
