import {
  AccountTxResponse,
  Client,
  AccountTxRequest,
  AccountInfoResponse,
  AccountObjectsResponse,
} from "xrpl";

let client: Client | null = null;
let connectionPromise: Promise<Client> | null = null;

export async function getServerClient() {
  if (!client) {
    if (!connectionPromise) {
      connectionPromise = (async () => {
        const newClient = new Client("wss://xrplcluster.com/");

        newClient.on("connected", () => {
          console.log("XRPL Server Client connected successfully");
        });

        newClient.on("disconnected", () => {
          console.log("XRPL Server Client disconnected");
          client = null;
          connectionPromise = null;
        });

        newClient.on("error", (error) => {
          console.error("XRPL Server Client error:", error);
          client = null;
          connectionPromise = null;
        });

        await newClient.connect();
        client = newClient;
        connectionPromise = null;
        return newClient;
      })();
    }
    return await connectionPromise;
  }

  if (!client.isConnected()) {
    console.log("Server client disconnected, reconnecting...");
    try {
      await client.connect();
    } catch (error) {
      console.error("Failed to reconnect server client:", error);
      // Reset and try fresh connection
      client = null;
      connectionPromise = null;
      return await getServerClient();
    }
  }

  return client;
}

export async function getServerAccountInfo(
  address: string
): Promise<AccountInfoResponse> {
  try {
    const client = await getServerClient();

    if (!client.isConnected()) {
      throw new Error("Server client is not connected");
    }

    const info = await client.request({
      command: "account_info",
      account: address,
      ledger_index: "validated",
    });
    return info as AccountInfoResponse;
  } catch (error) {
    console.error("Error fetching account info on server:", error);

    if (error instanceof Error && error.message.includes("WebSocket")) {
      console.log("WebSocket error detected, resetting server client");
      client = null;
      connectionPromise = null;
    }

    throw error;
  }
}

export async function getServerTransactionHistory(
  address: string,
  marker?: number,
  limit: number = 10
): Promise<AccountTxResponse> {
  try {
    const client = await getServerClient();

    if (!client.isConnected()) {
      throw new Error("Server client is not connected");
    }

    const requestParams: AccountTxRequest = {
      command: "account_tx",
      account: address,
      ledger_index_min: -1,
      ledger_index_max: -1,
      limit,
      forward: false,
    };

    if (marker) {
      requestParams.marker = marker;
    }

    const transactions = (await client.request(
      requestParams
    )) as AccountTxResponse;
    return transactions;
  } catch (error) {
    console.error("Error fetching transaction history on server:", error);

    if (error instanceof Error && error.message.includes("WebSocket")) {
      console.log("WebSocket error detected, resetting server client");
      client = null;
      connectionPromise = null;
    }

    throw error;
  }
}

export async function getServerAccountObjects(
  address: string
): Promise<AccountObjectsResponse> {
  try {
    console.log("getServerAccountObjects called with address:", address);
    const client = await getServerClient();

    if (!client.isConnected()) {
      throw new Error("Server client is not connected");
    }

    console.log("Making account_objects request to XRPL");
    const info = await client.request({
      command: "account_objects",
      account: address,
      ledger_index: "validated",
    });
    console.log("Successfully received account_objects response");
    return info as AccountObjectsResponse;
  } catch (error) {
    console.error("Error fetching account objects on server:", error);

    if (error instanceof Error && error.message.includes("WebSocket")) {
      console.log("WebSocket error detected, resetting server client");
      client = null;
      connectionPromise = null;
    }

    throw error;
  }
}

export async function disconnectServerClient() {
  if (client && client.isConnected()) {
    try {
      await client.disconnect();
      console.log("XRPL Server Client disconnected");
      client = null;
      connectionPromise = null;
    } catch (error) {
      console.error("Error disconnecting XRPL Server Client:", error);
    }
  }
}

export function formatXRPBalance(balance: string) {
  return Intl.NumberFormat("en-US").format(Number(balance) / 1000000);
}
