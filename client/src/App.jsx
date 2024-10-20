import React from "react";
import { Route, Routes } from "react-router-dom";

import SignUp from "./screens/auth/signUp";
import Login from "./screens/auth/Login";
import Home from "./screens/home";
import Transaction from "./screens/transaction";
import NotFound from "./screens/error";
import Header from "./components/ui/header";

const App = () => {
  const authUser = true;
  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/transaction/:id" element={<Transaction />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
