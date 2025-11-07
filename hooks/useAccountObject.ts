import { getAccountObjects } from "@/services/xrpl";
import { useQuery } from "@tanstack/react-query";

export function useAccountObject(account: string) {
  return useQuery({
    queryKey: ["accountObject", account],
    queryFn: () => getAccountObjects(account),
    enabled: !!account,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Retry up to 3 times, but not for WebSocket connection errors
      if (error instanceof Error && error.message.includes("WebSocket")) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}
