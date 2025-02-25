import { createHmac } from "crypto";

import {
  addBlogSlug,
  fetchBlogSitemapData,
  deleteBlogSlug,
  editBlogSlug,
  BlogSlug,
} from "@/lib/blogSlugs";

function verifySignature(req: Request, secret: string): boolean {
  const signature = req.headers.get("x-hashnode-signature");

  if (!signature) return false;

  const [timestampPart, hashPart] = signature.split(",");
  const timestamp = timestampPart.split("=")[1];
  const hash = hashPart.split("=")[1];

  const body = JSON.stringify(req.body);
  const hmac = createHmac("sha256", secret);

  hmac.update(`${timestamp}.${body}`);
  const digest = hmac.digest("hex");

  return digest === hash;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.HASHNODE_WEBHOOK_SECRET;

    if (!secret || !verifySignature(req, secret)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { eventType, post } = body.data;

    if (eventType === "post_published") {
      const blog = await fetchBlogSitemapData(post.id) as BlogSlug;

      addBlogSlug(blog);
    } else if (eventType === "post_updated") {
      const blog = await fetchBlogSitemapData(post.id) as BlogSlug;

      editBlogSlug(blog.loc, blog);
    } else if (eventType === "post_deleted") {
      deleteBlogSlug(post.id);
    }
  } catch (e: any) {
    console.error(e.message);
  } finally {
    return new Response("OK");
  }
}
