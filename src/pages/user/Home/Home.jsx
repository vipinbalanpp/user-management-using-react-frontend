import React, { useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import instance from "../../../config/axiosConfig";

export default function Home() {
  const { loading,user } = useSelector((state) => state.user);
  const [imageLoaded,setImageLoaded] = useState(false)
  const [userInfo,setUserInfo] = useState(user)
  useEffect(() => {
    instance
      .get(`/user/get-user-info/${user.username}`)
      .then((response) => {
        if (response.status === 200) {
          setUserInfo(response.data);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);
  return (
    
    <div className="bg-gray-300 h-screen">
      {loading ? (
        <div className="fixed inset-0 z-50 bg-black/30 h-screen w-screen flex justify-center items-center">
          <div class="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        ""
      )}
      <div className="h-[70%]">
      <div className="pt-10">
   <img src={ userInfo.profileImageUrl ? userInfo.profileImageUrl : "/avatar.jpg" } alt="User Avatar" className="w-28 h-28 object-cover mx-auto mb-4 rounded-full" />
   </div>
   <div className="flex justify-center">
   <h1 className="text-4xl font-bold mt-10" >Hello, {user.username}</h1>
   </div>

        <div className="flex justify-center items-center h-[100%]">
        
          <Link to="profile-settings">
            <button className="flex justify-center items-center h-16 w-52  gap-2 rounded text-white font-bold text-xl bg-cyan-700">
              <FiSettings />
             Edit Profile 
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
