"use client";

import { useState } from "react";
import { Card } from "@heroui/card";
import { Alert } from "@heroui/alert";
import { Clipboard, Copy, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { auth } from "@/app/firebase/init";

const URLInput = ({ url, setUrl }) => {
  return (
    <div className="flex items-center bg-slate-800/50 rounded-lg border border-slate-700/50">
      <input
        className="w-full px-4 py-3 bg-transparent border-none focus:border-none focus:ring-0 text-slate-200 placeholder-slate-500"
        placeholder="Paste your long URL"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        size="md"
        variant="ghost"
        onPress={() => navigator.clipboard.readText().then(setUrl)}
      >
        <Clipboard className="w-4 h-4" />
      </Button>
    </div>
  );
};

const Features = () => (
  <div className="grid grid-cols-3 gap-4 pt-2">
    {[
      { label: "API Access", value: "Included" },
      { label: "Analytics", value: "Real-time" },
      { label: "QR maker", value: "Available" },
    ].map((item) => (
      <div
        key={item.label}
        className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
      >
        <div className="text-xs text-slate-400">{item.label}</div>
        <div className="mt-1 max-sm:text-xs font-medium text-slate-200">
          {item.value}
        </div>
      </div>
    ))}
  </div>
);

const ShortURLDisplay = ({ shortUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex-1 font-mono text-slate-200 truncate">{shortUrl}</div>
      <Button size="md" variant="ghost" onPress={handleCopy}>
        {copied ? (
          <CheckCircle2 className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

const ShortenerComponent = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setUrl("")
    setShortUrl("")
    setError("")
    setIsLoading(false)
  }

  const handleShorten = async () => {
    if (!url.trim()) return;

    setError("");
    setIsLoading(true);
    setShortUrl("");

    try {
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        setError("Authentication required");

        return;
      }

      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          response.status === 429
            ? `Rate limit exceeded. Remaining: IP: ${data.limits.ip}, Daily: ${data.limits.anonymous}`
            : data.error || "Failed to shorten URL"
        );

        return;
      }

      if (data?.shortUrl) {
        const shortUrl = new URL(data.shortUrl);

        setShortUrl(shortUrl.href);
        setUrl("");
      }

    } catch {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-900/70 border-slate-800/50">
      <div className="p-6 space-y-6">
        {error && (
          <Alert className="mb-4" color="danger">
            {error}
          </Alert>
        )}

        <div>
          {shortUrl ? (
            <ShortURLDisplay shortUrl={shortUrl} />
          ) : (
            <URLInput setUrl={setUrl} url={url} />
          )}
        </div>

        <Button
          className="w-full"
          disabled={!url.trim() && !shortUrl}
          isLoading={isLoading}
          size="lg"
          onPress={() => !shortUrl ? handleShorten() : reset() }
        >
          {shortUrl ? "Shorten Another URL" : "Create Short URL"}
        </Button>

        <Features />
      </div>
    </Card>
  );
};

export default ShortenerComponent;
