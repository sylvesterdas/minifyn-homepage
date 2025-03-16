"use client";
import { useState, useEffect } from "react";
import { Card } from "@heroui/card";
import { FaEye, FaEyeSlash, FaCopy, FaTrash } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { useFirebase } from "@/app/providers/firebase-provider";

export default function APIKeyPage() {
  const { user } = useFirebase();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchApiKey();
  }, [user]);

  const fetchApiKey = async () => {
    const idToken = await user?.getIdToken();
    const res = await fetch("/api/api-key", {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    const data = await res.json();

    setApiKey(data.apiKey || "");
    setLoading(false);
  };

  const generateKey = async () => {
    const idToken = await user?.getIdToken();
    const res = await fetch("/api/api-key", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });
    const data = await res.json();

    setApiKey(data.apiKey);
  };

  const deleteKey = async () => {
    const idToken = await user?.getIdToken();

    await fetch("/api/api-key", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${idToken}` },
    });
    setApiKey("");
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    alert("API Key copied to clipboard");
  };

  if (loading)
    return (
      <div className="justify-center items-center w-full h-full">
        Loading...
      </div>
    );

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <Card className="p-6 bg-slate-900/70 border-slate-800/50">
        <h1 className="text-2xl font-bold text-white mb-6">API Key</h1>

        {apiKey ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800 rounded font-mono text-sm break-all flex items-center">
              <span className="flex-1">
                {isVisible ? apiKey : "•".repeat(apiKey.length)}
              </span>
              <div className="flex items-center space-x-0">
                <Button
                  className="!min-w-max"
                  fullWidth={false}
                  variant="ghost"
                  onPress={toggleVisibility}
                >
                  {isVisible ? (
                    <FaEyeSlash className="w-4 h-4 text-white" />
                  ) : (
                    <FaEye className="w-4 h-4 text-white" />
                  )}
                </Button>
                <Button
                  className="!min-w-max"
                  fullWidth={false}
                  variant="ghost"
                  onPress={copyToClipboard}
                >
                  <FaCopy className="w-4 h-4 text-white" />
                </Button>
                <Button className="!min-w-max" fullWidth={false} variant="ghost" onPress={deleteKey}>
                  <FaTrash className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Keep this key secure. It cannot be recovered if lost.
            </p>
          </div>
        ) : (
          <Button onPress={generateKey}>Generate API Key</Button>
        )}
      </Card>
    </div>
  );
}
