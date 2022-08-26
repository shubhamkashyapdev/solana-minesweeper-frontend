import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair, sendAndConfirmTransaction } from '@solana/web3.js'
import { setOpponentDetails } from "../../../redux/Game/GameAction";
import { showNotification } from "@mantine/notifications";

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
      showNotification({
        title: 'Payment Successfull',
        message: 'Game is started',
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.dark[9],
            borderColor: theme.colors.gary[2]
          },
          title: { color: theme.colors.gray[6] },
          description: { color: theme.colors.gray[5] }
        })
      })

    } catch (err) {
      showNotification({
        title: 'Payment Failed :x:',
        message: ' Unable to start game! Please try again!',
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.dark[9],
            borderColor: theme.colors.gray[6]
          },
          title: { color: theme.white },
          description: { color: theme.colors.gray[5] }
        })
      })
      console.log(`Unable to confirm transaction: ${err}`)
    }
  }, [publicKey, sendTransaction, connection, opponent])

  // winner will get the bet amount and if the game is ended on a draw then both player will get the entree fee back to their wallet - this transaction will be trigger using the --@solana/web3.js-- library



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
            ) : <div>Searching for opponent!</div>
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
