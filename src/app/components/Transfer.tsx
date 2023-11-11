//import { useContractWrite } from "@starknet-react/core";
import React, { useState, useMemo } from "react";
import { useAccount } from "@starknet-react/core";
require('dotenv').config();



function Transfer() {
    const  { account, address } = useAccount();
    const [count] = useState(1);
    const [recipient, setRecipient] = useState('0x');
    const [amount, setAmount] = useState('10');

    

    const calls = useMemo(() => {
      const tx = {
        contractAddress: "0x03f05e110e360f6e26f423dd7632863e2aa7cd0ae4aadef31a7f92a2d4c2f350",
        entrypoint: 'transfer',
        calldata: ["0x049eb2b90825f4b9f3adb01ff203b440fe560a3cb19abc196333a04dae534d03", 1000]
      };
      return tx
    }, [address, count, recipient, amount]);

    // const { write } = useContractWrite({ calls })

    const onTransfer = async () => {

      await account?.execute(calls)
    }

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
        <p><button onClick={onTransfer}>Execute Transfer</button></p>
        <hr/>
      </>
    );
}

export default Transfer;