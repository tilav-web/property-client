import { StrictMode, Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AppStartupShell from "./components/common/app-startup-shell.tsx";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n, { i18nReady } from "./i18n/i18n.ts";

const queryClient = new QueryClient();
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((module) => ({
        default: module.ReactQueryDevtools,
      }))
    )
  : null;

function BootApp() {
  const [isReady, setIsReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (i18n.isInitialized) return;

    let isMounted = true;

    void i18nReady
      .catch((error) => {
        console.error("Failed to initialize i18n", error);
      })
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) {
    return <AppStartupShell />;
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BootApp />
      <Toaster richColors />
      {ReactQueryDevtools ? (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      ) : null}
    </QueryClientProvider>
  </StrictMode>
);
