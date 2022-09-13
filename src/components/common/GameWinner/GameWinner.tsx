import { useCallback, useEffect, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useDispatch, useSelector } from "react-redux";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { showNotification } from "@mantine/notifications";
import { gameRender } from "../../../redux/Game/GameAction";
import WinnerModal, { gameStatus } from "../modals/WinnerModal";
interface GameWinnerProps {
  handleResetInterval: () => void;
}

const GameWinner: React.FunctionComponent<GameWinnerProps> = () => {
  const {} = useSelector((state: any) => state.game);
  const ranRef = useRef(false);
  const [show, setShow] = useState<boolean>(false);
  const [winnerArr, setWinnerArr] = useState<string[]>([]);
  const [palyerStatus, setPlayerStatus] = useState<gameStatus>("tie");
  const { socket, opponent, betAmount } = useSelector(
    (state: any) => state.game
  );
  const { publicKey, sendTransaction } = useWallet();
  // const { connection } = useConnection();
  const dispatch = useDispatch();
  // const transferSOLToPlayer = useCallback(
  //   async (amount: number, key: PublicKey) => {
  //     const secret_key = Uint8Array.from([
  //       90, 143, 136, 13, 217, 246, 237, 97, 10, 238, 184, 54, 35, 18, 194, 249,
  //       6, 249, 105, 59, 104, 123, 73, 61, 103, 192, 148, 227, 231, 253, 19, 80,
  //       26, 3, 63, 102, 28, 109, 25, 31, 154, 128, 141, 3, 4, 150, 68, 236, 123,
  //       127, 219, 48, 2, 167, 77, 3, 57, 153, 53, 127, 240, 198, 34, 195,
  //     ]);
  //     const keypair = Keypair.fromSecretKey(secret_key);

  //     if (!publicKey) {
  //       throw new WalletNotConnectedError();
  //     }

  //     const transaction = new Transaction().add(
  //       SystemProgram.transfer({
  //         fromPubkey: keypair.publicKey,
  //         toPubkey: key,
  //         lamports: Number(amount) * LAMPORTS_PER_SOL,
  //       })
  //     );
  //     transaction.feePayer = keypair.publicKey;
  //     let { blockhash } = await connection.getLatestBlockhash();
  //     transaction.recentBlockhash = blockhash;
  //     try {
  //       const txid = await sendAndConfirmTransaction(connection, transaction, [
  //         keypair,
  //       ]);
  //       console.log(`SOL recieved successful: ${txid}`);
  //       console.log("payment updated successfully");
  //     } catch (err) {
  //       console.log(`Unable to confirm transaction: ${err}`);
  //     }
  //   },
  //   [publicKey, sendTransaction, connection, opponent]
  // );

  useEffect(() => {
    if (winnerArr.length == 1) {
      //@ts-ignore
      dispatch(gameRender());
      if (winnerArr[0] && publicKey?.toString() === winnerArr[0]) {
        // transferSOLToPlayer(Number(betAmount) * 2, new PublicKey(winnerArr[0]));
        setPlayerStatus("win");
        showNotification({
          title: "Congrats you win the game!",
          message: "Reward sent to your account",
          autoClose: 2000,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.dark[8],
              "&::before": { backgroundColor: theme.colors.gray[4] },
            },
            title: { color: theme.white },
            description: { color: theme.colors.gray[5] },

            closeButton: {
              color: theme.colors.dark,
              "&:hover": { backgroundColor: "#F7C901", color: "#000000" },
            },
          }),
        });
        setShow(true);
      }
      if (winnerArr[0] && publicKey?.toString() !== winnerArr[0]) {
        setPlayerStatus("lose");
        showNotification({
          title: "!Oops you lost the game",
          message: "Better luck next time",
          autoClose: 2000,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.dark[8],
              "&::before": { backgroundColor: theme.colors.gray[4] },
            },
            title: { color: theme.white },
            description: { color: theme.colors.gray[5] },

            closeButton: {
              color: theme.colors.dark,
              "&:hover": { backgroundColor: "#F7C901", color: "#000000" },
            },
          }),
        });
        setShow(true);
      }
    }
    if (winnerArr.length == 2) {
      setPlayerStatus("tie");
      showNotification({
        title: "Match draw!",
        message: "Sol will be refunded to your account",
        autoClose: 2000,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.dark[8],
            "&::before": { BackgroundColor: theme.white },
          },
          title: { color: theme.white },
          description: { color: theme.colors.gray[4] },
          closeButton: {
            color: theme.colors.dark,
            "&:hover": { backgroundColor: "#F7C901", color: "#000000" },
          },
        }),
      });
      winnerArr.forEach((item) => {
        if (item && publicKey?.toString() === item) {
          //@ts-ignore
          // transferSOLToPlayer(betAmount, new PublicKey(item));
        }
      });
      setShow(true);
    }
  }, [winnerArr]);

  // const handleWinnerArr = useCallback(
  //   (walletAddress: string[]) => {
  //     setWinnerArr(walletAddress);
  //   },
  //   [winnerArr]
  // );
  const handleWinnerArr = (walletAddress: string[]) => {
    setWinnerArr(walletAddress);
  };

  useEffect(() => {
    if (socket) {
      socket.on("winner", (walletAddress: string[]) => {
        // if (!ranRef.current && winnerArr.join() !== walletAddress.join()) {
        console.log({ walletAddress });
        ranRef.current = true;
        handleWinnerArr(walletAddress);
        // }
      });
    }

    return () => {
      try {
        socket.off("winner");
      } catch (err) {
        console.warn(err);
      }
    };
  }, [socket]);
  return (
    <>
      {show && (
        <WinnerModal setShow={setShow} show={show} modelType={palyerStatus} />
      )}
    </>
  );
};
export default GameWinner;
