import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Marquee from "react-fast-marquee";
import { landingImgRow1, landingImgRow2 } from "../../constant";

const HeroSection = () => {
  const [search, setSearch] = useState("");
  return (
    <div className="relative mt-[80px] w-full h-auto overflow-hidden mb-[3vw]">
      <div className="md:-mt-10 overflow-hidden">
        <h1 className="w-[55vw] md:w-[45vw] text-center text-[7vw] md:text-[6vw] leading-[1.4] md:leading-[1.1] overflow-hidden tracking-normal  font-sans font-[900] break-words ml-[50%] translate-x-[-50%]">
          Think creative,
          <br /> Do effective
        </h1>
        <div className="md:-mt-5 flex justify-center items-center ml-[50%] translate-x-[-50%] ]">
          <input
            className="w-[38vw] md:w-[30vw] h-[3.5vw] bg-[#ECECEC] rounded-md rounded-r-none pl-4  text-[2vw] md:text-[1.15vw]"
            type="text"
            placeholder="Search for any services"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="bg-[#ECECEC] w-[3.5vw] rounded-l-none rounded-md h-[3.5vw]  flex items-center">
            <FaSearch className=" text-black bg-[#ECECEC] right-[32vw] md:right-[35vw] font-thin text-[2.2vw]  md:text-[1.25vw]" />
          </div>
        </div>
      </div>
      <div className="w-[100vw] mt-8 h-auto overflow-hidden">
        <Marquee className="my-2" speed={30}>
          {landingImgRow1.map((item, index) => (
            <div
              className={`w-[12vw] h-[12vw] md:w-[10.5vw] md:h-[10.5vw] mr-[10px] rounded-[18px] items-center justify-center overflow-hidden`}
              key={index}
            >
              <img className="w-full h-full object-fill" src={item} />
            </div>
          ))}
        </Marquee>
        <Marquee className="my-4" speed={30} direction="right">
          {landingImgRow2.map((item, index) => (
            <div
              className={`w-[12vw] h-[12vw] md:w-[10.5vw] md:h-[10.5vw] mr-[10px] rounded-[18px] items-center justify-center overflow-hidden`}
              key={index}
            >
              <img className="w-full h-full object-fill" src={item} />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default HeroSection;
