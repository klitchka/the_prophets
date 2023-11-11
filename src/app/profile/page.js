"use client";
import React from "react";
import { useAccount } from "@starknet-react/core";

function Profile() {
  const { account } = useAccount();

  return (
    <div>
      <p>Address: {account?.address}</p>
    </div>
  );
}

export default Profile;