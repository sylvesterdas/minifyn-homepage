"use client";

import { useEffect, useState } from "react";
import { Bookmark, Share2 } from "lucide-react";
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
    navigator.share({
      title: post.title,
      text: post.excerpt,
      url: shortUrl,
    });
  }

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
      </div>
    </>
  );
}
