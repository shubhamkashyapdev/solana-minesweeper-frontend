import React from "react"
import LogoPrimary from "/assets/images/logo-primary.png"

const Navbar = () => {
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
        <div className="bg-primary py-2 px-4 rounded-full font-semibold text-primaryBlack cursor-pointer">
          connect wallet
        </div>
      </div>
    </div>
  )
}

export default Navbar
