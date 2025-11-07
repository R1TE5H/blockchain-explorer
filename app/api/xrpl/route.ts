import { NextRequest, NextResponse } from "next/server";
import {
  getServerAccountInfo,
  getServerTransactionHistory,
  getServerAccountObjects,
} from "@/services/xrpl-server";
import {
  AccountInfoResponse,
  AccountTxResponse,
  AccountObjectsResponse,
} from "xrpl";

export interface XRPLApiResponse {
  address: string;
  accountInfo: AccountInfoResponse | null;
  transactions: AccountTxResponse | null;
  accountObjects: AccountObjectsResponse | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const address = searchParams.get("address");
    const limit = parseInt(searchParams.get("limit") || "10");
    const marker = searchParams.get("marker")
      ? parseInt(searchParams.get("marker")!)
      : undefined;

    if (!address) {
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 }
      );
    }

    // Fetch all data in parallel
    const [accountInfo, transactions, accountObjects] =
      await Promise.allSettled([
        getServerAccountInfo(address),
        getServerTransactionHistory(address, marker, limit),
        getServerAccountObjects(address),
      ]);

    const response: XRPLApiResponse = {
      address,
      accountInfo:
        accountInfo.status === "fulfilled" ? accountInfo.value : null,
      transactions:
        transactions.status === "fulfilled" ? transactions.value : null,
      accountObjects:
        accountObjects.status === "fulfilled" ? accountObjects.value : null,
    };

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, max-age=30" },
    });
  } catch (error) {
    console.error("XRPL API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch XRPL data" },
      { status: 500 }
    );
  }
}
