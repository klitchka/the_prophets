"use client";
import React from "react";
import { useAccount } from "@starknet-react/core";
import Connect from "../components/Connect";

function Profile() {
  const { account } = useAccount();

  return (
    <div>
      <p>Address: {account?.address}</p>
      <Connect /> {/* Agrega el componente Connect aquí */}
    </div>
  );
}

export default Profile;