import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/public/Home";
import Projects from "./pages/projects/Projects";
import ProjectDetails from "./pages/projects/ProjectDetails";

// Admin Pages
import Login from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProjects from "./pages/admin/Projects";
import AdminProjectDetails from "./pages/admin/ProjectDetails";
import ProjectForm from "./pages/admin/ProjectForm";
import AdminBatches from "./pages/admin/Batches";
import AdminTeams from "./pages/admin/Teams";
import AdminMentees from "./pages/admin/Mentees";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/:id" element={<AdminProjectDetails />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />
            <Route path="batches" element={<AdminBatches />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="mentees" element={<AdminMentees />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
