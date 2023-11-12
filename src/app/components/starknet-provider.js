"use client";
import { StarknetConfig, publicProvider } from "@starknet-react/core";
import { goerli } from "@starknet-react/chains";
import { connectors } from "./connectors.js";
import Transfer from "./Transfer.jsx";

export const StarknetProvider = ({ children }) => {
  const chains = [goerli];
  const provider = publicProvider();

  return (
    <StarknetConfig chains={chains} connectors={connectors} provider={provider}>
      {children}
    </StarknetConfig>
  );
};