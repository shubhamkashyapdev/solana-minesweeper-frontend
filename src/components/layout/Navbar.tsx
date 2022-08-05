import React, { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui"

import LogoPrimary from "/assets/images/mineboy-logo-white.png"

const Navbar = () => {
  const { connected } = useWallet()
  console.log(connected)

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
          <WalletMultiButton className="bg-primary py-2 px-4 rounded-full font-semibold text-primaryBlack cursor-pointer wallet__button" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
