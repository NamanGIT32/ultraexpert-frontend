import React, { useEffect, useState, useRef } from "react";
import axios from "../../axios";
import {
  BiSolidCaretLeftSquare,
  BiSolidCaretRightSquare,
} from "react-icons/bi";
import { handleUploadImage } from "../../constant";
import ImageUploader from "../../ImageUploader";
import Modal from "../../Modal";
import { FiUpload } from "react-icons/fi";

const cookies = document.cookie.split("; ");
const jsonData = {};
cookies.forEach((item) => {
  const [key, value] = item.split("=");
  jsonData[key] = value;
});

const GeneralDetails = () => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [showModalProfile, setShowModalProfile] = useState(false);
  const [showModalBackground, setShowModalBackground] = useState(false);
  const [myImageBackground, setMyImageBackground] = useState(null);
  const [myImageProfile, setMyImageProfile] = useState(null);

  const onSelectFileProfile = (event) => {
    setProfileLoading(true);
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setMyImageProfile(reader.result);
        setShowModalProfile(true); // Show the modal when an image is selected
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const onSelectFileBackground = (event) => {
    setBannerLoading(true);
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setMyImageBackground(reader.result);
        setShowModalBackground(true); // Show the modal when an image is selected
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleCroppedImageProfile = (url) => {
    console.log("Cropped image URL:", url);
    setShowModalProfile(false); // Close the modal after getting the URL
    setProfileLoading(false);
    setMyImageProfile(url); // Reset the image state
    setGeneralInfo({
      ...generalInfo,
      profile_img: url,
    })
  };
  const handleCroppedImageBackground = (url) => {
    console.log("Cropped image URL:", url);
    setShowModalBackground(false); // Close the modal after getting the URL
    setBannerLoading(false);
    setMyImageBackground(url); // Reset the image state
    setGeneralInfo({
      ...generalInfo,
      banner_img: url,
    })
  };
  const closeModalProfile = () => {
    setShowModalProfile(false);
    setProfileLoading(false);
    setMyImageProfile(generalInfo.profile_img); // Reset the image state when modal is closed
  };
  const closeModalBackground = () => {
    setShowModalBackground(false);
    setBannerLoading(false);
    setMyImageBackground(generalInfo.banner_img); // Reset the image state when modal is closed
  };

  const getGenInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/experts/?action=1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonData.access_token}`,
        },
      });
      const data = response.data;
      if (!data || data.status === 400 || data.status === 401) {
        console.log("Something went wrong");
        return;
      }
      console.log(response.data.data);
      setLoading(false);
      setGeneralInfo({
        ...generalInfo,
        first_name: response.data.data.first_name,
        last_name: response.data.data.last_name,
        mobile_number: response.data.data.mobile_number,
        marital_status: response.data.data.marital_status,
        profile_img: response.data.data.profile_img,
        banner_img: response.data.data.banner_img,
        gender: response.data.data.gender,
      });
      setMyImageProfile(response.data.data.profile_img);
      setMyImageBackground(response.data.data.banner_img);
      setDataLoading(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getGenInfo();
  }, []);

  const [generalInfo, setGeneralInfo] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    marital_status: "Single",
    profile_img: "",
    banner_img: "",
    gender: "Male",
  });

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    const cookies = document.cookie.split("; ");
    const jsonData = {};

    cookies.forEach((item) => {
      const [key, value] = item.split("=");
      jsonData[key] = value;
    });
    setLoading(true);
    try {
      const response = await axios.post(
        "/user_details/?action=1",
        {
          action: 1,
          first_name: generalInfo.first_name,
          last_name: generalInfo.last_name,
          mobile_number: generalInfo.mobile_number,
          marital_status: generalInfo.marital_status,
          profile_img: generalInfo.profile_img,
          gender: generalInfo.gender,
          banner_img: generalInfo.banner_img,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      const data = response.data;
      if (!data || data.status === 400 || data.status === 401) {
        console.log("Something went wrong");
        return;
      }
      console.log(data, generalInfo);
      setLoading(false);
      localStorage.setItem("profile", generalInfo.profile_img);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [selectedProfileUrl, setSelectedProfileUrl] = useState(null);
  const [selectedBannerUrl, setSelectedBannerUrl] = useState(null);

  const [profileLoading, setProfileLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);

  

  console.log(generalInfo);
  return (
    <form onSubmit={handleSubmit1} className="grow flex flex-col h-full">
      {dataLoading ? (
        <>
          <div className="flex justify-center mx-auto flex-col w-[65%] my-8">
            <label htmlFor="firstName" className="text-lg mb-1">
              First Name
            </label>
            <input
              required
              type="text"
              id="firstName"
              name="firstName"
              value={generalInfo.first_name}
              onChange={(e) =>
                setGeneralInfo({ ...generalInfo, first_name: e.target.value })
              }
              className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
              placeholder="Enter your first name"
            />
            <label htmlFor="lastName" className="text-lg mb-1">
              Last Name
            </label>
            <input
              required
              type="text"
              id="lastName"
              name="lastName"
              value={generalInfo.last_name}
              onChange={(e) =>
                setGeneralInfo({ ...generalInfo, last_name: e.target.value })
              }
              className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
              placeholder="Enter your last name"
            />
            <div className="flex gap-4 justify-around">
              <div className="flex flex-col w-full">
                <label htmlFor="mobileNumber" className="text-lg mb-1">
                  Mobile Number
                </label>
                <input
                  required
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={generalInfo.mobile_number}
                  onChange={(e) =>
                    setGeneralInfo({
                      ...generalInfo,
                      mobile_number: e.target.value,
                    })
                  }
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                  placeholder="Enter your mobile number"
                />
              </div>
            </div>

            <div className="flex justify-around gap-5">
              <div className="flex flex-col w-full">
                <label htmlFor="gender" className="text-lg mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={generalInfo.gender}
                  onChange={(e) =>
                    setGeneralInfo({
                      ...generalInfo,
                      gender: e.target.value,
                    })
                  }
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="status" className="text-lg mb-1">
                  Marital Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={generalInfo.marital_status}
                  onChange={(e) => {
                    setPersonalInfo({
                      ...generalInfo,
                      marital_status: e.target.value,
                    });
                  }}
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                >
                  <option value="basic">Single</option>
                  <option value="inter">Married</option>
                </select>
              </div>
            </div>
            <div className="flex justify-around gap-5">
              <div className="flex flex-col w-full">
                <label htmlFor="profile" className="text-lg mb-1">
                  Profile Photo
                </label>
                <div
                  onClick={() =>
                    document.querySelector("#profileSelector").click()
                  }
                  className="flex flex-col justify-center items-center border border-dashed border-[#1475cf] h-[200px] w-full cursor-pointer rounded-lg"
                >
                  <input
                    type="file"
                    accept="image/*"
                    id="profileSelector"
                    name="profileSelector"
                    onChange={onSelectFileProfile}
                    className="hidden"
                  />
                  {profileLoading ? (
                    <div className="flex w-full h-full items-center justify-center text-center">
                      <span>Loading...</span>
                    </div>
                  ) : myImageProfile ? (
                    <div className="w-full max-w-sm mx-auto shrink-0 p-2 py-4 flex justify-center items-center">
                      <img
                        src={myImageProfile}
                        alt="Preview"
                        className="w-auto h-40 shrink-0 object-cover object-center m-2"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-600">
                      <FiUpload className="w-10 h-10" />
                      <span className="ml-2">Upload Image</span>
                    </div>
                  )}
                </div>
                <Modal
                      className="w-full h-full overflow-scroll"
                      show={showModalProfile}
                      onClose={closeModalProfile}
                    >
                      <ImageUploader
                        image={myImageProfile}
                        handleUploadImage={handleUploadImage}
                        filename="cropped_image.jpg"
                        onCropped={handleCroppedImageProfile}
                        aspectRatio={1} // Change this to 1 for square, 16/9 for landscape, or 9/16 for portrait
                      />
                    </Modal>
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="banner" className="text-lg mb-1">
                  Banner Photo
                </label>
                <div
                  onClick={() =>
                    document.querySelector("#bannerSelector").click()
                  }
                  className="flex flex-col justify-center items-center border border-dashed border-[#1475cf] h-[200px] w-full cursor-pointer rounded-lg"
                >
                  <input
                    type="file"
                    accept="image/*"
                    id="bannerSelector"
                    name="bannerSelector"
                    onChange={onSelectFileBackground}
                    className="hidden"
                  />
                  {bannerLoading ? (
                    <div className="flex w-full h-full items-center justify-center text-center">
                      <span>Loading...</span>
                    </div>
                  ) : myImageBackground ? (
                    <div className="w-full max-w-sm mx-auto shrink-0 p-2 py-4 flex justify-center items-center">
                      <img
                        src={myImageBackground}
                        alt="Preview"
                        className="w-auto h-40 shrink-0 object-cover object-center m-2"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-600">
                      <FiUpload className="w-10 h-10" />
                      <span className="ml-2">Upload Image</span>
                    </div>
                  )}
                </div>
                <Modal
                      className="w-full h-full overflow-scroll"
                      show={showModalBackground}
                      onClose={closeModalBackground}
                    >
                      <ImageUploader
                        image={myImageBackground}
                        handleUploadImage={handleUploadImage}
                        filename="cropped_image.jpg"
                        onCropped={handleCroppedImageBackground}
                        aspectRatio={16 / 9} // Change this to 1 for square, 16/9 for landscape, or 9/16 for portrait
                      />
                    </Modal>
              </div>
            </div>
          </div>
          <div className="flex justify-end mx-20 mb-8">
            <button
              type="submit"
              className={
                loading
                  ? `px-6 py-2 text-gray-300 rounded-md font-semibold bg-inherit`
                  : `cursor-pointer px-6 py-2 text-lg font-semibold text-blue-500 bg-inherit border border-solid border-gray-300 rounded-md shadow-md`
              }
            >
              Update
            </button>
          </div>
        </>
      ) : (
        <div className="text-lg sm:text-2xl font-semibold sm:font-bold text-center my-10 text-gray-600 ">
          Data Loading...
        </div>
      )}
    </form>
  );
};

const PersonalDetails = () => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const getPerInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/experts/?action=1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonData.access_token}`,
        },
      });
      const data = response.data;
      if (!data || data.status === 400 || data.status === 401) {
        console.log("Something went wrong");
        return;
      }
      console.log(response.data.data);
      setLoading(false);
      setPersonalInfo({
        ...personalInfo,
        level: response.data.data.level,
        profession: response.data.data.profession,
        about_me: response.data.data.about_me,
        experience_years: response.data.data.experience_years,
      });
      setDataLoading(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPerInfo();
  }, []);

  const [personalInfo, setPersonalInfo] = useState({
    level: "Basic",
    profession: "",
    about_me: "",
    experience_years: "",
  });
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const cookies = document.cookie.split("; ");
    const jsonData = {};

    cookies.forEach((item) => {
      const [key, value] = item.split("=");
      jsonData[key] = value;
    });
    console.log(jsonData);
    setLoading(true);
    try {
      // const response = await fetch("http://localhost:8000/experts/update/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     action: 2,
      //     level: personalInfo.level,
      //     profession: personalInfo.profession,
      //     about_me: personalInfo.about_me,
      //   }),
      //   credentials: "include",
      // });
      // const json = await response.json();
      // console.log(json);
      const response = await axios.post(
        "/experts/update/",
        {
          action: 1,
          level: personalInfo.level,
          profession: personalInfo.profession,
          about_me: personalInfo.about_me,
          experience_years: personalInfo.experience_years,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      const data = response.data;
      if (!data || data.status === 400 || data.status === 401) {
        alert(data.message);
        return;
      }
      console.log(data);
      setLoading(false);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit2} className="grow flex flex-col h-full">
      {dataLoading ? (
        <>
          <div className="flex justify-center mx-auto flex-col w-[65%] my-8">
            <div className="flex justify-around gap-5">
              <div className="flex flex-col w-full">
                <label htmlFor="experience" className="flex gap-1 text-lg mb-1">
                  Experience <div className="text-xs my-auto">(in years)</div>
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  required
                  value={personalInfo.experience_years}
                  onChange={(e) => {
                    setPersonalInfo({
                      ...personalInfo,
                      experience_years: e.target.value,
                    });
                  }}
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                  placeholder="Experience"
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="level" className="text-lg mb-1">
                  Level
                </label>
                <select
                  name="level"
                  id="level"
                  value={personalInfo.level}
                  onChange={(e) => {
                    setPersonalInfo({
                      ...personalInfo,
                      level: e.target.value,
                    });
                  }}
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                >
                  <option value="basic">Basic</option>
                  <option value="inter">Intermediate</option>
                  <option value="amateur">Amateur</option>
                  <option value="pro">Professional</option>
                </select>
              </div>
            </div>

            <label htmlFor="profession" className="text-lg mb-1">
              Profession
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              required
              value={personalInfo.profession}
              onChange={(e) => {
                setPersonalInfo({
                  ...personalInfo,
                  profession: e.target.value,
                });
              }}
              className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
              placeholder="Profession"
            />

            <label htmlFor="about" className="text-lg mb-1">
              About Me
            </label>
            <textarea
              required
              type="text"
              id="about"
              name="about"
              value={personalInfo.about_me}
              onChange={(e) => {
                setPersonalInfo({
                  ...personalInfo,
                  about_me: e.target.value,
                });
              }}
              className="border border-solid border-gray-300 px-2 py-2 rounded-md w-full mb-4"
              placeholder="I want to learn css, html, python with django"
            />
          </div>
          <div className="flex justify-end mx-20 mb-8">
            <button
              type="submit"
              className={
                loading
                  ? `px-6 py-2 text-gray-300 rounded-md font-semibold bg-inherit`
                  : `cursor-pointer px-6 py-2 text-lg font-semibold text-blue-500 bg-inherit border border-solid border-gray-300 rounded-md shadow-md`
              }
            >
              Update
            </button>
          </div>
        </>
      ) : (
        <div className="text-lg sm:text-2xl font-semibold sm:font-bold text-center my-10 text-gray-600 ">
          Data Loading...
        </div>
      )}
    </form>
  );
};

