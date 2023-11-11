import React from "react";
import { useAccount, useContractRead } from "@starknet-react/core";

function Profile() {
  const { address } = useAccount();
  const { data: balance, isLoading, error, refetch } = useContractRead({
    address: '0x049eb2b90825f4b9f3adb01ff203b440fe560a3cb19abc196333a04dae534d03',
    functionName: 'balance_of',
    args: [address],
    watch: false
  });

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {JSON.stringify(error)}</span>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Address: {address}</p>
      <p>Balance: {balance ? balance.toString() : 0}</p>
      <button onClick={refetch}>Refresh Balance</button>
    </div>
  );
}

export default Profile;