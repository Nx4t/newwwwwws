import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import React, { createContext, useState } from 'react';

// Create a context
export const UserContext = createContext();

const App = () => {
  // Set your initial userAuth state
  const [userAuth, setUserAuth] = useState({
    access_token: null,
    profile_img: null,
    username: null,
    fullname: null
  });

  return (
    // Provide the context value with userAuth and setUserAuth
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuthForm type="sign-in" />} /> 
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />   
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
