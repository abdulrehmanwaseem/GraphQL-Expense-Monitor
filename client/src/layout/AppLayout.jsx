import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { BackgroundBeams } from "../components/ui/background-beams";
import Header from "../components/ui/header";

const AppLayout = ({ authUser }) => {
  return (
    <BackgroundBeams>
      <div>
        {authUser && <Header />}
        <Suspense
          fallback={<p className="font-semibold text-lg loading-text"></p>}
        >
          <Outlet />
        </Suspense>
      </div>
    </BackgroundBeams>
  );
};

export default AppLayout;
