import React, { useEffect, useState } from "react";
import { IoBookmarksSharp } from "react-icons/io5";
import { MdVideoChat } from "react-icons/md";
import { FaHistory, FaWallet, FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { Link, Outlet } from "react-router-dom";
import { customerDashboardInfo } from "../../constant";
import  BookingCard  from "../../subsitutes/BookingCard";
import ShowBlogs from "../../subsitutes/ShowBlogs";
import axios from "../../axios";
import { imageDB } from "../firebase/config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

export const CustomerProfile = () => {
  const [userData, setUserData] = useState({});
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [currData, setCurrData] = useState({
  //   first_name: "",
  //   last_name: "",
  //   mobile_number: "",
  //   profile_img: "",
  //   gender: "",
  //   marital_status: "",
  // });
  const cookies = document.cookie.split("; ");
  const jsonData = {};

  cookies.forEach((item) => {
    const [key, value] = item.split("=");
    jsonData[key] = value;
  });
  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/customers/?action=1", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        });
        if (
          !response.data ||
          response.data.status === 400 ||
          response.data.status === 401
        ) {
          console.log(response.data.message);
          return;
        }
        setLoading(false);
        setUserData(response.data.data);
        console.log("ander wala", response.data.data);
        setImage(response.data.data.profile_img);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getUserData();
  }, []);
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      const imgRef = ref(imageDB, `UltraXpertImgFiles/${v4()}`);
      const uploadTask = uploadBytesResumable(imgRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get upload progress as a percentage
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.error("Error uploading image: ", error);
          // Handle error if needed
        },
        () => {
          // Upload completed successfully
          console.log("Upload complete");
        }
      );
      setLoading(true);
      try {
        await uploadTask;
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        console.log(url);
        setLoading(false);
        setImage(url);
        setUserData({
          ...userData,
          profile_img: url,
        });
      } catch (error) {
        console.error("Error uploading image: ", error);
        setLoading(false);
        // Handle error if needed
        alert("Something went wrong");
      }

      reader.readAsDataURL(file);
    }
  };

  const interest = [
    { id: 1, name: "Python" },
    { id: 2, name: "C++" },
    { id: 3, name: "Django" },
    { id: 4, name: "HTML" },
    { id: 5, name: "CSS" },
    { id: 6, name: "JS" },
    { id: 7, name: "React JS" },
  ];

  const [selectedSkill, setSelectedSkill] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    setSuggestions(
      interest.filter((suggestion) =>
        suggestion.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSuggestionClick = (suggestion) => {
    // Add suggestion to selected skills
    if (!selectedSkill.includes(suggestion.name)) {
      setSelectedSkill([...selectedSkill, suggestion.name]);
      console.log(selectedSkill);
    }
    // Clear input and suggestions
    setInputValue("");
    setSuggestions([]);
  };
  const saveProfile = async () => {
    const cookies = document.cookie.split("; ");
    const jsonData = {};

    cookies.forEach((item) => {
      const [key, value] = item.split("=");
      jsonData[key] = value;
    });
    console.log(jsonData);
    setLoading(true);
    try {
      const response = await axios.post(
        "/user_details/",
        {
          action: 1,
          first_name: userData.first_name,
          last_name: userData.last_name,
          mobile_number: userData.mobile_number,
          marital_status: userData.marital_status,
          gender: userData.gender,
          profile_img: userData.profile_img,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      if (
        !response.data ||
        response.data.status === 400 ||
        response.data.status === 401
      ) {
        console.log(response.data.message);
        return;
      }
      console.log(response.data);
      setLoading(false);
      setLoading(true);
      try {
        const res = await axios.post(
          "/customers/",
          {
            action: 3,
            about_me: userData.about_me,
            profession: userData.profession,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jsonData.access_token}`,
            },
          }
        );
        if (
          !response.data ||
          response.data.status === 400 ||
          response.data.status === 401
        ) {
          console.log(response.data.message);
          return;
        }
        console.log(res.data);
        setLoading(false);
        setLoading(true);
        try {
          const res2 = await axios.post(
            "/customers/",
            {
              action: 4,
              interest_list: selectedSkill,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jsonData.access_token}`,
              },
            }
          );
          if (
            !response.data ||
            response.data.status === 400 ||
            response.data.status === 401
          ) {
            console.log(response.data.message);
            return;
          }
          console.log(res2.data);
          setLoading(false);
          alert("Profile updated successfully!");
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getSkillInfo = async () => {
    const cookies = document.cookie.split("; ");
    const jsonData = {};

    cookies.forEach((item) => {
      const [key, value] = item.split("=");
      jsonData[key] = value;
    });
    console.log(jsonData);
    setLoading(true);
    try {
      const response = await axios.get("/customers/?action=2", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonData.access_token}`,
        },
      });
      const data = response.data;
      if (!data || data.status === 400 || data.status === 401) {
        alert(data.message);
        return;
      }
      console.log(data.data.interest_list);
      setLoading(false);
      setSelectedSkill(data.data.interest_list);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getSkillInfo();
  }, []);

  const handleRemove = (skill) => {
    setSelectedSkill(selectedSkill.filter((s) => s !== skill));
  };

  const handleNewSkillAdd = (value) => {
    if (!selectedSkill.includes(value)) {
      setSelectedSkill([...selectedSkill, value]);
    }
    setInputValue("");
  };

  return (
    <div className="w-full md:w-[68%] border border-solid border-slate-300 p-5 rounded-sm">
      <div className="flex items-center justify-between border-b border-solid border-slate-200 pb-3">
        <div className="text-xl font-bold ">Profile</div>
        <div
          onClick={() => saveProfile()}
          className={loading ? `bg-gray-300 px-4 py-2 rounded-md text-gray-500 cursor-not-allowed text-base` : `text-base bg-green-500 px-4 py-2 rounded-md cursor-pointer text-white`}
        >
          Save Profile
        </div>
      </div>
      <div className="flex items-center justify-around gap-4">
        <div className="mt-5 md:w-[80%] lg:w-[45%]">
          <div className="mt-5">
            <div className="text-base">First Name</div>
            <input
              type="text"
              value={userData.first_name}
              onChange={(e) =>
                setUserData({ ...userData, first_name: e.target.value })
              }
              className="mt-1 border border-solid border-slate-300 p-2 text-sm rounded-md focus:outline-none w-full"
              placeholder="Enter your first name"
            />
          </div>
          <div className="mt-5">
            <div className="text-base">Last Name</div>
            <input
              type="text"
              value={userData.last_name}
              onChange={(e) =>
                setUserData({ ...userData, last_name: e.target.value })
              }
              className="mt-1 border border-solid border-slate-300 p-2 text-sm rounded-md focus:outline-none w-full"
              placeholder="Enter your last name"
            />
          </div>
          <div className="mt-5">
            <div className="text-base ">Mobile number</div>
            <input
              type="number"
              value={userData.mobile_number}
              onChange={(e) =>
                setUserData({ ...userData, mobile_number: e.target.value })
              }
              className="mt-1 border border-solid border-slate-300 p-2 text-sm rounded-md focus:outline-none w-full"
              placeholder="Enter your mobile number"
            />
          </div>
          <div className=" mt-5 w-full">
            <div>
              <div className="text-base ">Gender</div>
              <select
                name="Gender"
                id="Gender"
                value={userData.gender}
                onChange={(e) =>
                  setUserData({ ...userData, gender: e.target.value })
                }
                className="mt-1 border border-solid border-slate-300 p-2 text-sm rounded-md focus:outline-none shrink-0 w-full"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          <div className="mt-5">
            <div className="text-base ">Marital Status</div>
            <select
              name="Marital"
              id="Marital"
              value={userData.marital_status}
              onChange={(e) =>
                setUserData({ ...userData, marital_status: e.target.value })
              }
              className="mt-1 border border-solid border-slate-300 p-2 text-sm rounded-md focus:outline-none shrink-0 w-full"
            >
              <option value="">Married</option>
              <option value="">Unmarried</option>
            </select>
          </div>
          <div className="mt-5">
            <div className="text-base ">About Me</div>
            <textarea
              rows="6"
              placeholder="Write about your self"
              value={userData.about_me}
              onChange={(e) =>
                setUserData({ ...userData, about_me: e.target.value })
              }
              className="min-w-full max-w-full mt-1 border border-solid border-slate-300 p-2 text-sm rounded-md focus:outline-none"
              style={{ resize: "none" }}
            ></textarea>
          </div>
          <div className="mt-5">
            <div className="text-base ">Profession</div>
            <input
              type="text"
              value={userData.profession}
              onChange={(e) =>
                setUserData({ ...userData, profession: e.target.value })
              }
              className="mt-1 border border-solid border-slate-300 p-2 text-sm rounded-md focus:outline-none w-full"
              placeholder="Enter your profession"
            />
          </div>
        </div>
        <div className="flex flex-col self-start py-5 w-[45%]">
          <label htmlFor="profile" className="text-base mb-1">
            Profile Photo
          </label>
          <div
            onClick={() => document.querySelector("#profileSelector").click()}
            className="flex flex-col justify-center items-center border border-dashed border-[#1475cf] h-[200px] w-full cursor-pointer rounded-lg"
          >
            <input
              type="file"
              accept="image/*"
              id="profileSelector"
              name="profileSelector"
              onChange={handleImageChange}
              className="hidden"
            />
            {image && (
              <div className="w-full max-w-sm mx-auto shrink-0 p-2 py-4 flex justify-center items-center">
                <img
                  src={image}
                  alt="Preview"
                  className="w-auto h-40 shrink-0 object-cover object-center m-2"
                />
              </div>
            )}
          </div>
          <div className="flex justify-center mx-auto flex-col w-full my-8">
            <label htmlFor="interests" className="text-lg mb-1">
              Interests
            </label>
            <div className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4">
              <div className="flex flex-wrap gap-2">
                {selectedSkill.length > 0 ? (
                  selectedSkill.map((skill, ind) => {
                    return (
                      <div
                        key={ind}
                        className="flex gap-2 px-4 py-1 text-sm rounded-full bg-inherit border border-solid border-black"
                      >
                        {skill}
                        <div
                          className="cursor-pointer"
                          onClick={() => handleRemove(skill)}
                        >
                          x
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-300 text-sm">
                    Select skills of your interest from below.
                  </p>
                )}
              </div>
            </div>
            <input
              type="text"
              id="interests"
              value={inputValue}
              onChange={handleChange}
              className="border border-solid border-slate-300 p-2 text-sm rounded-md focus:outline-none"
              placeholder="Enter your interests"
            />
            {suggestions.length > 0
              ? inputValue.length > 0 && (
                  <div className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4">
                    <div>
                      {suggestions.map((suggestion, ind) => (
                        <div
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="cursor-pointer hover:bg-gray-100 px-4 py-1"
                        >
                          {suggestion.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              : inputValue.length > 0 && (
                  <button
                    onClick={() => handleNewSkillAdd(inputValue)}
                    className="border border-solid border-slate-300 p-2 text-sm rounded-md focus:outline-none bg-green-500 text-white w-[30%] mt-2"
                  >
                    Add Interest
                  </button>
                )}

            {/* <div className="border border-solid border-slate-200 px-4 py-2 rounded-md mb-4">
              <div className="flex flex-wrap justifty-around gap-3">
                {interest.map((skill, ind) => {
                  return (
                    <div
                      key={ind}
                      onClick={() => {
                        handleChange(skill.name);
                      }}
                      className="cursor-pointer px-4 py-1 text-sm text-nowrap rounded-full bg-inherit border border-solid border-[#c7c7c7] text-[#8D8D8D] bg-[#E8E8E8] flex justify-center items-center overflow-visible"
                    >
                      {skill.name}
                    </div>
                  );
                })}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export const CustomerChats = () => {
  const [chatDetail, setChatDetail] = useState(false);
  return (
    <div className="w-full md:w-[68%] ">
      <div className="flex items-center justify-between text-xl font-bold border-b border-solid border-slate-200 pb-3">
        <div className="">Chats</div>
        <div className="flex justify-center gap-3">
          <IoMdSettings />
          <BsThreeDotsVertical />
        </div>
      </div>
      <div className="mt-6 flex gap-5">
        <div className="w-full">
          {customerDashboardInfo?.chats.map((item) => (
            <div
              className="cursor-default px-2 py-3 flex items-center gap-4 border border-solid border-slate-200"
              onClick={() =>
                chatDetail ? setChatDetail(false) : setChatDetail(true)
              }
            >
              <img
                src={item?.img}
                className="h-12 w-12 rounded-full object-cover shrink-0"
                alt="img"
              />
              <div className="flex flex-col gap-2">
                <div className="text-sm font-semibold">{item?.name}</div>
                <div className="text-xs line-clamp-1 xs:w-[200px]">
                  {item?.comment}
                </div>
              </div>
              <div className="ml-auto text-xs shrink-0">{item?.lastSeen}</div>
            </div>
          ))}
        </div>
        {chatDetail && (
          <div className="w-[100%] bg-red-600">
            <div>naman</div>
          </div>
        )}
      </div>
    </div>
  );
};
export const CustomerBookings = ({ id }) => {
  const [myBookings, setMyBookings] = useState([]);
  const cookies = document.cookie.split("; ");
  const jsonData = {};
  cookies.forEach((item) => {
    const [key, value] = item.split("=");
    jsonData[key] = value;
  });
  useEffect(() => {
    getMyBookings();
  }, []);

  const getMyBookings = async () => {
    try {
      const res = await axios.get(
        `/customers/connect/?action=6&customer_id=${4}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      const json = res.data;
      setMyBookings(json.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(myBookings);
  return (
    <div className="w-full md:w-[68%]">
      <div className="text-xl font-bold border-b border-solid border-slate-200 pb-3">
        Active Bookings
      </div>

      {myBookings.length === 0 ? (
        <div className="text-lg sm:text-2xl font-semibold sm:font-bold text-center my-10 text-gray-600 ">
          No Active Bookings
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 font-bold my-5 overflow-x-scroll">
            <div className="flex items-center xs:gap-[4vw] shrink-0">
              <div className="w-[200px]">Expert Name</div>
              <div className="hidden sm:block w-[120px] ">Scheduled Date</div>
              <div className="shrink-0 w-[60px]">Action</div>
            </div>
            <div className="shrink-0 text-right w-[60px] "></div>
          </div>
          {myBookings.map((item, index) => (
            <BookingCard item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};
export const CustomerRecentMeetngs = () => {
  return (
    <div className="w-full md:w-[68%]">
      <div className="text-xl font-bold border-b border-solid border-slate-200 pb-3">
        Recent Meetings
      </div>
      {customerDashboardInfo?.recentMeetings?.map((item, index) => (
        <div
          key={index}
          className={`px-5 py-4 my-5 rounded-md ${
            index % 2 === 0
              ? `bg-[#ececec]`
              : `border border-[#c7c7c7] border-solid`
          }`}
        >
          <div className="text-base font-semibold line-clamp-2">
            {item?.serviceTitle}
          </div>
          <div className="sm:flex justify-between gap-5 mt-4">
            <div className="text-sm">
              <div>Customer Name: {item?.customerName}</div>
              <div className="my-2">Service Price: {item?.servicePrice}</div>
              <div className="my-2">Meeting Id: {item?.meetingId}</div>
            </div>
            <div className="text-sm mt-2 sm:mt-0">
              <div>Date of Meeting: {item?.serviceDate}</div>
              <div className="my-2">Start Time: {item?.startTime}</div>
              <div>End Time: {item?.startTime}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const CustomerTransactionHistoryCard = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="text-sm flex items-center justify-between border-t border-solid border-slate-300 my-5 py-3 overflow-x-scroll  ">
        <div className="flex items-center xs:gap-[4vw] text-xs sm:text-sm">
          <div className="flex items-center gap-2 w-[180px] sm:w-[200px] ">
            <img
              src={item?.expertProfile}
              className="h-7 w-7 sm:h-9 sm:w-9 rounded-full shrink-0 object-cover"
              alt=""
            />
            <div>{item?.expertName}</div>
          </div>
          <div className="text-xs xs:text-sm w-[70px] sm:w-[90px] ">
            ₹ {item?.amount}
          </div>
          <div className="hidden md:block w-[120px] ">{item?.invoice}</div>
        </div>
        {open ? (
          <IoIosArrowUp
            className="shrink-0 text-base sm:text-xl "
            onClick={() => (open ? setOpen(false) : setOpen(true))}
          />
        ) : (
          <IoIosArrowDown
            className="shrink-0 text-base sm:text-xl "
            onClick={() => (open ? setOpen(false) : setOpen(true))}
          />
        )}
      </div>
      {open && (
        <div>
          <div className="text-xs sm:text-sm line-clamp-2">
            {" "}
            Date: {item?.date}{" "}
          </div>
          <div className="text-xs sm:text-sm mt-2">Time: {item?.time} </div>
          <div className="block md:hidden text-xs sm:text-sm mt-2">
            Invoice: {item?.invoice}{" "}
          </div>
          <div className="w-fit text-xs sm:text-sm mt-2 cursor-pointer text-red-500 hover:underline ">
            Download Invoice{" "}
          </div>
        </div>
      )}
    </>
  );
};

export const CustomerTransactionHistory = () => {
  return (
    <div className="w-full md:w-[68%]">
      <div className="text-xl font-bold border-b border-solid border-slate-200 pb-3">
        Transaction History
      </div>
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 font-bold my-5">
        <div className="flex items-center xs:gap-[4vw] shrink-0">
          <div className="w-[180px] sm:w-[200px]">Expert Name</div>
          <div className="w-[70px] sm:w-[90px] text-xs xs:text-sm">Amount</div>
          <div className="hidden md:block w-[120px]">Invoice</div>
        </div>
      </div>
      <div className=" ">
        {customerDashboardInfo?.transactionHistory.map((item, index) => (
          <CustomerTransactionHistoryCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};
const CustomerDashboard = () => {
  const [userData, setUserData] = useState({});
  const cookies = document.cookie.split("; ");
  const jsonData = {};

  cookies.forEach((item) => {
    const [key, value] = item.split("=");
    jsonData[key] = value;
  });
  const getUserData = async () => {
    try {
      const response = await axios.get("/customers/?action=1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonData.access_token}`,
        },
      });
      if (
        !response.data ||
        response.data.status === 400 ||
        response.data.status === 401
      ) {
        console.log(response.data.message);
        return;
      }

      setUserData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div className="mt-[100px] px-[7vw] md:flex gap-[1vw]">
      <div className="hidden md:block w-[32%] ">
        <div className=" flex flex-col h-fit border border-[rgb(199,199,199)] border-solid rounded-lg ">
          <div className="flex flex-col items-center justify-center px-[2vw] pb-5 border-b border-solid border-slate-300 ">
            <img
              src={userData?.profile_img}
              className="mt-12 object-cover shrink-0 rounded-lg h-20 w-20 lg:h-28 lg:w-28 border-2 border-solid border-white"
              alt=""
            />
            <div className="text-base lg:text-xl font-bold mt-4">
              {userData?.first_name} {userData?.last_name}
            </div>
            <div className="text-sm text-justify line-clamp-3">
              {userData?.about_me}
            </div>
          </div>
          <div>
            <ul className="p-0  ">
              <Link className="no-underline">
                <li className="flex gap-[1.25vw] items-center  font-semibold text-[1.25vw] text-[#575757] py-[1.8vw] pl-[1vw]">
                  <FaUserAlt className="text-[1.55vw]" />
                  Profile
                </li>
              </Link>
              <Link to="chats" className="no-underline">
                <li className="flex gap-[1.25vw] items-center  font-semibold text-[1.25vw] text-[#575757] py-[1.8vw] pl-[1vw]">
                  <BsFillChatSquareTextFill className="text-[1.55vw]" />
                  Chat
                </li>
              </Link>
              {/* <Link to="showblogs" className="no-underline">
                <li className="flex gap-[1.25vw] items-center  font-semibold text-[1.25vw] text-[#575757] py-[1.8vw] pl-[1vw]">
                  <BsFillChatSquareTextFill className="text-[1.55vw]" />
                  My Blogs
                </li>
              </Link> */}
              <Link to="mybookings" className="no-underline">
                <li className="flex gap-[1.25vw] items-center font-semibold text-[1.25vw] text-[#575757] py-[1.8vw] pl-[1vw]">
                  <IoBookmarksSharp className="text-[1.55vw]" />
                  My Bookings
                </li>
              </Link>
              <Link to="recentmeetings" className="no-underline">
                <li className="flex gap-[1.25vw] items-center font-semibold text-[1.25vw] text-[#575757] py-[1.8vw] pl-[1vw]">
                  <MdVideoChat className="text-[1.55vw]" />
                  Recent Meetings
                </li>
              </Link>
              <Link to="transactionhistory" className="no-underline">
                <li className="flex gap-[1.25vw] items-center font-semibold text-[1.25vw] text-[#575757] py-[1.8vw] pl-[1vw]">
                  <FaHistory className="text-[1.55vw]" />
                  Transaction History
                </li>
              </Link>

              <li className="flex gap-[1.25vw] items-center font-semibold text-[1.25vw] text-[#575757] py-[1.8vw] pl-[1vw]">
                <FaWallet className="text-[1.55vw]" />
                Wallet
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Outlet>
        <CustomerProfile />
        <CustomerChats />
        <ShowBlogs />
        <CustomerBookings id={userData?.id} />
        <CustomerRecentMeetngs />
        <CustomerTransactionHistory />
      </Outlet>
    </div>
  );
};

export default CustomerDashboard;
