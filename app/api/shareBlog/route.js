import { NextResponse } from "next/server";

import { slugExists } from "@/lib/blog";
import { createShortUrl, generateId, getShortCodeFromUrl } from "@/lib/shorten";

export async function POST(req) {
  try {
    const body = await req.json();
    const ogUrl = new URL(body.url);

    if (!ogUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!['www.minifyn.com', 'minifyn.com'].includes(ogUrl.hostname) && !ogUrl.pathname.startsWith("/blog/")) {
      return NextResponse.json(
        { error: "Invalid URL: Only minifyn blog URLs are allowed" },
        { status: 400 }
      );
    }

    const slug = ogUrl.pathname.replace("/blog/", "");

    const regexForBlogSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!slug.match(regexForBlogSlug)) {
      return NextResponse.json(
        { error: "Invalid URL: Only minifyn blog URLs are allowed" },
        { status: 400 }
      );
    }

    if (!await slugExists(slug)) {
      return NextResponse.json(
        { error: "Invalid URL: Blog post does not exist" },
        { status: 400 }
      );
    }

    let shortCode = await getShortCodeFromUrl(ogUrl.toString());

    if (!shortCode) {
      shortCode = generateId();

      await createShortUrl(shortCode, ogUrl.toString(), process.env.SUPER_USER_ID, true);
    }

    const shortUrl = new URL(shortCode, process.env.BASE_URL);

    return NextResponse.json({ url: shortUrl.toString() });
  } catch (error) {
    const res = NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );

    return res;
  }
}
