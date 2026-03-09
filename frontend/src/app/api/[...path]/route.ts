import { type NextRequest, NextResponse } from "next/server";

// Allow up to 2 minutes for long-running AI generation requests
export const maxDuration = 120;

const BACKEND = process.env.BACKEND_URL || "http://localhost:8001";

async function proxy(req: NextRequest): Promise<NextResponse> {
  const url = req.nextUrl;
  const backendUrl = `${BACKEND}${url.pathname}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  const init: RequestInit = {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    // @ts-expect-error — Node fetch duplex required for streaming body
    duplex: "half",
  };

  const res = await fetch(backendUrl, init);
  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
