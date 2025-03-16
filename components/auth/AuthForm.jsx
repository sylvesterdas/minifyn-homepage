"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

import { auth } from "@/app/firebase/init";
import { Button } from "@/components/ui/button";

export default function AuthForm({ mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(mode === "signin" ? "Invalid credentials" : err.message);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-md w-full items-center mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            required
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button className="w-full" type="submit">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          {mode === "signin" ? (
            <p className="text-sm dark:text-white">
              Don&apos;t have an account?{" "}
              <Link className="text-blue-500 hover:underline" href="/signup">
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="text-sm dark:text-white">
              Already have an account?{" "}
              <Link className="text-blue-500 hover:underline" href="/signin">
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}