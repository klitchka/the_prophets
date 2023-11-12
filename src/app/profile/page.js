"use client";
import React from "react";
import { useAccount } from "@starknet-react/core";
import Connect from "../components/Connect";
import Transfer from "../components/Transfer";



function Profile() {
  const { account, address, status } = useAccount()

  return (
    <div>
      <p>Address: {status === 'disconnected'? "connect wallet" : address}</p>
    
      <Connect /> 
      <Transfer /> 
    </div>
  );
}

export default Profile;