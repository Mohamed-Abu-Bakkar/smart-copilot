import { ConvexReactClient } from "convex/react";

let convex: ConvexReactClient | null = null;

export function getConvex() {
  if (!convex) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      return null;
    }
    convex = new ConvexReactClient(url);
  }
  return convex;
}

export const convexClient = getConvex();
