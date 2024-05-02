import React, { useEffect, useState } from "react";
import { allServiceObject, serviceObjects } from "../../constant";
import { GrStar } from "react-icons/gr";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ServiceCategory } from "../Landing/Landing";
import Subheader from "../../utilities/Subheader";
import SearchByCategoriesSlider from "../../utilities/SearchByCategoriesSlider";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

export const ServiceCard = ({ item, addToFavorites }) => {
  const [FavService, setFavService] = useState(false);
  const handleAddToFavorites = () => {
    addToFavorites(item.id);
    setFavService(true);
  };
  // console.log(item);
  // const cookie = document.cookie.split(";");
  // const jsonData = {};

  // cookie.forEach((item) => {
  //   const [key, value] = item.split("=");
  //   jsonData[key] = value;
  // });
  // const addFav = async()=>{
  //   try{
  //     const res = await axios.post("",{
  //       action:5,
  //       service_id: item.id
  //     },{
  //       headers:{
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${jsonData.access_token}`
  //       }
  //     });

  //     const json = res.data;
  //     if(!json){
  //       console.log("no data found");
  //       return;
  //     }
  //     console.log(json);
  //     setFavService(true);
  //   }catch(error){
  //     console.log(error)
  //   }
  // }
  return (
    <div className="relative shrink-0 w-[300px] md:w-[350px] rounded-xl bg-white border-[0.6px] border-[#bebebe] border-solid shadow-lg md:mb-0 pb-4">
      <div className="absolute top-2 right-2 z-10 text-white text-3xl py-[0.4vw] px-[0.4vw] drop-shadow-md flex items-center border-solid cursor-pointer">
        {FavService ? (
          <FaHeart onClick={() => setFavService(false)} />
        ) : (
          <FaRegHeart onClick={handleAddToFavorites} />
        )}
      </div>
      <img
        src={item?.img}
        className="w-full h-[200px] object-cover shrink-0 md:mb-[0.7vw]"
        alt=""
      />
      <div className="px-2 md:px-[0.8vw] pt-2 md:pt-0">
        <div className="flex items-center gap-4 font-semibold text-lg text-[#808080]">
          <img
            src={item?.profile_img}
            className="h-9 w-9 rounded-full "
            alt=""
          />
          <div>
            {item?.first_name} {item?.last_name}
          </div>
        </div>
        {/* <div className="font-bold text-xl line-clamp-2 text-ellipsis my-2 mb-[0.2vw]">
          {item?.category}
        </div> */}
        <div className="text-base md:text-lg my-2">{item?.price}</div>
        <div className="text-sm text-gray-500 line-clamp-3 md:mb-[1vw]">
          {item?.title}
        </div>
        <div className="flex items-center gap-6 text-sm mt-2">
          <div className="flex items-center gap-1">
            <GrStar />
            {item?.ratings}
          </div>
          <div>Reviews: {item?.score}</div>
        </div>
      </div>
    </div>
  );
};
export const allServiceData = [];

const Service = () => {
  const navigate = useNavigate();
  const [serviceObjects, setServiceObjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/customers/services/?action=1");
        const data = res.data.data;

        const categorizedServices = {};

        // Group services by category
        for (const category in data) {
          categorizedServices[category] = data[category].map((service) => ({
            id: service.id,
            first_name: service.expert_data.first_name,
            last_name: service.expert_data.last_name,
            title: service.service_name,
            img: service.service_img,
            profile_img: service.expert_data.profile_img,
            category: service.category.name,
            price: service.price,
            ratings: service.expert_data.avg_rating,
            score: service.expert_data.avg_score,
          }));
        }

        // Set state with categorized services
        setServiceObjects(Object.entries(categorizedServices));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleGoToService = (serviceId) => {
    navigate(`/experts/service/${serviceId}`);
  };

  return (
    <>
      <div className="mt-[90px] px-[7vw] md:px-[10vw]">
        <Subheader heading={"Services"} />
      </div>
      <SearchByCategoriesSlider />
      <div className="mb-10 lg:mb-5">
        <ServiceCategory />
      </div>
      <div className="w-full px-[7vw] md:px-[10vw] mt-[-1vw]">
        {serviceObjects.map(([category, services], index) => (
          <div key={index} className="mb-4 py-3 xs:py-2 md:py-0">
            <div className="font-bold text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-1">
              <span>Explore into {category}</span>
            </div>
            <div className="serviceContainer flex gap-[3.5vw] sm:gap-[1.6vw] md:gap-[1.2vw] py-[2vw] mb-[2vw] overflow-x-scroll">
              {services.map((service) => (
                <div
                  key={service?.id}
                  onClick={() => handleGoToService(service?.id)}
                  className="cursor-pointer"
                >
                  <ServiceCard item={service} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Service;
