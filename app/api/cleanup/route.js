import { NextResponse } from "next/server";

import { deleteExpiredUrls } from "@/lib/cleanup";

export async function GET() {
  Promise.all([deleteExpiredUrls()]).then(([_]) => {
    // console.log(_);
  });

  return NextResponse.json({ message: "Cleanup accepted" });
}
