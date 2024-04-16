import React from "react";
import { expertDetailsObj } from "../constant";
import { FaTags } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { BiSolidLike } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import {useLocation } from "react-router-dom";


export const BlogCardHorizontal = ({ index, items }) => {
    return (
      <div
        className={`px-3 py-4 my-6 rounded-md sm:flex justify-between gap-5  ${
          index % 2 === 0
            ? `bg-[#ececec]`
            : `border border-[#c7c7c7] border-solid `
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            className=" w-full h-48 object-cover sm:h-36 sm:w-40 rounded-md shrink-0 self-start"
            src={items?.img}
            alt=""
          />
          <div className="text-[#575757]">
            <div className="text-base font-semibold line-clamp-2 text-ellipsis">
              {items?.title}
            </div>
            <div className="text-sm text-[#898888]">{items?.date}</div>
            <div className="mt-3 text-xs flex items-center gap-2">
              <FaTags />
              <div className="flex items-center gap-2">
                {items?.tags.map((item) => (
                  <div className="text-[10px] border border-solid border-slate-300 px-2 py-1 rounded-xl cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-[3vw] sm:gap-0 sm:flex-col">
              <div className="mt-3 text-xs flex items-center gap-2">
                <IoEyeSharp /> {items?.views}
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className=" text-xs flex items-center gap-1 sm:gap-2">
                  <BiSolidLike /> {items?.likes} likes{" "}
                </div>
                <div className="border border-solid border-slate-400 text-[10px] rounded-full px-3 py-0.5 flex items-center cursor-pointer gap-1">
                  <FaPlus /> Add to Fav
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden border border-solid border-slate-300 h-fit sm:flex items-center justify-center rounded-full text-4xl font-thin self-center shrink-0 cursor-pointer">
          <RiArrowRightSLine />
        </div>
      </div>
    );
  };

const ShowBlogs = () => {
    const location=useLocation().pathname;
    console.log(location)

    return (
      <div className={location==="/customerdashboard/showblogs" ? "w-full md:w-[68%]":null}>
        {location==="/customerdashboard/showblogs" && <div className="text-xl font-bold border-b border-solid border-slate-200 pb-3">
        My Blogs
      </div> }
        {expertDetailsObj?.blogs?.map((item, idx) => (
          <BlogCardHorizontal key={idx} index={idx} items={item} />
        ))}
      </div>
    );
  };
export default ShowBlogs;