// App.jsx
import { Route, Routes } from "react-router";
import Login from './pages/login.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/home.jsx";
import MainLayout from "./layouts/mainLayout.jsx";
import Landbank from "./pages/landbank.jsx";
import ProjectPage from "./pages/project.jsx";
import TrackingPage from "./pages/tracking.jsx";
import ReportsPage from "./pages/reports.jsx";
import MasterPage from "./pages/master.jsx";
import UserPage from "./pages/user.jsx";
import ProjectDetails from "./components/pages/projects/ProjectDetails.jsx";
import ProjectOverview from "./components/pages/projects/ProjectOverview.jsx";

function App() {
  const showToast = () => {
    toast.success("This is a success toast!");
  };
  
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainLayout><Home/></MainLayout>} />
        <Route path="/landbank" element={<MainLayout><Landbank/></MainLayout>} />
        <Route path="/user" element={<MainLayout><UserPage/></MainLayout>} />
        <Route path="/tracking" element={<MainLayout><TrackingPage/></MainLayout>} />
        <Route path="/reports" element={<MainLayout><ReportsPage/></MainLayout>} />
        <Route path="/master" element={<MainLayout><MasterPage/></MainLayout>} />
        {/* Project Section */}
        <Route path="project" element={<MainLayout><ProjectPage /></MainLayout>} />
        <Route path="/project/categories" element={<MainLayout><>Category</></MainLayout>} />
        <Route path="/project/main-activites" element={<MainLayout><>Main Activity</></MainLayout>} />
        <Route path="/project/sub-activites" element={<MainLayout><>Sub Activity</></MainLayout>} />
        <Route path="/project/multiple-activites" element={<MainLayout><>Multiple</></MainLayout>} />

      </Routes>

      <ToastContainer />
    </div>

  );
}

export default App;
