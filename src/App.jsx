import { Navigate, Outlet, Route, Routes } from "react-router-dom";
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
import DocumentListing from "./pages/document/Document-list.jsx";
import UploadedDocumentListing from "./components/pages/Documents/uploaded-document.jsx";
import MaterialManagementListing from "./pages/Material/MaterialManagement.jsx";
import ProjectListingTable from "./pages/projects/index.jsx";
// import SFAPage from "./pages/Sfa-page/index.jsx";
import SiteVisitTable from "./pages/Sfa-page/index.jsx";
import EditLandApproveDoc from "./components/pages/Land-bank/editLandBankApprove.jsx";
import ProjectExpense from "./pages/projects/project-expense/index.jsx";
import CreateClientDetails from "./pages/projects/project-client-details/index.jsx";
import ViewClientDetails from "./pages/projects/project-view-client-details/index.jsx";
import ViewProjectDetails from "./pages/projects/project-view-details/index.jsx";
import DocumentPattern from "./pages/dummy/index.jsx";
import ProjectMilestonePage from "./pages/projects/project-milestone/index.jsx";
import MilestonePage from "./pages/milestone/index.jsx";
import ViewUpdateInspectionDetails from "./components/pages/Material/viewUpdateInspectionPage.jsx";
import MasterDesignListing from "./pages/projects/project-mdl/index.jsx";
import ProjectMileStonePayment from "./pages/projects/project-milestone-payment/index.jsx";
import ProjectViewMilestone from "./pages/projects/projects-view-milestone-details/index.jsx";
import UserGroupSection from "./pages/groups/groups.jsx";
import DesignDocumentsPage from "./pages/design-documents/index.jsx";
import ViewLandBankDetails from "./pages/Land-bank/landbankFilesView.jsx";
import HseMainPage from "./pages/hse/index.jsx";
import PermitToWork from "./pages/hse/permit-to-work/PermitToWork.jsx";
import BoomLiftInspection from "./pages/hse/boom-lift-inspection/BoomLiftInspection.jsx";
import CraneHydraInspection from "./pages/hse/crane-hydra-inspection/CraneHydraInspection.jsx";
import IncidentInvestigation from "./pages/hse/incident-investigation/IncidentInvestigation.jsx";
import SafetyViolation from "./pages/hse/safety-violation/SafetyViolation.jsx";
import TrailerInspection from "./pages/hse/trailer-inspection/TrailerInspection.jsx";
import MockDrillReport from "./pages/hse/mock-drill-report/MockDrillReport.jsx";
import InternalAuditReport from "./pages/hse/internal-audit-report/InternalAuditReport.jsx";
import InductionTraining from "./pages/hse/induction-training/InductionTraining.jsx";
import PhysicalFitnessCertificate from "./pages/hse/physical-fitness-certificate/PhysicalFitnessCertificate.jsx";
import ToolboxTalk from "./pages/hse/toolbox-talk/ToolboxTalk.jsx";
import FirstAidRecord from "./pages/hse/first-aid-record/FirstAidRecord.jsx";
import LadderChecklist from "./pages/hse/ladder-checklist/LadderChecklist.jsx";
import ExcavationChecklist from "./pages/hse/excavation-checklist/ExcavationChecklist.jsx";
import SuggestionScheme from "./pages/hse/suggestion-scheme/SuggestionScheme.jsx";
import SafetyTraining from "./pages/hse/safety-training/SafetyTraining.jsx";
import SafetyMeetingMinutes from "./pages/hse/safety-meeting-minutes/SafetyMeetingMinutes.jsx";
import LotoRegister from "./pages/hse/loto/LotoRegister.jsx";
import FullBodyHarnessChecklist from "./pages/hse/body-harness/FullBodyHarnessChecklist .jsx";
import RiskAssessment from "./pages/hse/risk-assessment/RiskAssessment .jsx";
import MonthlyFireExtinguisher from "./pages/hse/monthy-fireextinguiser/MonthlyFireExtinguisher .jsx";
import IncidentReport from "./pages/hse/incident-report/IncidentReport.jsx";
import QualityInspectionPage from "./pages/qa/QualityInspectionPage.jsx";
import QualityMainPage from "./pages/quality/index.jsx";
import FieldInspections from "./pages/quality/field-inspections/FieldInspections.jsx";
import SupplyInspections from "./pages/quality/supply/SupplyInspections.jsx";
import CivilInspections from "./pages/quality/field-inspections/CivilInspections.jsx";
import ElectricalInspections from "./pages/quality/field-inspections/ElectricalInspections.jsx";
import MechanicalInspections from "./pages/quality/field-inspections/MechanicalInspections.jsx";
import HOTOModule from "./pages/hoto/HotoDocuments.jsx";
import HOTOMainPage from "./pages/hoto/HotoMainPage.jsx";
import HotoDocuments from "./pages/hoto/HotoDocuments.jsx";
import HotoPunchPoints from "./pages/hoto/HotoPunchpoints.jsx";
import CompanyPage from "./pages/General/Company/index.jsx";
import ElectricityLinePage from "./pages/General/Electricity-line/index.jsx";