const EducationDetails = () => {
  const [educationForms, setEducationForms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dataLoading, setDataLoading] = useState(false);

  const addEducationForm = () => {
    setEducationForms([...educationForms, { id: educationForms.length + 1 }]);
  };

  const getEduInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/experts/?action=1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonData.access_token}`,
        },
      });
      const data = response.data;
      if (!data || data.status === 400 || data.status === 401) {
        console.log("Something went wrong");
        return;
      }
      console.log(response.data.data);
      setLoading(false);
      const eduData = response.data.data.education;
      console.log(eduData);

      setEducationForms(eduData.map((form, index) => ({ id: index + 1 })));

      const updatedTypes = [];
      const updatedInstituteNames = [];
      const updatedCities = [];
      const updatedStateNames = [];
      const updatedCountries = [];
      const updatedPassingYears = [];
      const updatedDivisions = [];

      // Populate the arrays with data from the server
      eduData.forEach((form) => {
        updatedTypes.push(form.type);
        updatedInstituteNames.push(form.institute_name);
        updatedCities.push(form.city);
        updatedStateNames.push(form.state_name);
        updatedCountries.push(form.country);
        updatedPassingYears.push(form.passing_year);
        updatedDivisions.push(form.Division);
      });

      // Update the state once with all the arrays
      setEduInfo({
        type: updatedTypes,
        institute_name: updatedInstituteNames,
        city: updatedCities,
        state_name: updatedStateNames,
        country: updatedCountries,
        passing_year: updatedPassingYears,
        Devision: updatedDivisions,
      });
      setDataLoading(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEduInfo();
  }, []);

  const [eduInfo, setEduInfo] = useState({
    type: [],
    institute_name: [],
    city: [],
    state_name: [],
    country: ["India"],
    passing_year: [],
    Devision: ["First"],
  });

  const handleSubmit3 = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const educationData = educationForms.map((form, index) => ({
        type: eduInfo.type[index],
        institute_name: eduInfo.institute_name[index],
        city: eduInfo.city[index],
        state_name: eduInfo.state_name[index],
        country: eduInfo.country[index],
        passing_year: eduInfo.passing_year[index],
        Devision: eduInfo.Devision[index],
      }));
      const response = await axios.post(
        "/experts/update/",
        {
          action: 2,
          education_json: educationData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      const data = response.data;
      if (!data || data.status === 400 || data.status === 401) {
        alert(data.message);
        return;
      }
      setLoading(false);
      console.log(data, educationData);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const removeEducationForm = (idToRemove) => {
    const updatedEducationForms = educationForms.filter(
      (form) => form.id !== idToRemove
    );
    setEducationForms(updatedEducationForms);
    setEduInfo((prevEduInfo) => {
      const updatedType = [...prevEduInfo.type];
      const updatedInstituteName = [...prevEduInfo.institute_name];
      const updatedCity = [...prevEduInfo.city];
      const updatedCountry = [...prevEduInfo.country];
      const updatedPassingYear = [...prevEduInfo.passing_year];
      const updatedDevision = [...prevEduInfo.Devision];

      updatedType.splice(idToRemove - 1, 1);
      updatedInstituteName.splice(idToRemove - 1, 1);
      updatedCity.splice(idToRemove - 1, 1);
      updatedCountry.splice(idToRemove - 1, 1);
      updatedPassingYear.splice(idToRemove - 1, 1);
      updatedDevision.splice(idToRemove - 1, 1);

      return {
        ...prevEduInfo,
        type: updatedType,
        institute_name: updatedInstituteName,
        city: updatedCity,
        country: updatedCountry,
        passing_year: updatedPassingYear,
        Devision: updatedDevision,
      };
    });
  };

  return (
    <form onSubmit={handleSubmit3} className="grow h-full flex flex-col">
      {dataLoading ? (
        <>
          <div className="flex justify-center mx-auto flex-col w-[65%] my-8 ">
            <button
              onClick={(e) => {
                e.preventDefault();
                addEducationForm();
              }}
              className="underline cursor-pointer text-gray-400 bg-inherit hover:text-gray-700"
            >
              + Add Education
            </button>
            {educationForms.map((form, ind) => (
              <>
                <div key={form.id} className="flex justify-between">
                  <p className="font-bold text-lg">Education {ind + 1}</p>
                  <button
                    onClick={() => removeEducationForm(form.id)}
                    className="underline cursor-pointer text-red-400 bg-inherit hover:text-red-600"
                  >
                    - Remove Education
                  </button>
                </div>
                <label htmlFor={`institute${form.id}`} className="text-lg mb-1">
                  Institute Name
                </label>
                <input
                  type="text"
                  id={`institute${form.id}`}
                  name={`institute${form.id}`}
                  value={eduInfo.institute_name[ind]}
                  onChange={(e) => {
                    const updatedInstituteNames = [...eduInfo.institute_name];
                    updatedInstituteNames[ind] = e.target.value;
                    setEduInfo({
                      ...eduInfo,
                      institute_name: updatedInstituteNames,
                    });
                  }}
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                  placeholder="Institute Name"
                />
                <div className="flex justify-around gap-5">
                  <div className="flex flex-col w-full">
                    <label htmlFor={`type${form.id}`} className="text-lg mb-1">
                      Degree Type
                    </label>
                    <input
                      type="text"
                      id={`type${form.id}`}
                      name={`type${form.id}`}
                      value={eduInfo.type[ind]}
                      onChange={(e) => {
                        const updatedType = [...eduInfo.type];
                        updatedType[ind] = e.target.value;
                        setEduInfo({ ...eduInfo, type: updatedType });
                      }}
                      className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                      placeholder="Type"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor={`passing${form.id}`}
                      className="text-lg mb-1"
                    >
                      Passing Year
                    </label>
                    <input
                      type="text"
                      id={`passing${form.id}`}
                      name={`passing${form.id}`}
                      value={eduInfo.passing_year[ind]}
                      onChange={(e) => {
                        const updatedPassingYear = [...eduInfo.passing_year];
                        updatedPassingYear[ind] = e.target.value;
                        setEduInfo({
                          ...eduInfo,
                          passing_year: updatedPassingYear,
                        });
                      }}
                      className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                      placeholder="Passing Year"
                    />
                  </div>
                </div>
                <div className="flex justify-around gap-5">
                  <div className="flex flex-col w-full">
                    <label htmlFor={`city${form.id}`} className="text-lg mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id={`city${form.id}`}
                      name={`city${form.id}`}
                      value={eduInfo.city[ind]}
                      onChange={(e) => {
                        const updatedCityName = [...eduInfo.city];
                        updatedCityName[ind] = e.target.value;
                        setEduInfo({ ...eduInfo, city: updatedCityName });
                      }}
                      className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                      placeholder="City"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor={`state${form.id}`} className="text-lg mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id={`state${form.id}`}
                      name={`state${form.id}`}
                      value={eduInfo.state_name[ind]}
                      onChange={(e) => {
                        const updatedStateName = [...eduInfo.state_name];
                        updatedStateName[ind] = e.target.value;
                        setEduInfo({
                          ...eduInfo,
                          state_name: updatedStateName,
                        });
                      }}
                      className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="flex justify-around gap-5">
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor={`country${form.id}`}
                      className="text-lg mb-1"
                    >
                      Country
                    </label>
                    <select
                      name={`country${form.id}`}
                      id={`country${form.id}`}
                      value={eduInfo.country[ind]}
                      onChange={(e) => {
                        const updatedCountryNames = [...eduInfo.country];
                        updatedCountryNames[ind] = e.target.value;
                        setEduInfo({
                          ...eduInfo,
                          country: updatedCountryNames,
                        });
                      }}
                      className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                    >
                      <option value="United States">United States</option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Albania">Albania</option>
                      <option value="Algeria">Algeria</option>
                      <option value="American Samoa">American Samoa</option>
                      <option value="Andorra">Andorra</option>
                      <option value="Angola">Angola</option>
                      <option value="Anguilla">Anguilla</option>
                      <option value="Antartica">Antarctica</option>
                      <option value="Antigua and Barbuda">
                        Antigua and Barbuda
                      </option>
                      <option value="Argentina">Argentina</option>
                      <option value="Armenia">Armenia</option>
                      <option value="Aruba">Aruba</option>
                      <option value="Australia">Australia</option>
                      <option value="Austria">Austria</option>
                      <option value="Azerbaijan">Azerbaijan</option>
                      <option value="Bahamas">Bahamas</option>
                      <option value="Bahrain">Bahrain</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Barbados">Barbados</option>
                      <option value="Belarus">Belarus</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Belize">Belize</option>
                      <option value="Benin">Benin</option>
                      <option value="Bermuda">Bermuda</option>
                      <option value="Bhutan">Bhutan</option>
                      <option value="Bolivia">Bolivia</option>
                      <option value="Bosnia and Herzegowina">
                        Bosnia and Herzegowina
                      </option>
                      <option value="Botswana">Botswana</option>
                      <option value="Bouvet Island">Bouvet Island</option>
                      <option value="Brazil">Brazil</option>
                      <option value="British Indian Ocean Territory">
                        British Indian Ocean Territory
                      </option>
                      <option value="Brunei Darussalam">
                        Brunei Darussalam
                      </option>
                      <option value="Bulgaria">Bulgaria</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Burundi">Burundi</option>
                      <option value="Cambodia">Cambodia</option>
                      <option value="Cameroon">Cameroon</option>
                      <option value="Canada">Canada</option>
                      <option value="Cape Verde">Cape Verde</option>
                      <option value="Cayman Islands">Cayman Islands</option>
                      <option value="Central African Republic">
                        Central African Republic
                      </option>
                      <option value="Chad">Chad</option>
                      <option value="Chile">Chile</option>
                      <option value="China">China</option>
                      <option value="Christmas Island">Christmas Island</option>
                      <option value="Cocos Islands">
                        Cocos (Keeling) Islands
                      </option>
                      <option value="Colombia">Colombia</option>
                      <option value="Comoros">Comoros</option>
                      <option value="Congo">Congo</option>
                      <option value="Congo">
                        Congo, the Democratic Republic of the
                      </option>
                      <option value="Cook Islands">Cook Islands</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Cota D'Ivoire">Cote d'Ivoire</option>
                      <option value="Croatia">Croatia (Hrvatska)</option>
                      <option value="Cuba">Cuba</option>
                      <option value="Cyprus">Cyprus</option>
                      <option value="Czech Republic">Czech Republic</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Djibouti">Djibouti</option>
                      <option value="Dominica">Dominica</option>
                      <option value="Dominican Republic">
                        Dominican Republic
                      </option>
                      <option value="East Timor">East Timor</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="Egypt">Egypt</option>
                      <option value="El Salvador">El Salvador</option>
                      <option value="Equatorial Guinea">
                        Equatorial Guinea
                      </option>
                      <option value="Eritrea">Eritrea</option>
                      <option value="Estonia">Estonia</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Falkland Islands">
                        Falkland Islands (Malvinas)
                      </option>
                      <option value="Faroe Islands">Faroe Islands</option>
                      <option value="Fiji">Fiji</option>
                      <option value="Finland">Finland</option>
                      <option value="France">France</option>
                      <option value="France Metropolitan">
                        France, Metropolitan
                      </option>
                      <option value="French Guiana">French Guiana</option>
                      <option value="French Polynesia">French Polynesia</option>
                      <option value="French Southern Territories">
                        French Southern Territories
                      </option>
                      <option value="Gabon">Gabon</option>
                      <option value="Gambia">Gambia</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Germany">Germany</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Gibraltar">Gibraltar</option>
                      <option value="Greece">Greece</option>
                      <option value="Greenland">Greenland</option>
                      <option value="Grenada">Grenada</option>
                      <option value="Guadeloupe">Guadeloupe</option>
                      <option value="Guam">Guam</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="Guinea">Guinea</option>
                      <option value="Guinea-Bissau">Guinea-Bissau</option>
                      <option value="Guyana">Guyana</option>
                      <option value="Haiti">Haiti</option>
                      <option value="Heard and McDonald Islands">
                        Heard and Mc Donald Islands
                      </option>
                      <option value="Holy See">
                        Holy See (Vatican City State)
                      </option>
                      <option value="Honduras">Honduras</option>
                      <option value="Hong Kong">Hong Kong</option>
                      <option value="Hungary">Hungary</option>
                      <option value="Iceland">Iceland</option>
                      <option value="India">India</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Iran">Iran (Islamic Republic of)</option>
                      <option value="Iraq">Iraq</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Israel">Israel</option>
                      <option value="Italy">Italy</option>
                      <option value="Jamaica">Jamaica</option>
                      <option value="Japan">Japan</option>
                      <option value="Jordan">Jordan</option>
                      <option value="Kazakhstan">Kazakhstan</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Kiribati">Kiribati</option>
                      <option value="Democratic People's Republic of Korea">
                        Korea, Democratic People's Republic of
                      </option>
                      <option value="Korea">Korea, Republic of</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Kyrgyzstan">Kyrgyzstan</option>
                      <option value="Lao">
                        Lao People's Democratic Republic
                      </option>
                      <option value="Latvia">Latvia</option>
                      <option value="Lebanon">Lebanon</option>
                      <option value="Lesotho">Lesotho</option>
                      <option value="Liberia">Liberia</option>
                      <option value="Libyan Arab Jamahiriya">
                        Libyan Arab Jamahiriya
                      </option>
                      <option value="Liechtenstein">Liechtenstein</option>
                      <option value="Lithuania">Lithuania</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Macau">Macau</option>
                      <option value="Macedonia">
                        Macedonia, The Former Yugoslav Republic of
                      </option>
                      <option value="Madagascar">Madagascar</option>
                      <option value="Malawi">Malawi</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Maldives">Maldives</option>
                      <option value="Mali">Mali</option>
                      <option value="Malta">Malta</option>
                      <option value="Marshall Islands">Marshall Islands</option>
                      <option value="Martinique">Martinique</option>
                      <option value="Mauritania">Mauritania</option>
                      <option value="Mauritius">Mauritius</option>
                      <option value="Mayotte">Mayotte</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Micronesia">
                        Micronesia, Federated States of
                      </option>
                      <option value="Moldova">Moldova, Republic of</option>
                      <option value="Monaco">Monaco</option>
                      <option value="Mongolia">Mongolia</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Morocco">Morocco</option>
                      <option value="Mozambique">Mozambique</option>
                      <option value="Myanmar">Myanmar</option>
                      <option value="Namibia">Namibia</option>
                      <option value="Nauru">Nauru</option>
                      <option value="Nepal">Nepal</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Netherlands Antilles">
                        Netherlands Antilles
                      </option>
                      <option value="New Caledonia">New Caledonia</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Niger">Niger</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Niue">Niue</option>
                      <option value="Norfolk Island">Norfolk Island</option>
                      <option value="Northern Mariana Islands">
                        Northern Mariana Islands
                      </option>
                      <option value="Norway">Norway</option>
                      <option value="Oman">Oman</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Palau">Palau</option>
                      <option value="Panama">Panama</option>
                      <option value="Papua New Guinea">Papua New Guinea</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Peru">Peru</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Pitcairn">Pitcairn</option>
                      <option value="Poland">Poland</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Puerto Rico">Puerto Rico</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Reunion">Reunion</option>
                      <option value="Romania">Romania</option>
                      <option value="Russia">Russian Federation</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Saint Kitts and Nevis">
                        Saint Kitts and Nevis
                      </option>
                      <option value="Saint Lucia">Saint LUCIA</option>
                      <option value="Saint Vincent">
                        Saint Vincent and the Grenadines
                      </option>
                      <option value="Samoa">Samoa</option>
                      <option value="San Marino">San Marino</option>
                      <option value="Sao Tome and Principe">
                        Sao Tome and Principe
                      </option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Senegal">Senegal</option>
                      <option value="Seychelles">Seychelles</option>
                      <option value="Sierra">Sierra Leone</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Slovakia">
                        Slovakia (Slovak Republic)
                      </option>
                      <option value="Slovenia">Slovenia</option>
                      <option value="Solomon Islands">Solomon Islands</option>
                      <option value="Somalia">Somalia</option>
                      <option value="South Africa">South Africa</option>
                      <option value="South Georgia">
                        South Georgia and the South Sandwich Islands
                      </option>
                      <option value="Span">Spain</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="St. Helena">St. Helena</option>
                      <option value="St. Pierre and Miguelon">
                        St. Pierre and Miquelon
                      </option>
                      <option value="Sudan">Sudan</option>
                      <option value="Suriname">Suriname</option>
                      <option value="Svalbard">
                        Svalbard and Jan Mayen Islands
                      </option>
                      <option value="Swaziland">Swaziland</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Syria">Syrian Arab Republic</option>
                      <option value="Taiwan">Taiwan, Province of China</option>
                      <option value="Tajikistan">Tajikistan</option>
                      <option value="Tanzania">
                        Tanzania, United Republic of
                      </option>
                      <option value="Thailand">Thailand</option>
                      <option value="Togo">Togo</option>
                      <option value="Tokelau">Tokelau</option>
                      <option value="Tonga">Tonga</option>
                      <option value="Trinidad and Tobago">
                        Trinidad and Tobago
                      </option>
                      <option value="Tunisia">Tunisia</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Turkmenistan">Turkmenistan</option>
                      <option value="Turks and Caicos">
                        Turks and Caicos Islands
                      </option>
                      <option value="Tuvalu">Tuvalu</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="United Arab Emirates">
                        United Arab Emirates
                      </option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States Minor Outlying Islands">
                        United States Minor Outlying Islands
                      </option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Uzbekistan">Uzbekistan</option>
                      <option value="Vanuatu">Vanuatu</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Vietnam">Viet Nam</option>
                      <option value="Virgin Islands (British)">
                        Virgin Islands (British)
                      </option>
                      <option value="Virgin Islands (U.S)">
                        Virgin Islands (U.S.)
                      </option>
                      <option value="Wallis and Futana Islands">
                        Wallis and Futuna Islands
                      </option>
                      <option value="Western Sahara">Western Sahara</option>
                      <option value="Yemen">Yemen</option>
                      <option value="Serbia">Serbia</option>
                      <option value="Zambia">Zambia</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                    </select>
                  </div>
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor={`division${form.id}`}
                      className="text-lg mb-1"
                    >
                      Division
                    </label>
                    <select
                      name={`division${form.id}`}
                      id={`division${form.id}`}
                      value={eduInfo.Devision[ind]}
                      onChange={(e) => {
                        const updatedDivisionNames = [...eduInfo.Devision];
                        updatedDivisionNames[ind] = e.target.value;
                        setEduInfo({
                          ...eduInfo,
                          Devision: updatedDivisionNames,
                        });
                      }}
                      className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                    >
                      <option value="first">First</option>
                      <option value="second">Second</option>
                      <option value="third">Third</option>
                      <option value="forth">Forth</option>
                    </select>
                  </div>
                </div>
              </>
            ))}
          </div>
          <div className="flex justify-end mx-20 mb-8">
            <button
              type="submit"
              className={
                loading
                  ? `px-6 py-2 text-gray-300 rounded-md font-semibold bg-inherit`
                  : `cursor-pointer px-6 py-2 text-lg font-semibold text-blue-500 bg-inherit border border-solid border-gray-300 rounded-md shadow-md`
              }
            >
              Update
            </button>
          </div>
        </>
      ) : (
        <div className="text-lg sm:text-2xl font-semibold sm:font-bold text-center my-10 text-gray-600 ">
          Data Loading...
        </div>
      )}
    </form>
  );
};

const SkillDetails = () => {
  const [selectedSkill, setSelectedSkill] = useState({
    technology_name: [],
    ratings: [],
  });

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [skillForms, setSkillForms] = useState([]);

  const addSkillForm = () => {
    setSkillForms([...skillForms, { id: skillForms.length + 1 }]);
  };
  const handleSubmit4 = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillData = skillForms.map((form, index) => ({
        technology_name: selectedSkill.technology_name[index],
        ratings: selectedSkill.ratings[index],
      }));
      const response = await axios.post(
        "/experts/update/",
        {
          action: 3,
          skill_json: skillData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      const data = response.data;
      setLoading(false);
      if (!data || data.status === 400 || data.status === 401) {
        alert(data.message);
        return;
      }
      console.log(data, skillData);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getSkillInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/experts/?action=1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonData.access_token}`,
        },
      });
      const data = response.data;
      setLoading(false);
      if (!data || data.status === 400 || data.status === 401) {
        alert(data.message);
        return;
      }
      console.log(response.data.data);
      const skillData = response.data.data.skills;
      console.log(skillData);
      setSkillForms(skillData.map((form, index) => ({ id: index + 1 })));

      const updatedTechNames = [];
      const updatedRatings = [];

      skillData.forEach((form) => {
        updatedTechNames.push(form.technology_name);
        updatedRatings.push(form.ratings);
      });

      setSelectedSkill({
        technology_name: updatedTechNames,
        ratings: updatedRatings,
      });
      setDataLoading(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSkillInfo();
  }, []);

  const removeSkillForm = (id) => {
    const updatedSkillForms = skillForms.filter((form) => form.id !== id);
    setSkillForms(updatedSkillForms);
    setSelectedSkill((prevSkill) => {
      const updatedTechNames = [...prevSkill.technology_name];
      const updatedRatings = [...prevSkill.ratings];
      updatedTechNames.splice(id - 1, 1);
      updatedRatings.splice(id - 1, 1);
      return {
        ...prevSkill,
        technology_name: updatedTechNames,
        ratings: updatedRatings,
      };
    });
  };

  return (
    <form onSubmit={handleSubmit4} className="grow h-full flex flex-col">
      {!dataLoading ? (
        <div className="text-lg sm:text-2xl font-semibold sm:font-bold text-center my-10 text-gray-600 ">
          Data Loading...
        </div>
      ) : (
        <>
          <div className="flex justify-center mx-auto flex-col w-[65%] my-8">
            <button
              onClick={(e) => {
                e.preventDefault();
                addSkillForm();
              }}
              className="underline cursor-pointer text-gray-400 bg-inherit hover:text-gray-700"
            >
              + Add Skill
            </button>
            {skillForms.map((form, ind) => (
              <>
                <div key={form.id} className="flex justify-between">
                  <p className="font-bold text-lg">Skill {ind + 1}</p>
                  <button
                    onClick={() => removeSkillForm(form.id)}
                    className="underline cursor-pointer text-red-400 bg-inherit hover:text-red-600"
                  >
                    - Remove Skill
                  </button>
                </div>
                <label
                  htmlFor={`technology${form.id}`}
                  className="text-lg mb-1"
                >
                  Technology Name
                </label>
                <input
                  type="text"
                  id={`technology${form.id}`}
                  name={`technology${form.id}`}
                  value={selectedSkill.technology_name[ind]}
                  onChange={(e) => {
                    const updatedTechNames = [...selectedSkill.technology_name];
                    updatedTechNames[ind] = e.target.value;
                    setSelectedSkill({
                      ...selectedSkill,
                      technology_name: updatedTechNames,
                    });
                  }}
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                  placeholder="Technology Name"
                />
                <label htmlFor={`rating${form.id}`} className="text-lg mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  id={`rating${form.id}`}
                  name={`rating${form.id}`}
                  value={selectedSkill.ratings[ind]}
                  onChange={(e) => {
                    const updatedRatings = [...selectedSkill.ratings];
                    updatedRatings[ind] = e.target.value;
                    setSelectedSkill({
                      ...selectedSkill,
                      ratings: updatedRatings,
                    });
                  }}
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4 w-[50%]"
                  placeholder="1"
                />
              </>
            ))}
          </div>
          <div className="flex justify-end mx-20 mb-8">
            <button
              type="submit"
              className={
                loading
                  ? `px-6 py-2 text-gray-300 rounded-md font-semibold bg-inherit`
                  : `cursor-pointer px-6 py-2 text-lg font-semibold text-blue-500 bg-inherit border border-solid border-gray-300 rounded-md shadow-md`
              }
            >
              Update
            </button>
          </div>
        </>
      )}
    </form>
  );
};

