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

export default function ShareBlog({ post }) {
  const url = encodeURIComponent(post.canonical);
  const text = encodeURIComponent(`Check out this article: ${post.title}`);
  const [shortUrl, setShortUrl] = useState("");
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
      .then((res) => res.json())
      .then(({ url }) => setShortUrl(url))
      .catch(err => console.error("Error fetching short URL:", err));
  }, [post.canonical]);

  const share = () => {
    const data = {
      title: post.title,
      text: post.excerpt,
      url: shortUrl || post.canonical,
    };

    if (navigator.canShare && navigator.canShare(data)) {
      navigator.share(data);
    } else {
      setShowModal(true);
    }
  };

  const copyLink = () => {
    const linkToCopy = shortUrl || post.canonical;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(linkToCopy).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setShowModal(false);
        }, 1500);
      });
    } else {
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

  const socialShare = (platform) => {
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}&summary=${text}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`,
      slack: `https://slack.com/share?text=${text}&url=${url}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank");
    }
  };

  const bookmarkLink = () => {
    const title = post.title;
    const bookmarkUrl = post.canonical;

    if (window.sidebar && window.sidebar.addPanel) {
      window.sidebar.addPanel(title, bookmarkUrl, "");
    } else if (window.external && ("AddFavorite" in window.external)) {
      window.external.AddFavorite(bookmarkUrl, title);
    } else if (window.opera && window.print) {
      document.title = title;
      return true;
    } else {
      alert("Press " + (navigator.userAgent.toLowerCase().indexOf("mac") !== -1 ? "Cmd" : "Ctrl") + "+D to bookmark this page.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex max-sm:flex-col items-center justify-between gap-4">
        {/* Label */}
        <h2 className="text-slate-400 font-medium" id="share-article-label">
          Share this article
        </h2>

        {/* Primary actions */}
        <div className="flex items-center gap-2">
          <Button
            className="flex items-center justify-center p-3 rounded-full hover:bg-slate-800 text-slate-200"
            variant="ghost"
            onPress={bookmarkLink}
            aria-label="Bookmark this article"
          >
            <Bookmark className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">Bookmark</span>
          </Button>

          <Button
            className="flex items-center justify-center p-3 rounded-full hover:bg-slate-800 text-slate-200"
            variant="ghost"
            onPress={share}
            aria-labelledby="share-article-label"
          >
            <Share2 className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">Share</span>
          </Button>
        </div>

        {/* Social sharing - Grid Layout */}
        <div className="grid grid-cols-3 gap-2" aria-label="Share on social media">
          <Button
            className="flex items-center justify-center p-3 rounded-full hover:bg-slate-800 text-slate-200"
            variant="ghost"
            onPress={() => socialShare('twitter')}
            aria-label="Share on Twitter"
          >
            <FaXTwitter className="w-5 h-5" aria-hidden="true" />
          </Button>

          <Button
            className="flex items-center justify-center p-3 rounded-full hover:bg-slate-800 text-slate-200"
            variant="ghost"
            onPress={() => socialShare('facebook')}
            aria-label="Share on Facebook"
          >
            <FaFacebookF className="w-5 h-5" aria-hidden="true" />
          </Button>

          <Button
            className="flex items-center justify-center p-3 rounded-full hover:bg-slate-800 text-slate-200"
            variant="ghost"
            onPress={() => socialShare('linkedin')}
            aria-label="Share on LinkedIn"
          >
            <FaLinkedinIn className="w-5 h-5" aria-hidden="true" />
          </Button>

          <Button
            className="flex items-center justify-center p-3 rounded-full hover:bg-slate-800 text-slate-200"
            variant="ghost"
            onPress={() => socialShare('telegram')}
            aria-label="Share on Telegram"
          >
            <FaTelegram className="w-5 h-5" aria-hidden="true" />
          </Button>

          <Button
            className="flex items-center justify-center p-3 rounded-full hover:bg-slate-800 text-slate-200"
            variant="ghost"
            onPress={() => socialShare('pinterest')}
            aria-label="Share on Pinterest"
          >
            <FaPinterestP className="w-5 h-5" aria-hidden="true" />
          </Button>

          <Button
            className="flex items-center justify-center p-3 rounded-full hover:bg-slate-800 text-slate-200"
            variant="ghost"
            onPress={() => socialShare('slack')}
            aria-label="Share on Slack"
          >
            <FaSlack className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-dialog-title"
          onClick={() => setShowModal(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
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
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <Button
              className={`w-full flex items-center justify-center gap-2 p-4 ${copied ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              variant="primary"
              onPress={copyLink}
              aria-label={copied ? "Link copied to clipboard" : "Copy link to clipboard"}
            >
              {copied ? (
                <Check className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Copy className="h-5 w-5" aria-hidden="true" />
              )}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
