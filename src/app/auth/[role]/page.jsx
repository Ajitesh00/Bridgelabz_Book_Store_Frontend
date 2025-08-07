"use client";

import AuthCard from "../../components/AuthCard";
import { useParams } from "next/navigation";

export default function AuthPage() {
    const { role } = useParams(); // now role will be "user" or "admin"
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthCard role={role} />
    </div>
  );
}