import { Client } from "xrpl";

let client: Client | null = null;

export async function getClient() {
  if (!client) {
    client = new Client("wss://xrplcluster.com/");
    await client.connect();
  }
  console.log("XRP Client connected:", client.isConnected());
  return client;
}

export async function getAccountInfo(address: string) {
  const client = await getClient();
  const info = await client.request({
    command: "account_info",
    account: address,
    ledger_index: "validated",
  });
  return info;
}

export function formatBalance(balance: string) {
  return Intl.NumberFormat("en-US").format(Number(balance) / 1000000);
}
