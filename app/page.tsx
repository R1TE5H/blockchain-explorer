"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAccountInfo } from "@/hooks/useAccountInfo";
import { useAccountObject } from "@/hooks/useAccountObject";
import { Button } from "@/components/ui/button";

export default function Home() {
  const TEST_ACCOUNT = "rB3WNZc45gxzW31zxfXdkx8HusAhoqscPn";

  const {
    data: accountInfoData,
    isLoading: accountInfoLoading,
    isError: accountInfoError,
    refetch: accountInfoRefetch,
  } = useAccountInfo(TEST_ACCOUNT);

  const {
    data: accountObjectData,
    isLoading: accountObjectLoading,
    isError: accountObjectError,
    refetch: accountObjectRefetch,
  } = useAccountObject(TEST_ACCOUNT);

  console.log("Account Info Data:", accountInfoData);
  console.log("Account Object Data:", accountObjectData);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-row items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <ThemeToggle />

        <Button onClick={() => accountInfoRefetch()}>
          Refetch Account Info
        </Button>
        <Button onClick={() => accountObjectRefetch()}>
          Refetch Object Info
        </Button>
      </main>
    </div>
  );
}
