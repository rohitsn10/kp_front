import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/home.jsx";
import MainLayout from "./layouts/mainLayout.jsx";
import Landbank from "./pages/landbank.jsx";
import ProjectPage from "./pages/projects/index.jsx";
import TrackingPage from "./pages/tracking.jsx";
import ReportsPage from "./pages/reports.jsx";
import MasterPage from "./pages/master.jsx";
import UserPage from "./pages/user.jsx";
import Loction from "./pages/Loction.jsx";
import CreateUserForm from "./components/pages/users/createusers/createUserForm.jsx";
import AddProject from "./components/pages/projects/AddProject.jsx";
import ProjectSubActivityPage from "./pages/projects/projects-subactivity-listing/index.jsx";
import ProjectMainActivityPage from "./pages/projects/projects-main-activity/index.jsx";
import ProjectCategoryPage from "./pages/projects/projects-category/index.jsx";
import ProjectMultipleListing from "./pages/projects/projects-multiple-activity/index.jsx";
import AddLandDoc from "./components/pages/Land-back/add-land.jsx";
import ProtectedRoute from "./layouts/ProtectedRoute.jsx";
import DocumentListing from "./pages/Document.jsx/Document-list.jsx";
// import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/landbank"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Landbank />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-land-doc"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddLandDoc />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/location"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Loction />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DocumentListing />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UserPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/create"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreateUserForm />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tracking"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TrackingPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ReportsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/master"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MasterPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Project Section */}
        <Route
          path="/project"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/categories"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectCategoryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/main-activities"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectMainActivityPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/sub-activities"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectSubActivityPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/multiple-activities"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectMultipleListing />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/add-projects"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddProject />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
