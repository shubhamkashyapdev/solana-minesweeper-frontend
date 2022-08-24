import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair, sendAndConfirmTransaction } from '@solana/web3.js'
import * as bs58 from "bs58";
import { setOpponentDetails } from "../../../redux/Game/GameAction";

interface SocketData {
  amount: number;
  level: number;
  socketId: string;
  userId: string;
  _id: string;
  _v?: number;
}

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

interface ISearchOpponent {
  hidePopup: () => void;
  startGame: () => void;
}

interface ICard {
  amount: number;
  startGameSession: () => void;
  opponent: Opponent | null
}
interface IStartGame {
  startGame: boolean;
}
interface ITransactions {
  myTransaction: boolean;
  opponentTransaction: boolean;
}

const Card: React.FC<ICard> = ({ amount, startGameSession, opponent }) => {

  const [transactions, setTransactions] = useState<ITransactions>({
    myTransaction: false,
    opponentTransaction: false,
  })
  //@ts-ignore
  const { socket, opponent: MyOpponent } = useSelector(state => state.game)
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    // @todo: fix duplicate keys
    socket.on(`paymentRecieved`, (id: any) => {
      if (id?.transactionId === opponent?.transactionId) {
        setTransactions((prevState) => {
          return {
            ...prevState,
            myTransaction: true,
          }
        })
      } else {
        setTransactions((prevState) => {
          return {
            ...prevState,
            opponentTransaction: true,
          }
        })
      }
    });
  }, [opponent])
  useEffect(() => {
    socket.on(`startGame`, (game: IStartGame) => {
      if (game.startGame) {
        //@todo - save in database
        //@todo - start the game
        startGameSession();
      }
    })
  }, [])


  const makePayment = useCallback(async () => {
    if (!publicKey) {
      throw new WalletNotConnectedError()
    }
    let pubkey = new PublicKey(publicKey)

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        //@todo - static publicKey to be replaced with program's publicKey
        toPubkey: new PublicKey("7JnSaY4vLdxtS6BzpZkpoYVphxbWQTW2a59r4TxSPScq"),
        // 1 SOL = 10**9 lamport
        lamports: Number(amount) * LAMPORTS_PER_SOL,
      })
    )

    transaction.feePayer = pubkey
    let { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    let signed = ""
    try {
      //@ts-ignore
      signed = await window.solana.signTransaction(transaction)
    } catch (err) {
      console.log(`Error in sign transaction : ${err}`)
    }

    let txid = ""
    try {
      //@ts-ignore
      txid = await connection.sendRawTransaction(signed.serialize())
    } catch (ex) {
      console.log(`Error sending transaction: ${ex}`)
    }
    try {
      // await connection.confirmTransaction(txid)
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });

      console.log(`SOL deposit successful: ${txid}`)

      // it accept three args: signature, isPaid, transactionId,roomId
      socket.emit('updatePayment', txid, true, opponent?.transactionId, opponent?.roomId);
      console.log('payment sent successfully')
    } catch (err) {
      console.log(`Unable to confirm transaction: ${err}`)
    }
  }, [publicKey, sendTransaction, connection, opponent])

  // winner will get the bet amount and if the game is ended on a draw then both player will get the entree fee back to their wallet - this transaction will be trigger using the --@solana/web3.js-- library

  const transferSOLToPlayer = useCallback(async (amount: number) => {
    const secret_key = Uint8Array.from([90, 143, 136, 13, 217, 246, 237, 97, 10, 238, 184, 54, 35, 18, 194, 249, 6, 249, 105, 59, 104, 123, 73, 61, 103, 192, 148, 227, 231, 253, 19, 80, 26, 3, 63, 102, 28, 109, 25, 31, 154, 128, 141, 3, 4, 150, 68, 236, 123, 127, 219, 48, 2, 167, 77, 3, 57, 153, 53, 127, 240, 198, 34, 195]);
    const keypair = Keypair.fromSecretKey(secret_key)

    if (!publicKey) {
      throw new WalletNotConnectedError()
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: publicKey,
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

  return (
    <div className="top-[50%] h-[300px] w-[500px] bg-primaryBlack shadow-lg rounded-2xl flex-col  items-center">
      <div className="flex flex-col w-full justify-center items-center h-full">
        {/* {
          transactions.opponentTransaction === false && (
            <div className="mb-4 text-center bg-primary px-2 text-black">Waithing for opponent to do the transaction!</div>
          )
        } */}
        <div className="flex items-center justify-between w-[80%] mx-auto">
          <div className="w-28 h-28 rounded-full shadow-lg border-4 border-white">
            <img
              className="w-full h-full object-cover overflow-hidden rounded-full"
              src="http://surl.li/csiqn"
            />
          </div>
          <div className="w-16 h-16">
            <img
              className="w-full h-full object-cover overflow-hidden"
              src="http://surl.li/csirq"
            />
          </div>

          <div className="w-28 h-28 rounded-full shadow-lg border-4 border-white">
            <img
              className="w-full h-full object-cover overflow-hidden rounded-full"
              src="http://surl.li/csiqn"
            />
          </div>
        </div>
        <div className="my-6">
          {
            opponent !== null ? (
              <button disabled={transactions?.myTransaction} onClick={makePayment} className="bg-primary text-black py-2 px-6 rounded-full font-bold disabled:cursor-not-allowed disabled:bg-border">Pay {amount}: SOL</button>
            ) : <button onClick={() => transferSOLToPlayer(0.05)} className="bg-primary text-black py-2 px-6 rounded-full font-bold disabled:cursor-not-allowed disabled:bg-border">Recieve {0.05}: SOL</button>
          }
        </div>
      </div>
    </div>
  );
};

const SearchOpponent: React.FC<ISearchOpponent> = ({
  hidePopup,
  startGame,
}) => {

  const dispatch = useDispatch();
  const [opponent, setOpponent] = useState<Opponent | null>(null);

  //@ts-ignore
  const { walletAddress, socket, betAmount, level } = useSelector((state) => state.game);
  const availableForMatch = useRef(false);
  const gotOpponent = useRef(false);
  useEffect(() => {
    if (availableForMatch.current === false) {
      socket.emit("availableForMatch", walletAddress, betAmount, level);
    }
    return () => {
      availableForMatch.current = true;
    };
  }, []);

  useEffect(() => {
    if (gotOpponent.current === false) {
      let id = null;
      socket.on("gotOpponent", (data: SocketData, roomId: string, transactionId: string) => {
        id = roomId;
        setOpponent({ ...data, roomId, transactionId });
        //@ts-ignore
        dispatch(setOpponentDetails({ ...data, roomId, transactionId }))
        socket.emit('joinCustomRoom', id);
      });
    }
    return () => {
      gotOpponent.current === false;
    };
  }, []);

  useEffect(() => {
    if (opponent?.roomId) {
      socket.emit(
        "msgToCustomRoom",
        `Room Created successfully :)`,
        opponent.roomId
      );
    }

    return () => {

    };
  }, [opponent]);

  useEffect(() => {
    socket.on("message", (message: string) => {
      console.warn({ message });
    });
    return () => {
    };
  }, []);

  const startGameSession = () => {
    //@ts-ignore
    hidePopup();
    startGame();
  }

  return (
    <div className="bg-primaryBlack/50 z-10 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <Card opponent={opponent} startGameSession={startGameSession} amount={betAmount} />
    </div>
  );
};

export default SearchOpponent;
