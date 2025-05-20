import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/users/usersApi.js";
import { landBankApi } from "../api/users/landbankApi.js";
import { landCategoryApi } from "../api/users/categoryApi.js";
import { landLocationApi } from "../api/users/locationApi.js";
import { activityApi } from "../api/users/projectActivityApi.js";
import { subActivityApi } from "../api/users/subActivityApi.js";
import { multipleActivityApi } from "../api/users/multipleActivityApi.js";
import { sfaApi } from "../api/sfa/sfaApi.js";
import { projectApi } from "../api/users/projectApi.js";
import { documentApi } from "../api/users/documentApi.js";
import { materialApi } from "../api/material/materialApi.js";
import { companyApi } from "../api/General/company/companyApi.js";
import { expenseApi } from "../api/expense/expenseApi.js";
import { clientDataApi } from "../api/client/clientApi.js";
import { projectWpoApi } from "../api/wpo/wpoApi.js";
import { milestoneApi } from "../api/milestone/milestoneApi.js";
import { inspectionApi } from "../api/inspection/inspectionApi.js";
import { masterDesignApi } from "../api/masterdesign/masterDesign.js";
import { milestonePaymentApi } from "../api/milestonePayment/milestonePaymentApi.js";
import { permissionsApi } from "../api/permission/permissionApi.js";
import { permitToWorkApi } from "../api/hse/permitTowork/permitToworkApi.js";
import { incidentNearMissApi } from "../api/hse/incidentNearmissInvestigation/incidentNearmissInvestigationApi.js";
import { safetyViolationApi } from "../api/hse/safetyViolation/safetyViolatioApi.js";
import { boomLiftInspectionApi } from "../api/hse/boomLift/boomLiftApi.js";
import { trailerInspectionApi } from "../api/hse/trailerInspection/trailerInspectionApi.js";
import { mockDrillApi } from "../api/hse/mockdrill/mockDrillApi.js";
import { craneHydraApi } from "../api/hse/crane/craneHydraApi.js";
import { safetyTrainingApi } from "../api/hse/safetyTraining/safetyTrainingApi.js";
import { toolTalkAttendanceApi } from "../api/hse/toolbox/toolBoxApi.js";
import { firstAidRecordApi } from "../api/hse/firstAidRecord/firstAidRecordApi.js";
import { fireExtinguisherInspectionApi } from "../api/hse/extinguisher/extinguisherApi.js";
import { inductionTrainingApi } from "../api/hse/induction/inductionApi.js";
import { harnessInspectionApi } from "../api/hse/harness/harnessApi.js";
import { excavationPermitApi } from "../api/hse/excavation/excavationPermitApi.js";
import { safetyTrainingMinutesApi } from "../api/hse/safetyTrainingMinutes/safetyTrainingMinutes.js";
import { suggestionSchemeReportApi } from "../api/hse/suggestionScheme/suggestionSchemeReportApi .js";
import { ladderInspectionApi } from "../api/hse/ladder/ladderInspectionApi.js";
import { internalAuditReportApi } from "../api/hse/internalAudit/internalAuditReportApi .js";
import { lotoRegisterApi } from "../api/hse/loto/lotoRegisterApi.js";
import { incidentNearmissApi } from "../api/hse/incidentReport/incidentReportApi.js";
import { qualityApi } from "../api/quality/qualityApi.js";
import { qualitySupplyApi } from "../api/quality/qualitySupplyApi.js";
import { hotoApi } from "../api/hoto/hotoApi.js";
import { punchPointApi } from "../api/hoto/punchPointApi.js";
import { electricityApi } from "../api/General/Electricity-line/ElectricityLineApi.js";
 
