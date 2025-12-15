import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import Login from "./pages/admin/Login";
import ProtectedRoute from "./components/ProtectedRoute";
// import Dashboard from "./pages/admin/Dashboard";
// import Projects from "./pages/admin/Projects";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          {/* <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/projects" element={<Projects />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
