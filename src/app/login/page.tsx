"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState("faculty");
  const router = useRouter();

  const handleLogin = () => {
    router.push(`/${role}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-10 rounded-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-600">Login</h2>
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <select
          className="w-full border rounded-md p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
        <Button className="w-full" onClick={handleLogin}>Login</Button>
      </div>
    </div>
  );
}
