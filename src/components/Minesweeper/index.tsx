import React from "react";
import LogoPrimary from "/assets/images/mineboy-logo-white.png";
import { Icon } from "@iconify/react";
import { Select } from "@mantine/core";
import { useEffect, useState } from "react";
// import ReadMore from "react-native-read-more-text";

const Minesweeper = () => {
  let one = ["1", "3"];
  const [showfull, setshowfull] = useState(false);

  return (
    <div className="w-full ">
      <div className=" bg-cardbg h-[550px] mx-[235px] rounded-2xl mt-10">
        <h3></h3>
      </div>

      {/* 2nd section start from here  */}

      <div className=" bg-cardbg  mx-[235px] h-auto rounded-2xl mt-10">
        <div className="grid grid-cols-2 px-10 pt-10">
          <div>
            <h1 className="text-white">Minesweeper Originals</h1>
          </div>

          {/* // Dropdown Start here */}

          <div className="flex justify-center items-baseline">
            <Select
              className="mr-5 "
              label=""
              placeholder="5,148,300.00× Optimus1989"
              nothingFound="No options"
              data={one}
              icon={
                <img
                  src="./assets/images/emojione_trophy.svg"
                  className="p-1"
                />
              }
            />
          </div>
        </div>

        {/* Buttons start from here  */}

        <div className="w-full">
          <div className="mt-20 ml-10  mr-[44rem] ">
            <button className="w-[160px] hover:bg-[#ffffff2a] hover:border-[#ffffff96] hover:border-2 text-white font-medium  h-12 rounded-md drop-shadow-lg md:text-[20px]">
              Big Wins
            </button>
            <button className="w-[160px] hover:bg-[#ffffff2a] hover:border-[#ffffff96] hover:border-2 text-white font-medium  h-12 rounded-md drop-shadow-lg md:text-[20px]">
              Lucky wins
            </button>
            <button className="w-[160px] hover:bg-[#ffffff2a] hover:border-[#ffffff96] hover:border-2 text-white font-medium  h-12 rounded-md drop-shadow-lg md:text-[20px]">
              Challenges
            </button>
            <button className="w-[160px] hover:bg-[#ffffff2a] hover:border-[#ffffff96] hover:border-2 text-white font-medium  h-12 rounded-md drop-shadow-lg md:text-[20px]">
              Description
            </button>
          </div>
        </div>

        {/* image + content start from here  */}

        <div className="w-full mt-5 px-10 flex">
          <div className="">
            <img src="/assets/images/Rectangle 23.png" className="w-[490px]" />
          </div>
          <div className="px-10">
            <p className="pt-5 leading-8">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.""Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor{" "}
            </p>
          </div>
        </div>
        <div className="w-full mt-10 pl-10">
          {!showfull && (
            <p className="leading-7">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.""Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum."
              <button
                onClick={() => {
                  setshowfull(true);
                }}
              >
                {" "}
                Read More
              </button>
            </p>
          )}
          {showfull && (
            <p>
              11111 Duis aute irure dolor in reprehenderit in voluptate velit
              esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.""Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum."Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.""Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum."Duis aute irure dolor in reprehenderit in voluptate velit
              esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.""Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum."
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;
