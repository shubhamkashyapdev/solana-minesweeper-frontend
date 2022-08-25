import { useCallback, useEffect, useState } from 'react'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base"
import { useDispatch, useSelector } from 'react-redux'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair, sendAndConfirmTransaction } from '@solana/web3.js'
interface Opponent {
    amount: number;
    level: number;
    socketId: string;
    userId: string;
    _id: string;
    _v?: number;
    roomId: string;
    transactionId: string;
}

const GameWinner = () => {
    //@ts-ignore
    const { } = useSelector(state => state.game)
    let ran = false;

    const [winnerArr, setWinnerArr] = useState<string[]>([])
    //@ts-ignore
    const { socket, opponent, betAmount } = useSelector(state => state.game)
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const dispatch = useDispatch();
    const transferSOLToPlayer = useCallback(async (amount: number, key: PublicKey) => {
        const secret_key = Uint8Array.from([90, 143, 136, 13, 217, 246, 237, 97, 10, 238, 184, 54, 35, 18, 194, 249, 6, 249, 105, 59, 104, 123, 73, 61, 103, 192, 148, 227, 231, 253, 19, 80, 26, 3, 63, 102, 28, 109, 25, 31, 154, 128, 141, 3, 4, 150, 68, 236, 123, 127, 219, 48, 2, 167, 77, 3, 57, 153, 53, 127, 240, 198, 34, 195]);
        const keypair = Keypair.fromSecretKey(secret_key)

        if (!publicKey) {
            throw new WalletNotConnectedError()
        }

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: key,
                lamports: Number(amount) * LAMPORTS_PER_SOL,
            })
        )
        transaction.feePayer = keypair.publicKey
        let { blockhash } = await connection.getLatestBlockhash()
        transaction.recentBlockhash = blockhash
        try {
            const txid = await sendAndConfirmTransaction(
                connection,
                transaction,
                [keypair]
            );

            console.log(`SOL deposit successful: ${txid}`)
            // it accept three args: signature, isPaid, transactionId,roomId
            socket.emit('updatePayment', txid, true, opponent?.transactionId, opponent?.roomId);
            console.log('payment updated successfully')
        } catch (err) {
            console.log(`Unable to confirm transaction: ${err}`)
        }
    }, [publicKey, sendTransaction, connection, opponent])


    useEffect(() => {
        console.log({ winnerArr })
        if (winnerArr.length == 1) {
            if (winnerArr[0]) {
                transferSOLToPlayer(Number(betAmount) * 2, new PublicKey(winnerArr[0]))
            }
        }
        if (winnerArr.length == 2) {
            winnerArr.map(item => {
                if (item) {
                    transferSOLToPlayer(betAmount, new PublicKey(item[0]))
                }
            });
        }
    }, [winnerArr])

    const handleWinnerArr = useCallback((walletAddress: string[]) => {
        setWinnerArr(walletAddress)
    }, [winnerArr])

    useEffect(() => {
        if (socket) {
            socket.on('winner', (walletAddress: string[]) => {
                if (!ran && winnerArr.join() !== walletAddress.join()) {
                    ran = true
                    handleWinnerArr(walletAddress)
                }
            })
        }
    }, [socket])
    return null
}
export default GameWinner