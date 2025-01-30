// App.jsx
import { Route, Routes } from "react-router";
import Login from './pages/login.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/home.jsx";
import MainLayout from "./layouts/mainLayout.jsx";
import Landbank from "./pages/landbank.jsx";
import ProjectPage from "./pages/projects/index.jsx";
import TrackingPage from "./pages/tracking.jsx";
import ReportsPage from "./pages/reports.jsx";
import MasterPage from "./pages/master.jsx";
import UserPage from "./pages/user.jsx";
import Loction from "./pages/Loction.jsx";
import ProjectDetails from "./components/pages/projects/ProjectDetails.jsx";
import ProjectOverview from "./components/pages/projects/ProjectOverview.jsx";
import CreateUserForm from "./components/pages/users/createusers/createUserForm.jsx";
import AddProject from "./components/pages/projects/AddProject.jsx";
import ProjectSubActivityPage from "./pages/projects/projects-subactivity-listing/index.jsx";
// import ProjectActivityListing from "./pages/projects/projects-activity-listing/index.jsx";
import ProjectMainActivityPage from "./pages/projects/projects-main-activity/index.jsx";
import ProjectCategoryPage from "./pages/projects/projects-category/index.jsx";
import ProjectMultipleListing from "./pages/projects/projects-multiple-activity/index.jsx";

function App() {
  const showToast = () => {
    toast.success("This is a success toast!");
  };
  
  return (
    <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout><Home/></MainLayout>} />
          {/* {Landbank} */}
          <Route path="/landbank" element={<MainLayout><Landbank/></MainLayout>} />
          <Route path="/location" element={<MainLayout><Loction/></MainLayout>} />
        
          {/* Users */}
          <Route path="/user" element={<MainLayout><UserPage/></MainLayout>} />
          <Route path="/user/create" element={<MainLayout><CreateUserForm/></MainLayout>}/>

          <Route path="/tracking" element={<MainLayout><TrackingPage/></MainLayout>} />
          <Route path="/reports" element={<MainLayout><ReportsPage/></MainLayout>} />
          <Route path="/master" element={<MainLayout><MasterPage/></MainLayout>} />
          {/* Project Section */}
          <Route path="project" element={<MainLayout><ProjectPage /></MainLayout>} />
          <Route path="/project/categories" element={<MainLayout><ProjectCategoryPage/></MainLayout>} />
          <Route path="/project/main-activites" element={<MainLayout><ProjectMainActivityPage/></MainLayout>} />
          <Route path="/project/sub-activites" element={<MainLayout><ProjectSubActivityPage/></MainLayout>} />
          <Route path="/project/multiple-activites" element={<MainLayout><ProjectMultipleListing/></MainLayout>} />
          <Route path="/project/add-projects" element={<MainLayout><AddProject/></MainLayout>} />
        </Routes>
        <ToastContainer />
    </div>

  );
}

export default App;
