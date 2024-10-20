import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import NotFound from "./screens/error";

const Home = lazy(() => import("./screens/home"));
const SignUp = lazy(() => import("./screens/auth/SignUp"));
const Login = lazy(() => import("./screens/auth/Login"));
const Transaction = lazy(() => import("./screens/transaction"));

const App = () => {
  const authUser = true;

  return (
    <>
      <Routes>
        <Route element={<AppLayout authUser={authUser} />}>
          <Route path="/" element={<Home />} />
          <Route path="/transaction/:id" element={<Transaction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
