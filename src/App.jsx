import { useState } from "react";

function App() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <>
    <NetworkStatusChecker />
    {user && <Navbar />}
    <Routes>
      <Route
        path="*"
        element={
          <h1 className="font-bold text-3xl flex justify-center  h-screen items-center">
            <div>No Page Found</div>
          </h1>
        }
      ></Route>
      {user ? (
        user.role == "ROLE_ADMIN" ? (
          <Route path="/admin/dashboard" element={<Dashboard />}></Route>
        ) : (
          <>
            <Route
              path="/user/home/profile-settings"
              element={<ProfileSettings />}
            ></Route>
            <Route path="/user/home" element={<Home />}></Route>
          </>
        )
      ) : (
        <></>
      )}
      <Route path="/" element={<Landing />}></Route>
    </Routes>
  </>
  );
}

export default App;




