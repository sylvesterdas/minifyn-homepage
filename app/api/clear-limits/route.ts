import { NextRequest } from "next/server";
import { getDatabase } from "firebase-admin/database";

import { initAdmin } from "@/app/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    if (req.headers.get("Authorization") !== `Bearer ${process.env.JWT_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    initAdmin();
    const db = getDatabase();

    await db.ref("limits").remove();

    return new Response("Limits cleared", { status: 200 });
  } catch {
    return new Response("Internal error", { status: 500 });
  }
}