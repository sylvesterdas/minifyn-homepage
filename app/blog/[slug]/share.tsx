"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check, Copy, Share2, X } from "lucide-react";
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaTelegram,
  FaPinterestP,
  FaSlack,
} from "react-icons/fa6";

import { Button } from "@/components/ui/button";

export default function ShareBlog({ post }: { post: any }) {
  const url = encodeURIComponent(post.canonical);
  const text = encodeURIComponent(`Check out this article: ${post.title}`);
  let [shortUrl, setShortUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/shareBlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: post.canonical }),
    })
      .then((res: any) => res.json())
      .then(({ url }) => setShortUrl(url));
  }, []);

  const share = () => {
    const data = {
      title: post.title,
      text: post.excerpt,
      url: shortUrl,
    };

    if (navigator.canShare && navigator.canShare(data)) {
      navigator.share(data);
    } else {
      setShowModal(true);
    }
  };

  const copyLink = () => {
    const linkToCopy = shortUrl || post.canonical;

    // Try modern clipboard API first
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(linkToCopy).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setShowModal(false);
        }, 1500);
      });
    } else {
      // Fallback with execCommand
      const tempInput = document.createElement("input");

      tempInput.value = linkToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowModal(false);
      }, 1500);
    }
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;

    window.open(twitterUrl, "_blank");
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${text}`;

    window.open(facebookUrl, "_blank");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}&summary=${text}`;

    window.open(linkedInUrl, "_blank");
  };

  const shareOnTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${url}&text=${text}`;

    window.open(telegramUrl, "_blank");
  };

  const shareOnPinterest = () => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;

    window.open(pinterestUrl, "_blank");
  };

  const shareOnSlack = () => {
    const slackUrl = `https://slack.com/share?text=${text}&url=${url}`;

    window.open(slackUrl, "_blank");
  };

  return (
    <>
      <div className="flex max-sm:flex-col items-center justify-between">
        <div className="flex items-center gap-1">
          <p className="text-slate-400 w-max">Share this article</p>
          <span className="hidden p-2 text-slate-400">
            <Bookmark className="w-5 h-5" />
          </span>
          <Button
            className="p-2 text-slate-400"
            role="button"
            tabIndex={0}
            variant="ghost"
            onPress={share}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-0 sm:gap-1">
          <Button
            className="p-2 text-slate-400"
            role="button"
            tabIndex={0}
            variant="ghost"
            onPress={shareOnTwitter}
          >
            <FaXTwitter className="w-5 h-5" />
          </Button>
          <Button
            className="p-2 text-slate-400"
            role="button"
            tabIndex={0}
            variant="ghost"
            onPress={shareOnFacebook}
          >
            <FaFacebookF className="w-5 h-5" />
          </Button>
          <Button
            className="p-2 text-slate-400"
            role="button"
            tabIndex={0}
            variant="ghost"
            onPress={shareOnLinkedIn}
          >
            <FaLinkedinIn className="w-5 h-5" />
          </Button>
          <Button
            className="p-2 text-slate-400"
            role="button"
            tabIndex={0}
            variant="ghost"
            onPress={shareOnTelegram}
          >
            <FaTelegram className="w-5 h-5" />
          </Button>
          <Button
            className="hidden p-2 text-slate-400"
            role="button"
            tabIndex={0}
            variant="ghost"
            onPress={shareOnPinterest}
          >
            <FaPinterestP className="w-5 h-5" />
          </Button>
          <Button
            className="hidden p-2 text-slate-400"
            role="button"
            tabIndex={0}
            variant="ghost"
            onPress={shareOnSlack}
          >
            <FaSlack className="w-5 h-5" />
          </Button>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 backdrop-blur-sm"
            role="presentation"
            onClick={() => setShowModal(false)}
            onKeyDown={(e) => e.key === "Escape" && setShowModal(false)}
          >
            <div
              aria-labelledby="share-dialog-title"
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm w-full"
              role="presentation"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-slate-200 text-lg font-medium"
                  id="share-dialog-title"
                >
                  Share this article
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => setShowModal(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              <Button
                className="w-full flex items-center justify-center gap-2"
                variant="primary"
                onPress={copyLink}
              >
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