// console.log(SupplyInspections)
// import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
const HseLayout = () => {
  return (
    <div>
      {/* Optional: You can add HSE-specific navigation here */}
      <Outlet /> {/* This will render child routes */}
    </div>
  );
};
const QualityLayout = () => {
  return (
    <div>
      {/* Optional: You can add Quality-specific navigation here */}
      <Outlet /> {/* This will render child routes */}
    </div>
  );
};
const HotoLayout = () => {
  return (
    <div>
      {/* Optional: You can add Quality-specific navigation here */}
      <Outlet /> {/* This will render child routes */}
    </div>
  );
};

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
          path="/edit-land-doc/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EditLandApproveDoc />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-landbank-docs/:landBankId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ViewLandBankDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/expense/:projectId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectExpense />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/milestone-listing/:projectId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectMilestonePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/milestone-view/:milestoneId"
          element={
            <ProtectedRoute>
              <MainLayout>
                {/* <MilestonePage /> */}
                <ProjectViewMilestone />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/milestone-view/payment/:milestoneId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectMileStonePayment />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/client_details/:projectId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreateClientDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/view_projects_details/:projectId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ViewProjectDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/view_client_details/:projectId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ViewClientDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/manage-drawing-design/:projectId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MasterDesignListing />
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
          path="/path"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DocumentPattern />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploaded-documents"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UploadedDocumentListing />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/material-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MaterialManagementListing />
              </MainLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/general/company"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CompanyPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/project/electricity-line"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ElectricityLinePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/material-management/view-inspection/:materialId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ViewUpdateInspectionDetails />
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
          path="/user-groups"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UserGroupSection />
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
                <ProjectListingTable />
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
        <Route
          path="/sfa-page"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SiteVisitTable />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/design-documents"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DesignDocumentsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      {/* <Route
          path="/hoto-page"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HOTOMainPage/>
              </MainLayout>
            </ProtectedRoute>
          }
        /> */}
        
        <Route
          path="/hoto-page"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HotoLayout />
              </MainLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<HOTOMainPage />} />
          <Route
            path="add-document/:projectId"
            element={<HotoDocuments />}
          />    
                    <Route
            path="punchpoints/:projectId/:documentId"
            element={<HotoPunchPoints />}
          />        
        </Route>
        {/* <Route path="/hoto-page" element={<MainLayout><HOTOMainPage /></MainLayout>} />
<Route path="/hoto-page/:projectId" element={<MainLayout><HotoDocuments /></MainLayout>} />
<Route path="/hoto-page/punchpoints/:projectId/:documentId" element={<MainLayout><HotoPunchPoints /></MainLayout>} /> */}

        <Route
          path="/quality-assurance"
          element={
            <ProtectedRoute>
              <MainLayout>
                <QualityInspectionPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hse"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HseLayout />
              </MainLayout>
            </ProtectedRoute>
          }
        >
          {/* Default HSE route */}
          <Route index element={<HseMainPage />} />

          {/* Nested HSE section routes */}
          <Route
            path="permit-to-work/:locationId?"
            element={<PermitToWork />}
          />
          <Route
            path="incident-investigation/:locationId?"
            element={<IncidentInvestigation />}
          />
          <Route
            path="incident-report/:locationId?"
            element={<IncidentReport />}
          />
          <Route
            path="safety-violation/:locationId?"
            element={<SafetyViolation />}
          />
          <Route
            path="boom-lift-inspection/:locationId?"
            element={<BoomLiftInspection />}
          />
          <Route
            path="crane-hydra-inspection/:locationId?"
            element={<CraneHydraInspection />}
          />
          <Route
            path="trailer-inspection/:locationId?"
            element={<TrailerInspection />}
          />
          <Route
            path="mock-drill-report/:locationId?"
            element={<MockDrillReport />}
          />
          <Route
            path="safety-training/:locationId?"
            element={<SafetyTraining />}
          />
          <Route
            path="internal-audit-report/:locationId?"
            element={<InternalAuditReport />}
          />
          <Route
            path="induction-training/:locationId?"
            element={<InductionTraining />}
          />
          <Route
            path="physical-fitness-certificate/:locationId?"
            element={<PhysicalFitnessCertificate />}
          />
          <Route
            path="safety-meeting-minutes/:locationId?"
            element={<SafetyMeetingMinutes />}
          />
          <Route path="toolbox-talk/:locationId?" element={<ToolboxTalk />} />
          <Route
            path="first-aid-record/:locationId?"
            element={<FirstAidRecord />}
          />
          <Route
            path="ladder-checklist/:locationId?"
            element={<LadderChecklist />}
          />
          <Route
            path="excavation-checklist/:locationId?"
            element={<ExcavationChecklist />}
          />
          <Route
            path="suggestion-scheme/:locationId?"
            element={<SuggestionScheme />}
          />
          <Route
            path="monthly-fire-extinguisher-inspection/:locationId?"
            element={<MonthlyFireExtinguisher />}
          />
          <Route path="loto-register/:locationId?" element={<LotoRegister />} />
          <Route
            path="full-body-harness-checklist/:locationId?"
            element={<FullBodyHarnessChecklist />}
          />
          <Route
            path="risk-assessment/:locationId?"
            element={<RiskAssessment />}
          />
          {/* Add more HSE sections as needed */}
        </Route>
        {/* Quality Module */}

<Route
  path="/quality-main"
  element={
    <ProtectedRoute>
      <MainLayout>
        <QualityLayout />
      </MainLayout>
    </ProtectedRoute>
  }
>
  {/* Default Quality route */}
  <Route index element={<QualityMainPage />} />
  
  {/* Nested Quality section routes */}
  <Route
    path="supply-activities/:projectId?"
    element={<SupplyInspections />}
  />
  <Route
    path="field-inspections/:projectId?"
    element={<FieldInspections />}
  />
    <Route
    path="field-inspections/mechanical/:projectId?"
    element={<MechanicalInspections />}
  />
    <Route
    path="field-inspections/electical/:projectId?"
    element={<ElectricalInspections />}
  />
    <Route
    path="field-inspections/civil/:projectId?"
    element={<CivilInspections />}
  />
  {/* <Route
    path="quality-metrics/:projectId?"
    element={<QualityMetrics />}
  />
  <Route
    path="test-reports/:projectId?"
    element={<TestReports />}
  /> */}

  {/* Add more Quality sections as needed */}
</Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
