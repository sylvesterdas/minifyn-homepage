import { NextResponse } from "next/server";

import { authenticate } from "./auth-middleware";

import { checkLimits, getRemainingLimits } from "@/lib/rate-limits";
import { validateURL } from "@/lib/url-validator";
import { initAdmin } from "@/app/firebase/admin";
import { createShortUrl, generateId } from "@/lib/shorten";

export async function POST(req) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    "unknown";

  try {
    initAdmin();
    const user = await authenticate(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const urlValidation = await validateURL(url);

    if (!urlValidation.isValid) {
      return NextResponse.json({ error: urlValidation.error }, { status: 400 });
    }

    const allowed = await checkLimits(user, ip);

    if (!allowed) {
      const limits = await getRemainingLimits(user, ip);

      return NextResponse.json(
        { error: "Rate limit exceeded", limits },
        { status: 429 }
      );
    }

    const shortCode = generateId();

    await createShortUrl(shortCode, url, user.uid);

    return NextResponse.json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      remaining: await getRemainingLimits(user, ip),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error: " + error.message },
      { status: error.code ? (error.code < 500 ? error.code : 500) : 500 }
    );
  }
}