const AchDetails = () => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [achInfo, setAchInfo] = useState({
    name: [],
    year: [],
    certificate: [],
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadCertificateProgress, setUploadCertificateProgress] = useState(0);

  const [achForms, setAchForms] = useState([]);

  const addAchForm = () => {
    setAchForms([...achForms, { id: achForms.length + 1 }]);
    setAchInfo((prevAchInfo) => ({
      ...prevAchInfo,
      name: [...prevAchInfo.name, ""],
      year: [...prevAchInfo.year, ""],
      certificate: [...prevAchInfo.certificate, ""],
    }));
  };

  const [selectedCertificate, setSelectedCertificate] = useState([]);

  const [imageLoading, setImageLoading] = useState(false);

  const handleCertificateChange = async (e, ind) => {
    setImageLoading(true);
    const url = await handleUploadImage(
      e.target.files[0],
      e.target.files[0].name
    );
    console.log(url);
    setSelectedCertificate((prevSelectedCertificates) => {
      const updatedSelectedCertificates = [...prevSelectedCertificates];
      updatedSelectedCertificates[ind] = url;
      return updatedSelectedCertificates;
    });
    setAchInfo((prevAchInfo) => {
      const updatedCertificates = [...prevAchInfo.certificate];
      updatedCertificates[ind] = url;
      return { ...prevAchInfo, certificate: updatedCertificates };
    });
    setImageLoading(false);
  };

  const handleRemoveCertificate = (ind) => {
    const updatedSelectedCertificates = [...selectedCertificate];
    updatedSelectedCertificates[ind] = null;
    setSelectedCertificate(updatedSelectedCertificates);
    const updatedCertificates = [...achInfo.certificate];
    updatedCertificates[ind] = null;
    setAchInfo({ ...achInfo, certificate: updatedCertificates });
  };

  const getAchForm = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/experts/?action=1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonData.access_token}`,
        },
      });
      const data = response.data;
      if (!data || data.status === 400 || data.status === 401) {
        console.log(data);
        return;
      }
      console.log(response.data.data);
      setLoading(false);
      const achData = response.data.data.achievements;
      console.log(achData);

      setAchForms(achData.map((form, index) => ({ id: index + 1 })));

      const updatedNames = [];
      const updatedYears = [];
      const updatedCertificates = [];

      achData.forEach((form) => {
        updatedNames.push(form.name);
        updatedYears.push(form.year);
        updatedCertificates.push(form.certificate);
      });

      setAchInfo({
        name: updatedNames,
        year: updatedYears,
        certificate: updatedCertificates,
      });

      setSelectedCertificate(updatedCertificates);

      setDataLoading(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAchForm();
  }, []);

  const handleSubmit4 = async (e) => {
    console.log(achInfo);
    console.log(selectedCertificate);
    e.preventDefault();
    setLoading(true);
    try {
      const achData = achForms.map((form, index) => ({
        name: achInfo.name[index],
        year: achInfo.year[index],
        certificate: achInfo.certificate[index],
      }));
      const response = await axios.post(
        "/experts/update/",
        {
          action: 7,
          achievements_json: achData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      const data = response.data;
      setLoading(false);
      if (!data || data.status === 400 || data.status === 401) {
        console.log(data.message);
        return;
      }
      console.log(data, achData);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const removeAchForm = (id) => {
    const updatedAchForms = achForms.filter((form) => form.id !== id);
    setAchForms(updatedAchForms);
    setAchInfo((prevAchInfo) => {
      const updatedNames = [...prevAchInfo.name];
      const updatedYears = [...prevAchInfo.year];
      const updatedCertificates = [...prevAchInfo.certificate];

      updatedNames.splice(id - 1, 1);
      updatedYears.splice(id - 1, 1);
      updatedCertificates.splice(id - 1, 1);

      return {
        ...prevAchInfo,
        name: updatedNames,
        year: updatedYears,
        certificate: updatedCertificates,
      };
    });
  };

  return (
    <form onSubmit={handleSubmit4} className="grow h-full flex flex-col">
      {!dataLoading ? (
        <div className="text-lg sm:text-2xl font-semibold sm:font-bold text-center my-10 text-gray-600 ">
          Data Loading...
        </div>
      ) : (
        <>
          <div className="flex justify-center mx-auto flex-col w-[65%] my-8">
            <button
              onClick={(e) => {
                e.preventDefault();
                addAchForm();
              }}
              className="underline cursor-pointer text-gray-400 bg-inherit hover:text-gray-700"
            >
              + Add Achievment
            </button>
            {achForms.map((form, ind) => (
              <>
                <div key={form.id} className="flex justify-between">
                  <p className="font-bold text-lg">Achievement {ind + 1}</p>
                  <button
                    onClick={() => removeAchForm(form.id)}
                    className="underline cursor-pointer text-red-400 bg-inherit hover:text-red-600"
                  >
                    - Remove Achievement
                  </button>
                </div>
                <label htmlFor={`name${form.id}`} className="text-lg mb-1">
                  Achievement Name
                </label>
                <input
                  type="text"
                  id={`name${form.id}`}
                  name={`name${form.id}`}
                  value={achInfo.name[ind]}
                  onChange={(e) => {
                    const updatedTechNames = [...achInfo.name];
                    updatedTechNames[ind] = e.target.value;
                    setAchInfo({
                      ...achInfo,
                      name: updatedTechNames,
                    });
                  }}
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                  placeholder="Achievement Name"
                />
                <label htmlFor={`year${form.id}`} className="text-lg mb-1">
                  Achievement Year
                </label>
                <input
                  type="number"
                  id={`year${form.id}`}
                  name={`year${form.id}`}
                  value={achInfo.year[ind]}
                  onChange={(e) => {
                    const updatedRatings = [...achInfo.year];
                    updatedRatings[ind] = e.target.value;
                    setAchInfo({
                      ...achInfo,
                      year: updatedRatings,
                    });
                  }}
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4 w-full"
                  placeholder="Enter Year"
                />
                <label
                  className="text-lg mb-1 flex gap-1"
                  htmlFor={`certificate${form.id}`}
                >
                  Certificate
                </label>
                <div
                  className="flex flex-col justify-center items-center border border-dashed border-[#1475cf] h-[200px] w-full cursor-pointer rounded-lg"
                  onClick={() =>
                    document.querySelector(`#certificate${form.id}`).click()
                  }
                >
                  <input
                    type="file"
                    name={`certificate${form.id}`}
                    id={`certificate${form.id}`}
                    className="hidden"
                    onChange={(e) => handleCertificateChange(e, ind)}
                    aria-label="Upload certificate for achievement"
                  />
                  {imageLoading ? (
                    <div className="flex w-full h-full items-center justify-center text-center">
                      <span>Loading...</span>
                    </div>
                  ) : selectedCertificate[ind] ? (
                    <div className="w-full max-w-sm mx-auto shrink-0 p-2 py-4 flex justify-center items-center">
                      <img
                        src={selectedCertificate[ind]}
                        alt="Preview"
                        className="w-auto h-40 shrink-0 object-cover object-center m-2"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-600">
                      <FiUpload className="w-10 h-10" />
                      <span className="ml-2">Upload Image</span>
                    </div>
                  )}
                </div>
              </>
            ))}
          </div>
          <div className="flex justify-end mx-20 mb-8">
            <button
              type="submit"
              className={
                loading
                  ? `px-6 py-2 text-gray-300 rounded-md font-semibold bg-inherit`
                  : `cursor-pointer px-6 py-2 text-lg font-semibold text-blue-500 bg-inherit border border-solid border-gray-300 rounded-md shadow-md`
              }
            >
              Update
            </button>
          </div>
        </>
      )}
    </form>
  );
};

