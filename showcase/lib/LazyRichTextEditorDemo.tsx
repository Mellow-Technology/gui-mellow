"use client";

import dynamic from "next/dynamic";

/**
 * All the demos share one route, so a client component imported directly is
 * sent to every component page. TipTap is too big for that.
 */
export default dynamic(() => import("../demos/RichTextEditor"));
