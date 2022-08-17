import React, { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js"
import LogoPrimary from "/assets/images/mineboy-logo-white.png";
import { useDispatch, useSelector } from 'react-redux'
import { setSocketIO, setWalletAddress } from "../../redux/Game/GameAction";
import { io } from 'socket.io-client'

const Navbar = () => {
  //@ts-ignore
  const { walletAddress, socket } = useSelector(state => state.game)

  console.log({ socket })

  const { publicKey } = useWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    let connection: any;
    console.log({ walletAddress, socket })
    if (walletAddress && !socket) {
      connection = io("http://192.168.18.241:5000", {
        auth: { walletId: walletAddress }
      })
      // @ts-ignore
      dispatch(setSocketIO(connection))
    }

  }, [walletAddress]);

  useEffect(() => {
    if (publicKey && !walletAddress) {
      const address: string = new PublicKey(publicKey).toString()
      //@ts-ignore
      dispatch(setWalletAddress(address))
    }
  }, [publicKey])

  return (
    <div className="shadow-lg py-6 w-full">
      <div className=" flex w-[90%] mx-auto justify-between">
        <div>
          <img
            className="w-[200px]"
            src={LogoPrimary}
            alt="MineBoy Logo Primary"
          />
        </div>
        <div>
          <WalletMultiButton className="bg-primary py-2 px-4 rounded-full font-semibold text-primaryBlack text-sm cursor-pointer wallet__button text-center" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