const ExperienceDetails = () => {
  const [loading, setLoading] = useState(false);
  const [expInfo, setExpInfo] = useState({
    company_name: [],
    start_date: [],
    end_date: [],
    designation: [],
  });

  const [experienceForms, setExperienceForms] = useState([]);

  const addExperienceForm = () => {
    setExperienceForms([
      ...experienceForms,
      { id: experienceForms.length + 1 },
    ]);
  };
  const handleSubmit6 = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const response = await fetch("http://localhost:8000/experts/update/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     action: 5,
      //     experience_json: [
      //       {
      //         company_name: expInfo.company_name,
      //         start_date: expInfo.start_date,
      //         end_date: expInfo.end_date,
      //         designation: expInfo.designation,
      //       },
      //     ],
      //   }),
      //   credentials: "include",
      // });
      // const json = await response.json();
      // console.log(json);
      const experienceData = experienceForms.map((form, index) => ({
        company_name: expInfo.company_name[index],
        start_date: expInfo.start_date[index],
        end_date: expInfo.end_date[index],
        designation: expInfo.designation[index],
      }));
      const response = await axios.post(
        "/experts/update/",
        {
          action: 4,
          experience_json: experienceData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      const data = response.data;
      setLoading(false);
      if (!data || data.status === 400 || data.status === 401) {
        alert(data.message);
        return;
      }
      console.log(data, experienceData);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getExpInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/experts/?action=1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonData.access_token}`,
        },
      });
      const data = response.data;
      setLoading(false);
      if (!data || data.status === 400 || data.status === 401) {
        alert(data);
        return;
      }
      console.log(response.data.data);
      const expData = response.data.data.experience;
      console.log(expData);

      setExperienceForms(expData.map((form, index) => ({ id: index + 1 })));

      const updatedCompName = [];
      const updatedStartDate = [];
      const updatedEndDate = [];
      const updatedDesignation = [];

      expData.forEach((form) => {
        updatedCompName.push(form.company_name);
        updatedStartDate.push(form.start_date);
        updatedEndDate.push(form.is_present ? "" : form.end_date);
        updatedDesignation.push(form.designation);
      });

      setExpInfo({
        company_name: updatedCompName,
        start_date: updatedStartDate,
        end_date: updatedEndDate,
        designation: updatedDesignation,
      });
      setDataLoading(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getExpInfo();
  }, []);

  const removeExpForm = (id) => {
    const updatedExpForms = experienceForms.filter((form) => form.id !== id);

    setExperienceForms(updatedExpForms);
    setExpInfo((prevExpInfo) => {
      const updatedCompName = [...prevExpInfo.company_name];
      const updatedStartDate = [...prevExpInfo.start_date];
      const updatedEndDate = [...prevExpInfo.end_date];
      const updatedDesignation = [...prevExpInfo.designation];
      updatedCompName.splice(id - 1, 1);
      updatedStartDate.splice(id - 1, 1);
      updatedEndDate.splice(id - 1, 1);
      updatedDesignation.splice(id - 1, 1);
      return {
        ...prevExpInfo,
        company_name: updatedCompName,
        start_date: updatedStartDate,
        end_date: updatedEndDate,
        designation: updatedDesignation,
      };
    });
  };

  const [dataLoading, setDataLoading] = useState(false);

  return (
    <form onSubmit={handleSubmit6} className="flex flex-col grow h-full">
      {!dataLoading ? (
        <div className="text-lg sm:text-2xl font-semibold sm:font-bold text-center my-10 text-gray-600 ">
          Data Loading...
        </div>
      ) : (
        <>
          <div className="flex justify-center mx-auto flex-col w-[65%] my-8">
            <button
              onClick={(e) => {
                e.preventDefault();
                addExperienceForm();
              }}
              className="underline cursor-pointer text-gray-400 bg-inherit hover:text-gray-700"
            >
              + Add Experience
            </button>
            {experienceForms.map((form, ind) => (
              <>
                <div key={form.id} className="flex justify-between">
                  <p className="font-bold text-lg">Experience {ind + 1}</p>
                  <button
                    onClick={() => removeExpForm(form.id)}
                    className="underline cursor-pointer text-red-400 bg-inherit hover:text-red-600"
                  >
                    - Remove Experience
                  </button>
                </div>
                <label htmlFor={`company${form.id}`} className="text-lg mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id={`company${form.id}`}
                  name={`company${form.id}`}
                  value={expInfo.company_name[ind]}
                  onChange={(e) => {
                    const updatedCompany = [...expInfo.company_name];
                    updatedCompany[ind] = e.target.value;
                    setExpInfo({
                      ...expInfo,
                      company_name: updatedCompany,
                    });
                  }}
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                  placeholder="Company Name"
                />
                <div className="flex justify-around gap-5">
                  <div className="flex flex-col w-full">
                    <label htmlFor={`start${form.id}`} className="text-lg mb-1">
                      Start Year
                    </label>
                    <input
                      type="date"
                      id={`start${form.id}`}
                      name={`start${form.id}`}
                      value={expInfo.start_date[ind]}
                      className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const year = selectedDate.getFullYear();
                        const month = String(
                          selectedDate.getMonth() + 1
                        ).padStart(2, "0");
                        const day = String(selectedDate.getDate()).padStart(
                          2,
                          "0"
                        );
                        const formattedDate = `${year}-${month}-${day}`;
                        const updatedStartDate = [...expInfo.start_date];
                        updatedStartDate[ind] = formattedDate;
                        setExpInfo({
                          ...expInfo,
                          start_date: updatedStartDate,
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor={`end${form.id}`} className="text-lg mb-1">
                      End Year
                    </label>
                    <input
                      type="date"
                      id={`end${form.id}`}
                      name={`end${form.id}`}
                      value={expInfo.end_date[ind]}
                      className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const year = selectedDate.getFullYear();
                        const month = String(
                          selectedDate.getMonth() + 1
                        ).padStart(2, "0");
                        const day = String(selectedDate.getDate()).padStart(
                          2,
                          "0"
                        );
                        const formattedDate = `${year}-${month}-${day}`;
                        const updatedEndDate = [...expInfo.end_date];
                        updatedEndDate[ind] = formattedDate;
                        setExpInfo({
                          ...expInfo,
                          end_date: updatedEndDate,
                        });
                      }}
                    />
                  </div>
                </div>
                <label
                  htmlFor={`designtaion${form.id}`}
                  className="text-lg mb-1"
                >
                  Designation
                </label>
                <input
                  type="text"
                  id={`designtaion${form.id}`}
                  name={`designtaion${form.id}`}
                  value={expInfo.designation[ind]}
                  onChange={(e) => {
                    const updatedDesignation = [...expInfo.designation];
                    updatedDesignation[ind] = e.target.value;
                    setExpInfo({
                      ...expInfo,
                      designation: updatedDesignation,
                    });
                  }}
                  className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
                  placeholder="Designtaion"
                />
              </>
            ))}
          </div>
          <div className="flex justify-end mx-20 mb-8">
            <button
              type="submit"
              className={
                loading
                  ? `px-6 py-2 text-gray-300 rounded-md font-semibold bg-inherit`
                  : `cursor-pointer px-6 py-2 text-lg font-semibold text-blue-500 bg-inherit border border-solid border-gray-300 rounded-md shadow-md`
              }
            >
              Update
            </button>
          </div>
        </>
      )}
    </form>
  );
};

const AccDetails = () => {
  const [accInfo, setAccInfo] = useState({
    account_holder: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit7 = async (e) => {
    e.preventDefault();
    const cookies = document.cookie.split("; ");
    const jsonData = {};

    cookies.forEach((item) => {
      const [key, value] = item.split("=");
      jsonData[key] = value;
    });

    setLoading(true);
    try {
      // const response = await fetch("http://localhost:8000/experts/update/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     action: 6,
      //     account_holder: accInfo.account_holder,
      //     bank_name: accInfo.bank_name,
      //     account_number: accInfo.account_number,
      //     ifsc_code: accInfo.ifsc_code,
      //   }),
      //   credentials: "include",
      // });
      // const json = await response.json();
      // console.log(json);
      const response = await axios.post(
        "/experts/update/",
        {
          action: 5,
          account_holder: accInfo.account_holder,
          bank_name: accInfo.bank_name,
          account_number: accInfo.account_number,
          ifsc_code: accInfo.ifsc_code,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      const data = response.data;
      setLoading(false);
      if (!data || data.status === 400 || data.status === 401) {
        alert(data.message);
        return;
      }
      console.log(data, accInfo);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getAccInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/experts/?action=1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonData.access_token}`,
        },
      });
      const data = response.data;
      setLoading(false);
      if (!data || data.status === 400 || data.status === 401) {
        alert(data.message);
        return;
      }
      console.log(response.data.data);
      setAccInfo({
        ...accInfo,
        account_holder: response.data.data.account_holder,
        bank_name: response.data.data.bank_name,
        account_number: response.data.data.account_number,
        ifsc_code: response.data.data.ifsc_code,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccInfo();
  }, []);

  return (
    <form onSubmit={handleSubmit7} className="flex flex-col grow h-full">
      <div className="flex justify-center mx-auto flex-col w-[65%] my-8">
        <div className="flex flex-col w-full">
          <label htmlFor="holderName" className="text-lg mb-1">
            Account Holder Name
          </label>
          <input
            type="text"
            id="holderName"
            name="holderName"
            required
            value={accInfo.account_holder}
            onChange={(e) => setAccInfo({ account_holder: e.target.value })}
            className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
            placeholder="Account Holder Name"
          />
          <label htmlFor="bankName" className="text-lg mb-1">
            Bank Name
          </label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            required
            value={accInfo.bank_name}
            onChange={(e) => setAccInfo({ bank_name: e.target.value })}
            className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
            placeholder="Bank Name"
          />
          <label htmlFor="accNumber" className="text-lg mb-1">
            Account Number
          </label>
          <input
            type="number"
            id="accNumber"
            name="accNumber"
            required
            value={accInfo.account_number}
            onChange={(e) => setAccInfo({ account_number: e.target.value })}
            className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
            placeholder="Account Number"
          />
          <label htmlFor="ifsc" className="text-lg mb-1">
            IFSC Code
          </label>
          <input
            type="text"
            id="ifsc"
            name="ifsc"
            required
            value={accInfo.ifsc_code}
            onChange={(e) => setAccInfo({ ifsc_code: e.target.value })}
            className="border border-solid border-gray-300 px-2 py-2 rounded-md mb-4"
            placeholder="IFSC Code"
          />
        </div>
      </div>
      <div className="flex justify-end mx-20 mb-8">
        <button
          type="submit"
          className={
            loading
              ? `px-6 py-2 text-gray-300 rounded-md font-semibold bg-inherit`
              : `cursor-pointer px-6 py-2 text-lg font-semibold text-blue-500 bg-inherit border border-solid border-gray-300 rounded-md shadow-md`
          }
        >
          Update
        </button>
      </div>
    </form>
  );
};

