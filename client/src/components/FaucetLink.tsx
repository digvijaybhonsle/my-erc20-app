// client/src/components/FaucetLink.tsx
import React from "react";

const FaucetLink: React.FC = () => {
  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-600">
        Need test ETH?{" "}
        <a
          href="https://sepoliafaucet.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Get some from the Sepolia Faucet
        </a>
      </p>
    </div>
  );
};

export default FaucetLink;
