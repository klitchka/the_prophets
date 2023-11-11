import { useAccount, useContractWrite } from "@starknet-react/core";
import React, { useState, useMemo } from "react";

function Transfer() {
    const { address } = useAccount();
    const [count] = useState(1);
    const [recipient, setRecipient] = useState('0x');
    const [amount, setAmount] = useState('1000000000000000000');

    const calls = useMemo(() => {
      const tx = {
        contractAddress: '0x049eb2b90825f4b9f3adb01ff203b440fe560a3cb19abc196333a04dae534d03',
        entrypoint: 'transfer',
        calldata: [recipient, amount, 0]
      };
      return Array(count).fill(tx);
    }, [address, count, recipient, amount]);

    const { write } = useContractWrite({ calls });

    return (
      <>
        <p>Transfer:</p>
        <p>
          Recipient:
          <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </p>
        <p>
          Amount (default: 1 MKT with 18 decimals):
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </p>
        <p><button onClick={() => write()}>Execute Transfer</button></p>
        <hr/>
      </>
    );
}

export default Transfer;