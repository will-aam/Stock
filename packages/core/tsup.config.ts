import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Onde começa seu código
  format: ["cjs", "esm"], // Gera CommonJS (Node antigo) e ESM (Moderno)
  dts: true, // Gera os arquivos de tipos (.d.ts) automaticamente
  clean: true, // Limpa a pasta dist antes de buildar
  sourcemap: true, // Ajuda no debug
  minify: false, // Deixa legível (pode mudar pra true em produção)
});
