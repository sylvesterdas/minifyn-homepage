import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { User } from "firebase/auth";

import { checkLimits, getRemainingLimits } from "@/lib/rate-limits";
import { validateURL } from "@/lib/url-validator";
import { initAdmin } from "@/app/firebase/admin";
import { createShortUrl, generateId } from "@/lib/shorten";

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown";

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const urlValidation = await validateURL(url);

    if (!urlValidation.isValid) {
      return NextResponse.json({ error: urlValidation.error }, { status: 400 });
    }

    initAdmin();
    const decodedToken = await getAuth().verifyIdToken(token);
    const allowed = await checkLimits(
      {
        uid: decodedToken.uid,
        isAnonymous: decodedToken.provider_id === "anonymous",
      } as User,
      ip
    );

    if (!allowed) {
      const limits = await getRemainingLimits(
        {
          uid: decodedToken.uid,
          isAnonymous: decodedToken.provider_id === "anonymous",
        } as User,
        ip
      );

      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          limits,
        },
        { status: 429 }
      );
    }

    const shortCode = generateId();

    return NextResponse.json({
      message: "URL validation successful",
      data: await createShortUrl(shortCode, url, decodedToken.uid)
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
