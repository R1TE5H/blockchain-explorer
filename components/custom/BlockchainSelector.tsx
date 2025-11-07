import clsx from "clsx";
import { Button } from "../ui/button";

export type Blockchain = "XRP" | "SOL" | "ETH" | "BTC";

export const BLOCKCHAIN_GRADIENTS = {
  XRP: "bg-linear-to-r from-blue-700 to-blue-900",
  SOL: "bg-linear-to-r from-teal-700 to-purple-900",
  ETH: "bg-linear-to-r from-indigo-600 to-indigo-900",
  BTC: "bg-linear-to-r from-orange-600 to-orange-800",
};

const BlockchainSelector = ({
  type,
  blockchain,
  onChange,
}: {
  type: Blockchain;
  blockchain: Blockchain;
  onChange: (blockchain: Blockchain) => void;
}) => {
  return (
    <Button
      onClick={() => onChange(blockchain)}
      className={clsx(
        "group relative overflow-hidden rounded-full px-8 py-4 text-white font-semibold",
        blockchain === type ? BLOCKCHAIN_GRADIENTS[blockchain] : "bg-slate-800"
      )}
    >
      <span className="relative z-10 text-lg">{blockchain}</span>
      <span
        className={`absolute top-0 left-0 h-full w-0 ${BLOCKCHAIN_GRADIENTS[blockchain]} transition-all duration-200 ease-in group-hover:w-full`}
      />
    </Button>
  );
};

export default BlockchainSelector;
