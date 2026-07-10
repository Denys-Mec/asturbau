import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Range, Content-Type",
  "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
};

export const Route = createFileRoute("/api/public/gallery/$path")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ params, request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const path = decodeURIComponent(params.path);
        const { data, error } = await supabaseAdmin.storage.from("gallery").download(path);
        if (error || !data) return new Response("Not found", { status: 404, headers: CORS });
        const buf = await data.arrayBuffer();
        const total = buf.byteLength;
        const contentType = data.type || "application/octet-stream";

        const range = request.headers.get("range");
        const baseHeaders: Record<string, string> = {
          ...CORS,
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Accept-Ranges": "bytes",
        };

        if (range) {
          const m = /bytes=(\d*)-(\d*)/.exec(range);
          if (m) {
            const start = m[1] ? parseInt(m[1], 10) : 0;
            const end = m[2] ? parseInt(m[2], 10) : total - 1;
            if (isNaN(start) || isNaN(end) || start > end || end >= total) {
              return new Response("Range Not Satisfiable", {
                status: 416,
                headers: { ...baseHeaders, "Content-Range": `bytes */${total}` },
              });
            }
            const slice = buf.slice(start, end + 1);
            return new Response(slice, {
              status: 206,
              headers: {
                ...baseHeaders,
                "Content-Range": `bytes ${start}-${end}/${total}`,
                "Content-Length": String(end - start + 1),
              },
            });
          }
        }

        return new Response(buf, {
          headers: { ...baseHeaders, "Content-Length": String(total) },
        });
      },
    },
  },
});