const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [landBankApi.reducerPath]: landBankApi.reducer,
    [landCategoryApi.reducerPath]: landCategoryApi.reducer,
    [landLocationApi.reducerPath]: landLocationApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [subActivityApi.reducerPath]: subActivityApi.reducer,
    [multipleActivityApi.reducerPath]: multipleActivityApi.reducer,
    [sfaApi.reducerPath]: sfaApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [materialApi.reducerPath]: materialApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [clientDataApi.reducerPath]: clientDataApi.reducer,
    [projectWpoApi.reducerPath]: projectWpoApi.reducer,
    [milestoneApi.reducerPath]: milestoneApi.reducer,
    [inspectionApi.reducerPath]: inspectionApi.reducer,
    [masterDesignApi.reducerPath]: masterDesignApi.reducer,
    [milestonePaymentApi.reducerPath]: milestonePaymentApi.reducer,
    [permissionsApi.reducerPath]: permissionsApi.reducer,
    [permitToWorkApi.reducerPath]: permitToWorkApi.reducer,
    [incidentNearMissApi.reducerPath]: incidentNearMissApi.reducer,
    [safetyViolationApi.reducerPath]: safetyViolationApi.reducer,
    [craneHydraApi.reducerPath]:craneHydraApi.reducer,
    [boomLiftInspectionApi.reducerPath]: boomLiftInspectionApi.reducer,
    [trailerInspectionApi.reducerPath]: trailerInspectionApi.reducer,
    [mockDrillApi.reducerPath]: mockDrillApi.reducer,
    [safetyTrainingApi.reducerPath]: safetyTrainingApi.reducer,
    [toolTalkAttendanceApi.reducerPath]:toolTalkAttendanceApi.reducer,
    [firstAidRecordApi.reducerPath]:firstAidRecordApi.reducer,
    [fireExtinguisherInspectionApi.reducerPath]:fireExtinguisherInspectionApi.reducer,
    [inductionTrainingApi.reducerPath]:inductionTrainingApi.reducer,
    [harnessInspectionApi.reducerPath]:harnessInspectionApi.reducer,
    [excavationPermitApi.reducerPath]:excavationPermitApi.reducer,
    [safetyTrainingMinutesApi.reducerPath]:safetyTrainingMinutesApi.reducer,
    [suggestionSchemeReportApi.reducerPath]:suggestionSchemeReportApi.reducer,
    [ladderInspectionApi.reducerPath]:ladderInspectionApi.reducer,
    [internalAuditReportApi.reducerPath]:internalAuditReportApi.reducer,
    [lotoRegisterApi.reducerPath]:lotoRegisterApi.reducer,
    [incidentNearmissApi.reducerPath]:incidentNearmissApi.reducer,
    [qualityApi.reducerPath]:qualityApi.reducer,
    [qualitySupplyApi.reducerPath]:qualitySupplyApi.reducer,
    [hotoApi.reducerPath]:hotoApi.reducer,
    [punchPointApi.reducerPath]:punchPointApi.reducer,
    [electricityApi.reducerPath]:electricityApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(landBankApi.middleware)
      .concat(landCategoryApi.middleware)
      .concat(landLocationApi.middleware)
      .concat(activityApi.middleware)
      .concat(subActivityApi.middleware)
      .concat(multipleActivityApi.middleware)
      .concat(sfaApi.middleware)
      .concat(projectApi.middleware)
      .concat(documentApi.middleware)
      .concat(materialApi.middleware)
      .concat(companyApi.middleware)
      .concat(expenseApi.middleware)
      .concat(clientDataApi.middleware)
      .concat(projectWpoApi.middleware)
      .concat(milestoneApi.middleware)
      .concat(inspectionApi.middleware)
      .concat(masterDesignApi.middleware)
      .concat(milestonePaymentApi.middleware)
      .concat(permissionsApi.middleware)
      .concat(permitToWorkApi.middleware)
      .concat(incidentNearMissApi.middleware)
      .concat(safetyViolationApi.middleware)
      .concat(craneHydraApi.middleware)
      .concat(boomLiftInspectionApi.middleware)
      .concat(trailerInspectionApi.middleware)
      .concat(mockDrillApi.middleware)  
      .concat(safetyTrainingApi.middleware)
      .concat(toolTalkAttendanceApi.middleware)
      .concat(firstAidRecordApi.middleware)
      .concat(fireExtinguisherInspectionApi.middleware)
      .concat(inductionTrainingApi.middleware)
      .concat(harnessInspectionApi.middleware)
      .concat(excavationPermitApi.middleware)
      .concat(safetyTrainingMinutesApi.middleware)
      .concat(suggestionSchemeReportApi.middleware)
      .concat(ladderInspectionApi.middleware)
      .concat(internalAuditReportApi.middleware)
      .concat(lotoRegisterApi.middleware)
      .concat(incidentNearmissApi.middleware)
      .concat(qualityApi.middleware)
      .concat(qualitySupplyApi.middleware)
      .concat(hotoApi.middleware)
      .concat(punchPointApi.middleware)
      .concat(electricityApi.middleware),
});

export default store;
