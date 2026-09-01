import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" faz os caminhos dos arquivos serem relativos, o que evita
// o erro 404 mais comum no GitHub Pages (quando o site fica num
// subcaminho como seuusuario.github.io/inetris-site/)
export default defineConfig({
  plugins: [react()],
  base: "./",
});
