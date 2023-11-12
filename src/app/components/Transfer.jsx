"use client";
import { useAccount } from "@starknet-react/core";
import { useState, useMemo } from "react";

function Transfer() {
    const { account, address } = useAccount();
    const [count] = useState(1);
    const [recipient, setRecipient] = useState('0x');
    const [amount, setAmount] = useState('1000000000000000000');

    console.log("Valor de account:", account);
    console.log("Valor de address:", address);
    console.log("Valor de account.execute:", account?.execute);
  
    const calls = useMemo(() => {
        const tx = {
            contractAddress: '0x06717d457a6b46e0884f85384abb3e54921730100ff2dfcac0055782c7f1372f',
            entrypoint: 'transfer',
            calldata: [recipient, amount, 0]
        };
        return Array(count).fill(tx);
    }, [address, count, recipient, amount]);

    //const { write } = useContractWrite({ calls });
    const onTransfer = async () => {
        await account?.execute(calls);
    };

    return (
        <>
            <br></br>
            <p>Transfer:</p>
            <p>Account: {account?.toString()}</p>
            <p>
                Recipient:
                <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </p>
            <p>
                Amount (default: 1 STRK with 18 decimals):
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </p>
            <p>Funds from connected wallet: {address}</p>
            <p><button onClick={onTransfer}>Execute Transfer</button></p>
            <hr/>
        </>
    );
}

export default Transfer;