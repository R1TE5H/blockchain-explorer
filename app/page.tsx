"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BlockchainSelector, {
  Blockchain,
} from "@/components/custom/BlockchainSelector";
import { useXRPLAccount } from "@/hooks/useXRPLAccount";
import { TransactionHistoryTable } from "@/components/custom/TransactionsTable";
import { RefreshCcw, ScanSearch } from "lucide-react";
import { formatXRPBalance } from "@/services/xrpl-server";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";

export default function Home() {
  const [blockchain, setBlockchain] = useState<Blockchain>("XRP");
  const [currentAccount, setCurrentAccount] = useState<string>("");

  const addressInputSchema = z.object({
    address: z.string().min(1, "Address is required"),
  });

  type AddressInput = z.infer<typeof addressInputSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressInputSchema),
  });

  const onSubmit = (data: AddressInput) => {
    setCurrentAccount(data.address);
  };

  const handleBlockchainChange = (blockchain: Blockchain) => {
    console.log("Selected Blockchain:", blockchain);
    setBlockchain(blockchain);
    setCurrentAccount("");
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
  } = useXRPLAccount(currentAccount);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <ThemeToggle />
        <div className="flex flex-col w-full justify-center items-center gap-4 mb-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-5xl flex flex-row justify-center"
          >
            <Input {...register("address")} className="h-16 text-xl! px-8" />
            {errors.address && <p>{errors.address.message}</p>}
            <Button type="submit" size="icon-lg" className="w-16 h-16">
              <ScanSearch className="w-full h-full" />
            </Button>
          </form>
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
              onClick={() => {
                clearCache();
                reset();
                setCurrentAccount("");
              }}
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
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <p>Non-Escrowed Account Balance</p>
          <p className="text-4xl">
            <span className="font-bold">
              {formatXRPBalance(
                accountInfo?.result.account_data.Balance || "0"
              )}{" "}
            </span>
            XRP
          </p>
        </div>

        <div className="w-7xl">
          <TransactionHistoryTable
            data={transactions?.result.transactions}
            account={currentAccount}
          />
        </div>
      </main>
    </div>
  );
}
