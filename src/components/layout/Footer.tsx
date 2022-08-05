import React from "react"
import LogoPrimary from "/assets/images/mineboy-logo-white.png"
import { Icon } from "@iconify/react"

const Footer = () => {
  return (
    <div>
      <div className="">
        <div className="flex flex-col space-x-10">
          <div className="flex-1">
            <img
              className="w-[200px]"
              src={LogoPrimary}
              alt="MineBoy Logo Primary"
            />
            <p className="mt-4">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Enim,
              minus.
            </p>
            <p className="text-red mt-6">@mineboy</p>
          </div>
          <div className="flex-1 flex flex-col">
            <a className="link_main">About Us</a>
            <a className="link">Zeux</a>
            <a className="link">Portfolio</a>
            <a className="link">Career</a>
            <a className="link">Contact Us</a>
          </div>
          <div className="flex-1">
            <a className="link_main">About Us</a>
            <p className="text-sm mt-6">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio
              nemo eum autem amet, quidem fugit?
            </p>
            <a className="link block mt-7">+908 89097 890</a>
          </div>
          <div className="flex-1 flex ">
            <div className="self-end flex items-baseline space-x-2">
              <div className="text-primaryBlack border-2 bg-primary h-10 w-10 flex justify-center items-center rounded-full cursor-pointer shadow-md hover:bg-primaryBlack hover:text-primary hover:shadow-2xl hover:border-primary transition-all ease-in-out">
                <Icon className="icon" icon="brandico:facebook" />
              </div>
              <div className="text-primaryBlack border-2 bg-primary h-10 w-10 flex justify-center items-center rounded-full cursor-pointer shadow-md hover:bg-primaryBlack hover:text-primary hover:shadow-2xl hover:border-primary transition-all ease-in-out">
                <Icon className="icon" icon="ant-design:instagram-outlined" />
              </div>
              <div className="text-primaryBlack border-2 bg-primary h-10 w-10 flex justify-center items-center rounded-full cursor-pointer shadow-md hover:bg-primaryBlack hover:text-primary hover:shadow-2xl hover:border-primary transition-all ease-in-out">
                <Icon className="icon" icon="bxl:twitter" />
              </div>
              <div className="text-primaryBlack border-2 bg-primary h-10 w-10 flex justify-center items-center rounded-full cursor-pointer shadow-md hover:bg-primaryBlack hover:text-primary hover:shadow-2xl hover:border-primary transition-all ease-in-out">
                <Icon className="icon" icon="cib:linkedin-in" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
