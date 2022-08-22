import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'

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
  const { socket } = useSelector(state => state.game)
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    // @todo: fix duplicate keys
    socket.on(`paymentRecieved`, (id: string) => {
      console.log({ id })
      if (id !== opponent?.transactionId) {
        setTransactions((prevState) => {
          console.warn({
            ...prevState,
            myTransaction: true,
          })
          return {
            ...prevState,
            myTransaction: true,
          }
        })
      }

      if (id === opponent?.transactionId) {
        setTransactions((prevState) => {
          console.warn({
            ...prevState,
            opponentTransaction: true,
          })

          return {
            ...prevState,
            opponentTransaction: true,
          }
        })
      }
    });
  }, [])
  useEffect(() => {
    socket.on(`startGame`, (game: IStartGame) => {
      if (game.startGame) {
        console.warn(`start game!`);
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
        lamports: Number(amount) * 1000000000,
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
      console.log({ txid, isPaid: true, opponent })
      socket.emit('updatePayment', txid, true, opponent?.transactionId, opponent?.roomId);
      console.log('payment updated successfully')
    } catch (err) {
      console.log(`Unable to confirm transaction: ${err}`)
    }
  }, [publicKey, sendTransaction, connection, opponent])

  const transferSOLToWinner = useCallback(async (amount: number) => {
    if (!publicKey) {
      throw new WalletNotConnectedError()
    }
    let pubkey = new PublicKey(publicKey)
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey("7JnSaY4vLdxtS6BzpZkpoYVphxbWQTW2a59r4TxSPScq"),
        toPubkey: publicKey,
        lamports: Number(amount) * 1000000000,
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
      console.log({ txid, isPaid: true, opponent })
      socket.emit('updatePayment', txid, true, opponent?.transactionId, opponent?.roomId);
      console.log('payment updated successfully')
    } catch (err) {
      console.log(`Unable to confirm transaction: ${err}`)
    }
  }, [publicKey, sendTransaction, connection, opponent])
  return (
    <div className="top-[50%] h-[300px] w-[500px] bg-primaryBlack shadow-lg rounded-2xl flex-col  items-center">
      <div className="flex flex-col w-full justify-center items-center h-full">
        {
          transactions.opponentTransaction === false && (
            <div className="mb-4 text-center bg-primary px-2 text-black">Waithing for opponent to do the transaction!</div>
          )
        }
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
              <button onClick={makePayment} className="bg-primary text-black py-2 px-6 rounded-full font-bold">Pay {amount}: SQL</button>
            ) : <div>Searching for the opponent!</div>
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
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  //@ts-ignore
  const { walletAddress, socket, betAmount, level } = useSelector((state) => state.game);
  console.log({ walletAddress, socket, betAmount, level });
  const availableForMatch = useRef(false);
  const gotOpponent = useRef(false);
  //@ts-ignore
  const score = useSelector((state) => state.game.score);
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
        console.log({ data, roomId });
        id = roomId;
        setOpponent({ ...data, roomId, transactionId });
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
