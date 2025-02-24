import { getDatabase } from "firebase-admin/database";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

import { initAdmin } from "@/app/firebase/admin";

export async function GET(req: Request) {
  try {
    initAdmin();
    const auth = getAuth();
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const db = getDatabase();
    const snapshot = await db.ref(`users/${decodedToken.uid}/apiKey`).get();

    return NextResponse.json({ apiKey: snapshot.val() });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    initAdmin();
    const auth = getAuth();
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const newKey = `mk_${nanoid(32)}`;
    const db = getDatabase();

    await db.ref(`users/${decodedToken.uid}/apiKey`).set(newKey);

    return NextResponse.json({ apiKey: newKey });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    initAdmin();
    const auth = getAuth();
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const db = getDatabase();

    await db.ref(`users/${decodedToken.uid}/apiKey`).remove();

    return NextResponse.json({ message: "API Key deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
