import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // CommonJS (Node) e ESM (Moderno)
  dts: true, // Gera arquivos de tipos (.d.ts)
  clean: true,
  sourcemap: true,
  minify: false, // Melhor pra debugar localmente
});
