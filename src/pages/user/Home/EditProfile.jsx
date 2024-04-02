import React, { useEffect, useState } from "react";
import instance from "../../../config/axiosConfig";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function EditProfile() {
  const { user } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState({});
  const [username,setUsername] = useState("")
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileImageUrl,setProfileImageUrl] = useState("");
  const [usernnameExits,setUsernameExits] = useState(false);
  const navigator = useNavigate();
  useEffect(() => {
    instance
      .get(`/user/get-user-info/${user.username}`)
      .then((response) => {
        if (response.status === 200) {
          setUserInfo(response.data);
          setUsername(response.data.username)
          setProfileImageUrl(response.data.profileImageUrl)
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [user]);
  const checkUsernameExists = (e) => {
    setUsername(e.target.value)
     instance.post(`/user/check-username-exists`,e.target.value)
        .then(response =>{
          if(response.data === true){
            setUsernameExits(true)
          }else{
            setUsernameExits(false)
          }
        }).catch(error=>{
          console.log(error)
        })
  }
  const changeUsername = () => {
    if(!usernnameExits){
      console.log(profileImageUrl)
      console.log("this is username",username)
    instance
    .put(
      '/user/edit-profile',
      { 
        
        username,
        profileImageUrl,
      }
    )
      .then((response)=>{
        if(response.status === 200){
          Cookies.remove('userToken')
          Cookies.set('userToken',response.data)
         const newUser = {
            ...userInfo,
            username : username
          }
          setUserInfo(newUser);
            navigator("/user/home")
        }
      })
      .catch((e) => {
        console.error(e);
      });
    }
  }
  const handleFileChange = (event) => {
    setProfilePhoto(event.target.files[0]);
    setProfileImageUrl(URL.createObjectURL(event.target.files[0]));
  };
  return (
    <div className="h-[740px] w-full bg-gray-300 flex justify-center items-center">
      <div className="w-[60%] h-[80%] rounded-2xl flex flex-col justify-center items-center shadow-xl bg-white">
        <div>
          <h2 className="text-2xl">Edit Profile</h2>
        </div>
        <div>
        <label htmlFor="profile-photo">
              <img
                src={
                  profileImageUrl ||
                  user.profileImageUrl ||
                  "/avatar.jpg"
                }
                alt="Profile Preview"
                className={` w-40 h-40 object-cover cursor-pointer ${
                  user.profileImageUrl && "rounded-full"
                }`}
              />
            </label>

            <input
              className="hidden"
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
        </div>
        {console.log(userInfo)}
        <div className="h-48 w-full flex flex-col items-center justify-center">
          Username
          <div className="flex h-8 w-[33%] border border-gray-600 rounded-xl items-center text-xl font-bold flex justify-center mt-3">
            <input className="border-none" value={username} onChange={(e)=>checkUsernameExists(e)}/>
          </div>
          <button  onClick={changeUsername} type="button" class="text-white mt-3 bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Save</button>
          {usernnameExits && <p className="text-red-800 font-bold">Username exists !!!</p>}
        </div>
      </div>
    </div>
  );
}
