import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Fora do Claude não existe "window.storage" pronto — aqui simulamos a
// mesma API usando localStorage do navegador, pra não precisar reescrever
// o App.jsx. Importante: isso guarda os dados só no navegador de cada
// visitante, não num banco de dados compartilhado. Ou seja, o catálogo que
// você edita no seu computador não aparece automaticamente pra quem acessa
// de outro computador. Para um catálogo realmente compartilhado entre
// todos os visitantes, é preciso um backend/banco de dados de verdade.
function storageKey(key, shared) {
  return "inetris:" + (shared ? "shared:" : "local:") + key;
}

window.storage = {
  async get(key, shared = false) {
    try {
      const raw = localStorage.getItem(storageKey(key, shared));
      if (raw === null) return null;
      return { key, value: raw, shared: !!shared };
    } catch (e) {
      return null;
    }
  },
  async set(key, value, shared = false) {
    try {
      localStorage.setItem(storageKey(key, shared), value);
      return { key, value, shared: !!shared };
    } catch (e) {
      return null;
    }
  },
  async delete(key, shared = false) {
    try {
      localStorage.removeItem(storageKey(key, shared));
      return { key, deleted: true, shared: !!shared };
    } catch (e) {
      return null;
    }
  },
  async list(prefix = "", shared = false) {
    try {
      const base = "inetris:" + (shared ? "shared:" : "local:");
      const full = base + prefix;
      const keys = Object.keys(localStorage)
        .filter((k) => k.startsWith(full))
        .map((k) => k.slice(base.length));
      return { keys, prefix, shared: !!shared };
    } catch (e) {
      return null;
    }
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
