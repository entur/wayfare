import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { type PropsWithChildren, useEffect, useState } from "react";
import { AppState, type AppStateStatus, Platform } from "react-native";

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") focusManager.setFocused(status === "active");
}

export function WayfareQueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            retry: (attempt, error) =>
              attempt < 2 &&
              !(error instanceof Error && error.name === "ApiError"),
          },
          mutations: { retry: false },
        },
      }),
  );

  useEffect(() => {
    const appState = AppState.addEventListener("change", onAppStateChange);
    const connectivity = NetInfo.addEventListener((state) => {
      onlineManager.setOnline(Boolean(state.isConnected));
    });
    return () => {
      appState.remove();
      connectivity();
    };
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
