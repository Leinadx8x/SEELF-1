// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useNavigate, useHref } from "react-router-dom"; // Importar hooks
import { HeroUIProvider } from '@heroui/react';
import { AuthProvider } from "./contexts/AuthContext.tsx";
import App from "./App.tsx";
import "@/styles/globals.css";

// Componente wrapper para usar os hooks de roteamento
const AppWrapper = () => {
  const navigate = useNavigate();
  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HeroUIProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWrapper /> {/* Usar o wrapper */}
    </BrowserRouter>
  </React.StrictMode>,
);