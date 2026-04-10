import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import EnrollForm from "../components/ui/EnrolForm";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/form" element={<EnrollForm/>}/> */}
      {/* <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} /> */}
    </Routes>
  );
}

export default AppRoutes;