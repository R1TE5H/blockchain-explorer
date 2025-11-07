import { AccountTxResponse, Client, AccountTxRequest } from "xrpl";

// Useful Documentation for Client: https://xrpl.org/docs/tutorials/javascript/build-apps/get-started?environment=Node
// Useful Documentation for Accounts: https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods

// ============================ XRP CLIENT MANAGEMENT ============================

let client: Client | null = null;
let connectionPromise: Promise<Client> | null = null;

export async function getClient() {
  if (!client) {
    if (!connectionPromise) {
      connectionPromise = (async () => {
        const newClient = new Client("wss://xrplcluster.com/");
        await newClient.connect();
        console.log("XRP Client Created and Connected");
        client = newClient;
        connectionPromise = null;
        return newClient;
      })();
    }
    return await connectionPromise;
  }

  if (!client.isConnected()) {
    console.log("Client disconnected, reconnecting...");
    await client.connect();
  }

  console.log("XRP Client connected:", client.isConnected());
  return client;
}

export async function disconnectClient() {
  if (client && client.isConnected()) {
    try {
      await client.disconnect();
      console.log("XRP Client disconnected");
      client = null;
      connectionPromise = null;
    } catch (error) {
      console.error("Error disconnecting XRP Client:", error);
    }
  }
}

// ============================ API METHODS =============================

export async function getAccountInfo(address: string) {
  try {
    const client = await getClient();

    if (!client.isConnected()) {
      throw new Error("Client is not connected");
    }

    const info = await client.request({
      command: "account_info",
      account: address,
      ledger_index: "validated",
    });
    return info;
  } catch (error) {
    console.error("Error fetching account info:", error);

    if (error instanceof Error && error.message.includes("WebSocket")) {
      console.log("WebSocket error detected, resetting client");
      client = null;
      connectionPromise = null;
    }

    return null;
  }
}

export async function getTransactionHistory(
  address: string,
  marker?: number,
  limit?: number
): Promise<AccountTxResponse | null> {
  try {
    const client = await getClient();

    if (!client.isConnected()) {
      throw new Error("Client is not connected");
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
    if (limit) {
      requestParams.limit = limit;
    }
    const transactions = (await client.request(
      requestParams
    )) as AccountTxResponse;
    return transactions;
  } catch (error) {
    console.error("Error fetching transaction history:", error);

    if (error instanceof Error && error.message.includes("WebSocket")) {
      console.log("WebSocket error detected, resetting client");
      client = null;
      connectionPromise = null;
    }

    return null;
  }
}

// Any Balance in Escrow is XRP and is stored in Drops (must be divided by 1000000 to get the actual value)
export async function getAccountObjects(address: string) {
  try {
    const client = await getClient();

    if (!client.isConnected()) {
      throw new Error("Client is not connected");
    }

    const info = await client.request({
      command: "account_objects",
      account: address,
      ledger_index: "validated",
    });
    return info;
  } catch (error) {
    console.error("Error fetching account objects:", error);

    if (error instanceof Error && error.message.includes("WebSocket")) {
      console.log("WebSocket error detected, resetting client");
      client = null;
      connectionPromise = null;
    }

    return null;
  }
}

// ============================= HELPER METHODS =============================

export function formatBalance(balance: string) {
  return Intl.NumberFormat("en-US").format(Number(balance) / 1000000);
}
