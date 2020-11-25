import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.78.0/path/mod.ts";

const pluginPath = join(
  dirname(fromFileUrl(import.meta.url)),
  "target",
  "debug",
  (Deno.build.os + "" === "windows" ? "" : "lib") +
    "svg2png".replace(/-/g, "_") +
    (Deno.build.os + "" === "windows"
      ? ".dll"
      : Deno.build.os + "" === "darwin"
      ? ".dylib"
      : ".so"),
);

// NOTE: Deno.close(pluginId) once u r done
const pluginId = Deno.openPlugin(pluginPath);
const { renderOp: renderOpId } = Deno.core.ops();

export function render(svg) {
  const input = convertStringToArrayBuffer(svg);
  const png = Deno.core.dispatch(renderOpId, input);
  if (!png) throw new Error("Failed to render svg");
  return png;
}

function convertStringToArrayBuffer(svg) {
  if (typeof svg !== "string") return svg;
  return new TextEncoder().encode(svg);
}
