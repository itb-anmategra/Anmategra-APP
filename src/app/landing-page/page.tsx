import React from "react";
import MahasiswaSidebar from "../_components/MahasiswaSidebar";
import HeroSection from "../_components/landing/hero";

const page = () => {
  return (
    <div className="h-[200vh]">
      <MahasiswaSidebar />
      <HeroSection />
    </div>
  );
};

export default page;
