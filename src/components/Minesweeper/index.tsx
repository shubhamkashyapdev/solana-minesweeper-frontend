import React from "react";
import LogoPrimary from "/assets/images/mineboy-logo-white.png";
import { Icon } from "@iconify/react";

const Minesweeper = () => {
  return (
    <div className="w-full ">
      <div className=" bg-cardbg h-[550px] mx-[235px] rounded-2xl mt-10">
        <h3></h3>
      </div>
      <div className=" bg-cardbg h-72 mx-[235px] rounded-2xl mt-10">
        <div className="grid grid-cols-2 px-10 pt-10">
          <div>
            <h1 className="text-white">Minesweeper Originals</h1>
          </div>
          <div></div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Minesweeper;
