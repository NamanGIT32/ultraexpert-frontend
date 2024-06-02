import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { modules, formats } from "../../subsitutes/EditorToolbar";
import { BsUpload } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import axios from "../../axios";
import DOMPurify from "dompurify";
import { imageDB } from "../firebase/config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const [preview, setPreview] = useState(false);
  const params = useParams();
  console.log(params.id);
  // code for uploading image for blog starts
  //   const [selectedFile, setSelectedFile] = useState(null);
  //   const [uploadBannerProgress, setUploadBannerProgress] = useState(0);
  //   const handleFileChange = async (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       const imgRef = ref(imageDB, `UltraXpertImgFiles/${v4()}`);
  //       const uploadTask = uploadBytesResumable(imgRef, file);
  //       uploadTask.on(
  //         "state_changed",
  //         (snapshot) => {
  //           // Get upload progress as a percentage
  //           const progress = Math.round(
  //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //           );
  //           setUploadBannerProgress(progress);
  //         },
  //         (error) => {
  //           console.error("Error uploading image: ", error);
  //           // Handle error if needed
  //         },
  //         () => {
  //           // Upload completed successfully
  //           console.log("Upload complete");
  //         }
  //       );
  //       try {
  //         await uploadTask;
  //         const url = await getDownloadURL(uploadTask.snapshot.ref);
  //         console.log(url);
  //         setBlogData({ ...blogData, image: [url] });
  //         setSelectedFile(url);
  //         console.log(blogData);
  //       } catch (error) {
  //         console.error("Error uploading image: ", error);
  //         // Handle error if needed
  //         alert("Something went wrong");
  //       }

  //       reader.onload = () => {
  //         setSelectedFile(reader.result);
  //         reader.readAsDataURL(file);
  //       };
  //     } else {
  //       // Handle the case where the user cancels the file selection
  //       setSelectedFile(null);
  //     }
  //   };
  //   const removeImage = () => {
  //     setSelectedFile(null);
  //     setUploadBannerProgress(0);
  //     setBlogData({ ...blogData, image: [] });
  //   };
  // code for uploading image for blog ends

  const [categoriesArray, setCategoriesArray] = useState([]);
  const [filterCategoriesArray, setFilterCategoriesArray] = useState([]);

  //   console.log(value2);

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

  const [value2, setValue2] = useState({
    name: "",
    number: "",
  });

  const [allBlogData, setAllBlogData] = useState({});

  const getBlogData = async () => {
    const cookie = document.cookie.split("; ");
    const jsonData = {};

    cookie.forEach((item) => {
      const [key, value] = item.split("=");
      jsonData[key] = value;
    });
    try {
      const res = await axios.get(`/blogs/?action=3&blog_id=${params.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonData.access_token}`,
        },
      });
      console.log(res.data);
      console.log(res.data.data);
      const json = res.data.data;
      setAllBlogData(json);
      setValue2({
        ...value2,
        name: json.blog_category.category,
      });
      setSelectedSkill(json.tags_list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlogData();
  }, []);
  const getCategories = async () => {
    const cookies = document.cookie.split("; ");
    const jsonData = {};
    cookies.forEach((item) => {
      const [key, value] = item.split("=");
      jsonData[key] = value;
    });
    try {
      const response = await axios.get("/blogs/?action=4", {
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
        console.log("Something went wrong");
        return;
      }
      const allData = response.data.data;
      setCategoriesArray(allData);
      setFilterCategoriesArray(allData);
      console.log(categoriesArray);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCategoryChange = (e) => {
    const searchVal = e.target.value.toLowerCase();
    setCategoryInputValue(searchVal);
    setValue2({ ...value2, name: e.target.value });
    setFilterCategoriesArray(
      categoriesArray.filter((item) => {
        return item?.name?.toLowerCase().includes(searchVal);
      })
    );
  };

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

  const handleRemove = (skill) => {
    setSelectedSkill(selectedSkill.filter((s) => s !== skill));
  };

  const handleNewSkillAdd = (value) => {
    if (!selectedSkill.includes(value)) {
      setSelectedSkill([...selectedSkill, value]);
    }
    setInputValue("");
  };

  const setNewCategory = async (e) => {
    e.preventDefault();
    const cookies = document.cookie.split("; ");
    const jsonData = {};
    cookies.forEach((item) => {
      const [key, value] = item.split("=");
      jsonData[key] = value;
    });
    console.log(value2?.name);
    console.log(value2.number);
    try {
      const res = await axios.post(
        "/blogs/",
        {
          action: 1,
          category_name: value2.name,
          img_url: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      const data = res.data;
      if (!data || data.status === 400 || data.status === 401) {
        console.log("Something went wrong");
        return;
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  //   const [content, setContent] = useState(allBlogData.content);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadBannerProgress, setUploadBannerProgress] = useState(0);
  const removeImage = () => {
    setSelectedFile(null);
    setUploadBannerProgress(0);
    setAllBlogData({ ...allBlogData, images_list: [] });
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
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
          setUploadBannerProgress(progress);
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
      try {
        await uploadTask;
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        console.log(url);
        setAllBlogData({ ...allBlogData, images_list: [url] });
        setSelectedFile(url);
        console.log(allBlogData);
      } catch (error) {
        console.error("Error uploading image: ", error);
        // Handle error if needed
        alert("Something went wrong");
      }

      reader.onload = () => {
        setSelectedFile(reader.result);
        reader.readAsDataURL(file);
      };
    } else {
      // Handle the case where the user cancels the file selection
      setSelectedFile(null);
    }
  };
  const blogCreated = async (e) => {
    e.preventDefault();
    const cookie = document.cookie.split("; ");
    const jsonData = {};
    cookie.forEach((item) => {
      const [key, value] = item.split("=");
      jsonData[key] = value;
    });
    // console.log(value2?.number);
    // console.log(blogData);
    // console.log(value);
    // console.log(blogData.title);
    // console.log(blogData.service_ll);
    setLoading(true);
    try {
      const res = await axios.post(
        "/blogs/",
        {
          action: 3,
          id: allBlogData.id,
          blog_title: allBlogData.title,
          content_json: allBlogData.content,
          category_id: value2.number,
          service_link_list: [],
          image_url_list: allBlogData.images_list,
          tags_list: selectedSkill,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jsonData.access_token}`,
          },
        }
      );
      const data = res.data;
      if (!data || data.status === 400 || data.status === 401) {
        console.log("Something went wrong");
        return;
      }
      setLoading(false);
      alert("Blog Updated");
      console.log(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const[loading, setLoading] = useState(false);

  console.log(allBlogData);

  const [categoryInputValue, setCategoryInputValue] = useState("");
  const navigate = useNavigate();
  return (
    <div className="mt-[100px] mx-[7vw] ">
      <div className="md:flex items-start gap-10 ">
        <div className="w-full">
          <div>
            <div className="text-lg font-bold">Blog Title</div>
            <input
              type="text"
              placeholder="Enter title"
              value={allBlogData.title}
              onChange={(e) =>
                setAllBlogData({ ...allBlogData, title: e.target.value })
              }
              className="w-full mt-1 border border-solid border-gray-200 p-2 text-sm rounded-sm focus:outline-none"
            />
          </div>
          <div className="mt-5 relative overflow-visible">
            <div className="text-lg font-bold">Category</div>
            <input
              type="text"
              placeholder="Enter category"
              name=""
              id=""
              value={value2?.name}
              onChange={(e) => handleCategoryChange(e)}
              onFocus={() => getCategories()}
              className="w-full mt-1 border border-solid border-gray-200 p-2 text-sm rounded-sm focus:outline-none"
            />
            {categoriesArray.length > 0 && (
              <div
                className={`  px-1 text-sm rounded-sm mt-2 w-fit min-h-auto max-h-[150px] overflow-y-auto ${
                  filterCategoriesArray.length > 0
                    ? "border border-solid border-slate-300"
                    : ""
                }`}
              >
                {filterCategoriesArray?.map((item, index) => (
                  <div
                    key={index}
                    className="text-sm text-center text-gray-600 px-3 py-2 border-b border-solid border-slate-300 pb-2 cursor-pointer"
                    onClick={() => {
                      setValue2({
                        ...value2,
                        name: item?.name,
                        number: item?.number,
                      });

                      setFilterCategoriesArray([]);
                      setCategoryInputValue("");
                    }}
                  >
                    {item?.name}
                  </div>
                ))}
              </div>
            )}
            {filterCategoriesArray.length === 0 &&
              categoryInputValue.trim() !== "" && (
                <div
                  className="btnBlack text-white rounded-sm px-4 py-2 w-fit cursor-pointer mt-2"
                  onClick={(e) => {
                    setNewCategory(e);
                    setValue2({
                      ...value2,
                      number: categoriesArray.length + 1,
                    });
                    alert("Category Added");
                  }}
                >
                  + Add Category
                </div>
              )}
          </div>
          <div className="flex justify-center mx-auto flex-col w-full mt-5">
            <label htmlFor="tags" className="text-lg mb-1 font-bold">
              Tags
            </label>
            {selectedSkill.length > 0 && (
              <div className="border border-solid border-gray-200 px-2 rounded-sm mb-4">
                <div className="flex flex-wrap gap-2">
                  {selectedSkill.map((skill, ind) => {
                    return (
                      <div
                        key={ind}
                        className="flex gap-2 px-4 py-1 text-sm rounded-lg bg-inherit border border-solid border-gray-300 my-2"
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
                  })}
                </div>
              </div>
            ) }

            <input
              type="text"
              id="tags"
              value={inputValue}
              onChange={handleChange}
              className="border border-solid border-gray-200 p-2 text-sm rounded-sm focus:outline-none"
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
                    className="px-4 py-2 text-sm rounded-sm focus:outline-none btnBlack text-white w-fit mt-2"
                  >
                    + Add Interest
                  </button>
                )}
          </div>
        </div>

        <div className="w-full my-5 md:my-0 md:w-[300px] lg:w-[400px] shrink-0">
          <div
            onClick={() => document.querySelector("#imageSelector").click()}
            className="flex flex-col justify-center items-center border border-dashed border-[#1475cf] h-[200px] w-full cursor-pointer rounded-lg"
          >
            <input
              type="file"
              id="imageSelector"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <div className="relative">
                <img
                  src={allBlogData.images_list[0]}
                  alt="Selected preview"
                  className="w-28 h-28 object-cover shrink-0 brightness-95 "
                />
                <div
                  onClick={removeImage}
                  className="cursor-pointer absolute top-0 right-0 bg-inherit text-white rounded-full p-1"
                >
                  <BsX className="text-white text-xl drop-shadow-sm bg-black border border-solid border-white rounded-full " />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {uploadBannerProgress > 0 && uploadBannerProgress < 100 ? (
                  <div>current progress: {uploadBannerProgress}%</div>
                ) : (
                  <>
                    <BsUpload size={20} />
                    <div className="text-sm text-[#1475cf] mt-2 text-center text-balance">
                      Click here to attach or upload an image
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="text-gray-500 text-sm mt-1 text-center">
            Upload your blog image here
          </div>
        </div>
      </div>
      <div className="my-10 overflow-visible">
        <QuillToolbar toolbarId={"t1"} />
        <ReactQuill
          theme="snow"
          value={allBlogData.content}
          onChange={(content) => setAllBlogData({ ...allBlogData, content })}
          readOnly={preview}
          modules={modules("t1")}
          formats={formats}
          placeholder="Write something..."
          className=" border border-solid border-slate-400 "
        />
      </div>
      <div
        className="text-base w-fit px-4 py-2 rounded-sm btnBlack text-white cursor-pointer"
        onClick={() => {
          setPreview(true);
          console.log(allBlogData.content);
          const originalContent = JSON.parse(
            JSON.stringify(allBlogData.content)
          );
          const sanitizedContent = DOMPurify.sanitize(originalContent);
          setAllBlogData({ ...allBlogData, content: sanitizedContent });
          console.log(allBlogData.content);
        }}
      >
        Preview
      </div>
      {preview && (
        <>
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(allBlogData.content),
            }}
            className="border border-solid border-slate-300 p-2 rounded-sm mt-16 dangerHtml"
          />
          <div className="flex items-center gap-5 ">
            <div
              className="text-base bg-white rounded-sm px-4 py-2 text-black w-fit cursor-pointer border border-solid border-black"
              onClick={() => setPreview(false)}
            >
              Edit
            </div>
            <div
              onClick={blogCreated}
              className={loading ? `text-base bg-gray-600 rounded-sm px-4 py-2 text-white w-fit cursor-pointer`:`text-base btnBlack rounded-sm px-4 py-2 text-white w-fit cursor-pointer`}
            >
              Submit
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditBlog;
