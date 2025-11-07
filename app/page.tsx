"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BlockchainSelector, {
  Blockchain,
} from "@/components/custom/BlockchainSelector";
import { useXRPLAccount } from "@/hooks/useXRPLAccount";
import { DataTableDemo } from "@/components/custom/TransactionsTable";
import { RefreshCcw } from "lucide-react";

export default function Home() {
  const TEST_ACCOUNT = "rB3WNZc45gxzW31zxfXdkx8HusAhoqscPn";
  const [blockchain, setBlockchain] = useState<Blockchain>("XRP");

  const handleBlockchainChange = (blockchain: Blockchain) => {
    console.log("Selected Blockchain:", blockchain);
    setBlockchain(blockchain);
  };

  const {
    accountInfo,
    transactions,
    accountObjects,
    isError,
    isLoading,
    isCleared,
    refetch,
    clearCache,
  } = useXRPLAccount(TEST_ACCOUNT);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col min-h-screen w-full max-w-3xl items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <ThemeToggle />
        <div className="flex flex-row gap-4">
          <BlockchainSelector
            type={blockchain}
            blockchain="XRP"
            onChange={handleBlockchainChange}
          />
          <BlockchainSelector
            type={blockchain}
            blockchain="SOL"
            onChange={handleBlockchainChange}
          />
          <BlockchainSelector
            type={blockchain}
            blockchain="ETH"
            onChange={handleBlockchainChange}
          />
          <BlockchainSelector
            type={blockchain}
            blockchain="BTC"
            onChange={handleBlockchainChange}
          />
          <Button
            variant={"destructive"}
            onClick={clearCache}
            disabled={isCleared}
          >
            {isCleared ? "Data Cleared" : "Clear Data"}
          </Button>
          <Button
            variant={"default"}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : <RefreshCcw />}
          </Button>
        </div>
        <pre>
          {isCleared
            ? "Data cleared - Click 'Refetch All' to reload data"
            : accountInfo
            ? JSON.stringify(
                {
                  accountInfo,
                  transactions,
                  accountObjects,
                },
                null,
                2
              )
            : isLoading
            ? "Loading..."
            : isError
            ? "Error fetching data"
            : "No Data Available"}
        </pre>

        <DataTableDemo />
      </main>
    </div>
  );
}
