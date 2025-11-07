import { XRPLApiResponse } from "@/app/api/xrpl/route";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  AccountInfoResponse,
  AccountTxResponse,
  AccountObjectsResponse,
} from "xrpl";

async function fetchXRPLData(
  address: string,
  limit: number,
  marker?: number
): Promise<XRPLApiResponse> {
  const params = new URLSearchParams({
    address,
  });

  if (limit) {
    params.append("limit", limit.toString());
  }

  if (marker) {
    params.append("marker", marker.toString());
  }

  const response = await fetch(`/api/xrpl?${params}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function useXRPLAccount(
  account: string,
  limit: number = 10,
  marker?: number
) {
  const queryClient = useQueryClient();
  const [isCleared, setIsCleared] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["xrpl-account", account, limit, marker],
    queryFn: () => fetchXRPLData(account, limit, marker),
    enabled: !!account && !isCleared, // Disable when cleared
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const clearCache = () => {
    // Cancel any ongoing requests
    queryClient.cancelQueries({ queryKey: ["xrpl-account", account] });
    // Remove from cache
    queryClient.removeQueries({ queryKey: ["xrpl-account", account] });
    // Set cleared state to hide data from UI
    setIsCleared(true);
  };

  const refetchData = async () => {
    setIsCleared(false); // Re-enable queries
    return await refetch(); // Manually trigger refetch
  };

  return {
    accountInfo: (isCleared
      ? null
      : data?.accountInfo || null) as AccountInfoResponse | null,
    transactions: (isCleared
      ? null
      : data?.transactions || null) as AccountTxResponse | null,
    accountObjects: (isCleared
      ? null
      : data?.accountObjects || null) as AccountObjectsResponse | null,
    isLoading: !isCleared && isLoading,
    isError: !isCleared && isError,
    error: !isCleared ? error : null,
    isCleared,
    refetch: refetchData,
    clearCache,
  };
}