const EditProfileExpert = () => {
  const categoryRef = useRef(null);
  const [currStep, setCurrStep] = useState(0);
  const scrollLeft = () => {
    categoryRef.current.scrollBy({
      left: -150, // Adjust scroll amount as needed
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    categoryRef.current.scrollBy({
      left: 150, // Adjust scroll amount as needed
      behavior: "smooth",
    });
  };

  return (
    <div className="h-auto bg-white w-[68%]">
      <div className="text-xl font-bold border-b border-solid border-slate-200 pb-3">
        Update Profile
      </div>
      <div className=" w-full flex md:flex-col border border-solid border-slate-300 mx-auto rounded-sm mt-5">
        <div className="flex h-full justify-between w-full items-center px-2">
          <BiSolidCaretLeftSquare
            className=" shrink-0 border border-slate-300 border-solid mx-2"
            size={32}
            onClick={scrollLeft}
          />
          <div
            ref={categoryRef}
            className=" w-full flex bg-white justify-start overflow-x-scroll"
          >
            <button
              className={`w-fit shrink-0 text-sm md:text-base py-1 px-2 border-b border-solid border-slate-300 ${
                currStep === 0 ? " bg-white" : "bg-inherit text-black"
              }`}
            >
              <div
                onClick={() => setCurrStep(0)}
                className={`px-3 py-2 text-black rounded-md font-semibold cursor-pointer ${
                  currStep === 0 ? "bg-[#ececec]" : "bg-white"
                }`}
              >
                Personal Details
              </div>
            </button>
            <button
              className={`w-fit shrink-0 text-sm md:text-base p-5 border-b border-solid border-slate-300 ${
                currStep === 1 ? " bg-white" : "bg-inherit text-black "
              }`}
            >
              <div
                onClick={() => setCurrStep(1)}
                className={`px-3 py-2 text-black rounded-md font-semibold cursor-pointer ${
                  currStep === 1 ? "bg-[#ececec]" : "bg-white"
                }`}
              >
                General Details
              </div>
            </button>
            <button
              className={`w-fit shrink-0 text-sm md:text-base p-5 border-b border-solid border-slate-300 ${
                currStep === 2 ? " bg-white" : "bg-inherit text-black "
              }`}
            >
              <div
                onClick={() => setCurrStep(2)}
                className={`px-3 py-2 text-black rounded-md font-semibold cursor-pointer ${
                  currStep === 2 ? "bg-[#ececec]" : "bg-white"
                }`}
              >
                Education
              </div>
            </button>
            <button
              className={`w-fit shrink-0 text-sm md:text-base p-5 border-b border-solid border-slate-300 ${
                currStep === 3 ? "bg-white" : "bg-inherit text-black "
              }`}
            >
              <div
                onClick={() => setCurrStep(3)}
                className={`px-3 py-2 text-black rounded-md font-semibold cursor-pointer ${
                  currStep === 3 ? "bg-[#ececec]" : "bg-white"
                }`}
              >
                Skill Set
              </div>
            </button>
            <button
              className={`w-fit shrink-0 text-sm md:text-base p-5 border-b border-solid border-slate-300  ${
                currStep === 4 ? "bg-white" : "bg-inherit text-black"
              }`}
            >
              <div
                onClick={() => setCurrStep(4)}
                className={`px-3 py-2 text-black rounded-md font-semibold cursor-pointer ${
                  currStep === 4 ? "bg-[#ececec]" : "bg-white"
                }`}
              >
                Achievements
              </div>
            </button>
            <button
              className={`w-fit shrink-0 text-sm md:text-base p-5 border-b border-solid border-slate-300  ${
                currStep === 5 ? "bg-white" : "bg-inherit text-black"
              }`}
            >
              <div
                onClick={() => setCurrStep(5)}
                className={`px-3 py-2 text-black rounded-md font-semibold cursor-pointer ${
                  currStep === 5 ? "bg-[#ececec]" : "bg-white"
                }`}
              >
                Experience
              </div>
            </button>
            <button
              className={`w-fit shrink-0 text-sm md:text-base p-5 border-b border-solid border-slate-300  ${
                currStep === 6 ? "bg-white" : "bg-inherit text-black"
              }`}
            >
              <div
                onClick={() => setCurrStep(6)}
                className={`px-3 py-2 text-black rounded-md font-semibold cursor-pointer ${
                  currStep === 6 ? "bg-[#ececec]" : "bg-white"
                }`}
              >
                Account Details
              </div>
            </button>
          </div>
          <BiSolidCaretRightSquare
            className=" h-full left-0 shrink-0 border border-slate-300 border-solid mx-2"
            size={32}
            onClick={scrollRight}
          />
        </div>
        {currStep === 0 && <GeneralDetails />}
        {currStep === 1 && <PersonalDetails />}
        {currStep === 2 && <EducationDetails />}
        {currStep === 3 && <SkillDetails />}
        {currStep === 4 && <AchDetails />}
        {currStep === 5 && <ExperienceDetails />}
        {currStep === 6 && <AccDetails />}
      </div>
    </div>
  );
};

export default EditProfileExpert;
