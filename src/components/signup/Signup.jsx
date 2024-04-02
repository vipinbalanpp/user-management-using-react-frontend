import instance from "../../config/axiosConfig";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import InputComponent from "../inputs/InputComponent";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import storage from "../../firebase-config";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../redux/actions/userActions";
import { setError, setLoader } from "../../redux/reducers/userSlice";
import { toast } from "react-toastify";

function Signup({ adminCreating, setModal }) {
  const avatar = "/avatar.jpg";
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const { error, success } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (error && error === "User Exists!") {
      toast.error(error, { pauseOnHover: false });
      dispatch(setError(false));
      adminCreating && setModal(false);
    }
  }, [error]);

  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("This field is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("This field is required"),
  });
  function handleSignupSubmit(userInfo, { resetForm }) {
    dispatch(setLoader(true));

    if (profilePhoto) {
      const imageRef = storageRef(storage, `userProfileImages/${uuidv4()}`);
      const uploadTask = uploadBytesResumable(imageRef, profilePhoto);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          alert(error);
          dispatch(setLoader(false));
        },
        async () => {
          try {
            const profileImageUrl = await getDownloadURL(
              uploadTask.snapshot.ref
            );
            const userData = {
              username: userInfo.username,
              password: userInfo.password,
              profileImageUrl,
            };
            console.log(userData);
            await dispatch(userRegister(userData))
            adminCreating && setModal(false);
            resetForm({
              values: initialValues,
            });
           
            setProfileImageUrl("");
            setProfilePhoto(null);
          } catch (error) {
            console.log(error);
            dispatch(setLoader(false));
          }
        }
      );
    } else {
      const userData = {
        username: userInfo.username,
        password: userInfo.password,
        profileImageUrl: "",
      };
     dispatch(userRegister(userData)).then(()=>{
      resetForm({
        values: initialValues,
      });
      setProfileImageUrl("");
      setProfilePhoto(null);
      setModal(false)
     })
     
    }
  }
  const handleFileChange = (event) => {
    setProfilePhoto(event.target.files[0]);
    setProfileImageUrl(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <>
      {!adminCreating && (
        <div className="flex justify-center font-bold text-xl mt-5">Hey</div>
      )}
      <div className="w-full flex flex-col items-center gap-5 justify-center mt-2">
        <div className="flex flex-col">
          <div className="mb-2 flex justify-center">
            <label htmlFor="profile-photo">
              <img
                src={profileImageUrl || avatar}
                alt="Profile Preview"
                className={` w-40 h-40 object-cover cursor-pointer ${
                  profileImageUrl && "rounded-full"
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
          <div>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSignupSubmit}
              validationSchema={validationSchema}
            >
              <Form className="w-full flex flex-col items-center gap-5 justify-center mt-12">
                <InputComponent name="username" placeholder="Username" />
                <InputComponent name="password" placeholder="Password" />
                <InputComponent
                  name="confirmPassword"
                  placeholder="Confirm Password"
                />
                <div className="mt-12">
                  <button
                    className="bg-teal-500 text-white w-28 h-9 text-lg font-bold rounded-lg"
                    type="submit"
                  >
                    {adminCreating ? "Create" : "Signup"}
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;