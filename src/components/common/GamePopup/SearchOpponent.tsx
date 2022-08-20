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

const Card: React.FC<ICard> = ({ amount, startGameSession, opponent }) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const onClick = useCallback(async () => {
    if (!publicKey) {
      throw new WalletNotConnectedError()
    }

    let pubkey = new PublicKey(publicKey)
    console.log({ pubkey: pubkey.toString() })
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        //TODO statsic public to be replaced with client's public key
        toPubkey: new PublicKey("6VaBX6vcw6BxozX86bTrBiJQPfpF3unSejp5Z6tr9Ldz"),
        // 1 SOL = 10**9 lamport
        // TODO replace lamport vl;aue with the value to be sent for registeration
        lamports: 10000000,
      })
    )

    transaction.feePayer = pubkey

    let { blockhash } = await connection.getRecentBlockhash()
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
      await connection.confirmTransaction(txid)
      console.log(`SOL deposit successful: ${txid}`)
      //@todo - save in database
      //@todo - start the game
      startGameSession();
    } catch (err) {
      console.log(`Unable to confirm transaction: ${err}`)
    }
  }, [publicKey, sendTransaction, connection])
  return (
    <div className="top-[50%] h-[300px] w-[500px] bg-primaryBlack shadow-lg rounded-2xl flex-col  items-center">
      <div className="flex flex-col w-full justify-center items-center h-full">
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
              <button onClick={onClick} className="bg-primary text-black py-2 px-6 rounded-full font-bold">Pay {amount}: SOL</button>
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
      socket.on("gotOpponent", (data: SocketData, roomId: string) => {
        console.log({ data, roomId });
        setOpponent({ ...data, roomId });
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
