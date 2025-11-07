"use client";
"use no memo";

import * as React from "react";

import { AccountTxTransaction } from "xrpl";
import getXRPLTransactionsTableColumns from "./transactions-table/xrpl-transaction-columns";
import { formatXRPBalance } from "@/services/xrpl-server";
import { DataTable } from "../ui/data-table";

export function TransactionHistoryTable({
  data,
  account,
}: {
  data: AccountTxTransaction<2>[] | undefined;
  account: string;
}) {
  const filteredData = React.useMemo(() => {
    if (!data) return [];

    return data.filter((tx) => {
      const deliveredAmount =
        typeof tx.meta === "object" ? tx.meta?.delivered_amount : undefined;
      const amount = formatXRPBalance(
        typeof deliveredAmount === "string" ? deliveredAmount : "0"
      );
      return amount !== "0";
    });
  }, [data]);

  return (
    <DataTable
      data={filteredData || []}
      columns={getXRPLTransactionsTableColumns(account)}
    />
  );
}
