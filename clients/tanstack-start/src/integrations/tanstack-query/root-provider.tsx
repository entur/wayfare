import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: (failureCount, error) => {
					const match = (error as Error).message?.match(/\((\d{3})\)/);
					if (match) {
						const status = parseInt(match[1], 10);
						if (status >= 400 && status < 500) return false;
					}
					return failureCount < 3;
				},
			},
		},
	});
}

export default function TanStackQueryProvider({
	children,
	queryClient,
}: {
	children: ReactNode;
	queryClient: QueryClient;
}) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
