import { ColumnDef } from "@tanstack/react-table";
import { AccountTxTransaction } from "xrpl";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { formatXRPBalance } from "@/services/xrpl-server";

export default function getXRPLTransactionsTableColumns(
  currentAccount?: string
): ColumnDef<AccountTxTransaction<2>>[] {
  function rippleTimeToDate(rippleTime: number): Date {
    const rippleEpoch = new Date("2000-01-01T00:00:00Z").getTime(); // Ripple epoch in ms
    const timestampMs = rippleEpoch + rippleTime * 1000; // Add ripple seconds converted to ms
    return new Date(timestampMs); // Create date from ms timestamp
  }

  return [
    {
      id: "hash",
      accessorFn: (row) => row.hash,
      header: "Hash",
      cell: (info) => (
        <Tooltip>
          <TooltipTrigger>
            <span className=" cursor-pointer">
              {(info.getValue() as string).slice(0, 10) + "..."}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{info.getValue() as string}</p>
          </TooltipContent>
        </Tooltip>
      ),

      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: "amount",
      accessorFn: (row) =>
        typeof row.meta === "object" ? row.meta?.delivered_amount : undefined,
      header: "Amount",
      cell: (info) => formatXRPBalance(info.getValue() as string),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: "type",
      accessorFn: (row) => row.tx_json?.Destination,
      header: "Type",
      cell: (info) => {
        const des = info.getValue();
        if (des == currentAccount) {
          return (
            <Badge variant="default" className="bg-green-600">
              Received
            </Badge>
          );
        } else {
          return <Badge variant="destructive">Sent</Badge>;
        }
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: "otherParty",
      accessorFn: (row) => row.tx_json?.Destination || row.tx_json?.Account,
      header: "Other Party",
      cell: (info) => {
        const otherParty =
          info.getValue() == currentAccount
            ? info.row.original.tx_json?.Account
            : info.row.original.tx_json?.Destination;

        return (
          <Tooltip>
            <TooltipTrigger>
              <span className=" cursor-pointer">
                {(otherParty as string).slice(0, 10) + "..."}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{otherParty as string}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: "date",
      accessorFn: (row) => row.tx_json?.date,
      header: "Date",
      cell: (info) =>
        rippleTimeToDate(info.getValue() as number).toLocaleString(),
      enableSorting: true,
      enableColumnFilter: true,
    },
  ];
}
