"use client";
import { useAccount, useContractRead } from "@starknet-react/core";


function Balance() {
  const { address } = useAccount();
  const { data, isLoading, error, refetch } = useContractRead({
    address: '0x049eb2b90825f4b9f3adb01ff203b440fe560a3cb19abc196333a04dae534d03',
    functionName: 'balance_of',
    args: [address],
    watch: false
  });

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {JSON.stringify(error)}</span>;

  return (
    <div>
      <p>Balance:</p>
      <p>{data?data.toString(): 0}</p>
      <p><button onClick={refetch}>Refresh Balance</button></p>
      <hr/>
    </div>
  );
}

export default Balance;
