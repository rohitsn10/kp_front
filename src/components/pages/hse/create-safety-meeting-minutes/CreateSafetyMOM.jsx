import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CreateHSEMeetingMinutes({ open, setOpen }) {
  // Basic Information
  const [site, setSite] = useState("");
  const [time, setTime] = useState("");
  const [momRecordedBy, setMomRecordedBy] = useState("");
  const [momIssueDate, setMomIssueDate] = useState(null);
  const [chairmanName, setChairmanName] = useState("");
  
  // HSE Performance Data
  const [hsePerformanceData, setHsePerformanceData] = useState([
    { parameter: "", month: "", year_to_date: "" }
  ]);
  
  // Incident Investigation
  const [incidentInvestigation, setIncidentInvestigation] = useState([
    { action_item: "", responsibility: "", target_date: null }
  ]);
  
  // Safety Training
  const [safetyTraining, setSafetyTraining] = useState([
    { topics: "", conducted_by: "", participations: "" }
  ]);
  
  // Internal Audit
  const [internalAudit, setInternalAudit] = useState([
    { action_item: "", responsibility: "", target_date: null }
  ]);
  
  // Mock Drill
  const [mockDrill, setMockDrill] = useState([
    { action_item: "", responsibility: "", target_date: null }
  ]);
  
  // Procedure Checklist Update
  const [procedureChecklistUpdate, setProcedureChecklistUpdate] = useState([
    { description: "", procedure: "", checklist: "" }
  ]);
  
  // Review Last Meeting
  const [reviewLastMeeting, setReviewLastMeeting] = useState([
    { topic: "", action_by: "", target_date: null, review_status: "" }
  ]);
  
  // New Points Discussed
  const [newPointsDiscussed, setNewPointsDiscussed] = useState([
    { topic: "", action_by: "", target_date: null, remarks: "" }
  ]);
  
  // Signatures
  const [minutesPreparedBy, setMinutesPreparedBy] = useState("");
  const [signaturePreparedBy, setSignaturePreparedBy] = useState("");
  const [signatureChairman, setSignatureChairman] = useState("");

  // Style for all input fields
  const commonInputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "6px",
      transition: "border 0.2s ease-in-out",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FACC15",
        borderBottom: "4px solid #FACC15",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FACC15",
        borderWidth: "2px",
        borderBottom: "4px solid #FACC15",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #FACC15",
      borderBottom: "4px solid #FACC15",
    },
  };

  // Handlers for adding and removing array items
  const handleAddItem = (items, setItems) => {
    setItems([...items, { ...items[0], id: Date.now() }]);
  };

  const handleRemoveItem = (index, items, setItems) => {
    if (items.length === 1) return;
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Handle change for array items
  const handleItemChange = (index, field, value, items, setItems) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Form validation
  const validateForm = () => {
    if (!site.trim()) return toast.error("Site is required!");
    if (!time.trim()) return toast.error("Time is required!");
    if (!momRecordedBy.trim()) return toast.error("MOM Recorded By is required!");
    if (!momIssueDate) return toast.error("MOM Issue Date is required!");
    if (!chairmanName.trim()) return toast.error("Chairman Name is required!");
    
    // You can add more validation as needed
    
    return true;
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Format the data to match the expected JSON structure
    const formattedHseData = hsePerformanceData.map(item => ({
      parameter: item.parameter,
      month: parseInt(item.month) || 0,
      year_to_date: parseInt(item.year_to_date) || 0
    }));

    const formattedSafetyTraining = safetyTraining.map(item => ({
      topics: item.topics,
      conducted_by: item.conducted_by,
      participations: parseInt(item.participations) || 0
    }));

    const formData = {
      site,
      time,
      mom_recorded_by: momRecordedBy,
      mom_issue_date: momIssueDate ? momIssueDate.toISOString().split('T')[0] : '',
      chairman_name: chairmanName,
      hse_performance_data: formattedHseData,
      incident_investigation: incidentInvestigation.map(item => ({
        action_item: item.action_item,
        responsibility: item.responsibility,
        target_date: item.target_date ? item.target_date.toISOString().split('T')[0] : ''
      })),
      safety_training: formattedSafetyTraining,
      internal_audit: internalAudit.map(item => ({
        action_item: item.action_item,
        responsibility: item.responsibility,
        target_date: item.target_date ? item.target_date.toISOString().split('T')[0] : ''
      })),
      mock_drill: mockDrill.map(item => ({
        action_item: item.action_item,
        responsibility: item.responsibility,
        target_date: item.target_date ? item.target_date.toISOString().split('T')[0] : ''
      })),
      procedure_checklist_update: procedureChecklistUpdate,
      review_last_meeting: reviewLastMeeting.map(item => ({
        topic: item.topic,
        action_by: item.action_by,
        target_date: item.target_date ? item.target_date.toISOString().split('T')[0] : '',
        review_status: item.review_status
      })),
      new_points_discussed: newPointsDiscussed.map(item => ({
        topic: item.topic,
        action_by: item.action_by,
        target_date: item.target_date ? item.target_date.toISOString().split('T')[0] : '',
        remarks: item.remarks
      })),
      minutes_prepared_by: minutesPreparedBy,
      signature_prepared_by: signaturePreparedBy || "https://dummyimage.com/150x50/000/fff.png&text=Signature",
      signature_chairman: signatureChairman || "https://dummyimage.com/150x50/000/fff.png&text=Signature"
    };

    console.log(formData);
    
    // Here you would make the API call to post the data
    // Example API call commented out similar to your reference component

    toast.success("HSE Meeting Minutes submitted successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold">
        HSE Meeting Minutes
      </DialogTitle>
      <DialogContent>
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
          {/* Basic Information Section */}
          <div className="p-4 border border-gray-200 rounded-lg mb-4">
            <h3 className="text-[#29346B] text-xl font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-[#29346B] font-semibold">
                  Site<span className="text-red-600"> *</span>
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Site Name"
                  value={site}
                  sx={commonInputStyles}
                  onChange={(e) => setSite(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-[#29346B] font-semibold">
                  Time<span className="text-red-600"> *</span>
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Time (e.g., 10:00 AM)"
                  value={time}
                  sx={commonInputStyles}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-[#29346B] font-semibold">
                  MOM Recorded By<span className="text-red-600"> *</span>
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Name"
                  value={momRecordedBy}
                  sx={commonInputStyles}
                  onChange={(e) => setMomRecordedBy(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-[#29346B] font-semibold">
                  MOM Issue Date<span className="text-red-600"> *</span>
                </label>
                {/* <DatePicker
                  value={momIssueDate}
                  onChange={(date) => setMomIssueDate(date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      placeholder="Select Date"
                      sx={commonInputStyles}
                    />
                  )}
                /> */ }
                <TextField
    type="date"
    fullWidth
    variant="outlined"
    InputLabelProps={{
      shrink: true,
    }}
    
    sx={commonInputStyles}
    onChange={(e) => handleItemChange(index, "target_date", new Date(e.target.value), reviewLastMeeting, setReviewLastMeeting)}
  />
               
                
              </div>
              <div>
                <label className="block mb-1 text-[#29346B] font-semibold">
                  Chairman Name<span className="text-red-600"> *</span>
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Chairman Name"
                  value={chairmanName}
                  sx={commonInputStyles}
                  onChange={(e) => setChairmanName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Accordion Sections for Data Collections */}
          <div className="mb-4">
            {/* HSE Performance Data */}
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="hse-performance-content"
                id="hse-performance-header"
              >
                <Typography className="text-[#29346B] text-lg font-semibold">HSE Performance Data</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-bold text-[#29346B]">Parameter</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Month</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Year to Date</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {hsePerformanceData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Parameter"
                              value={item.parameter}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "parameter", e.target.value, hsePerformanceData, setHsePerformanceData)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Month Count"
                              type="number"
                              value={item.month}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "month", e.target.value, hsePerformanceData, setHsePerformanceData)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter YTD Count"
                              type="number"
                              value={item.year_to_date}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "year_to_date", e.target.value, hsePerformanceData, setHsePerformanceData)}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="error" 
                              onClick={() => handleRemoveItem(index, hsePerformanceData, setHsePerformanceData)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddItem(hsePerformanceData, setHsePerformanceData)}
                  sx={{
                    marginTop: 2,
                    backgroundColor: "#29346B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1a2246",
                    },
                  }}
                >
                  Add Parameter
                </Button>
              </AccordionDetails>
            </Accordion>

            {/* Incident Investigation */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="incident-investigation-content"
                id="incident-investigation-header"
              >
                <Typography className="text-[#29346B] text-lg font-semibold">Incident Investigation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-bold text-[#29346B]">Action Item</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Responsibility</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Target Date</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {incidentInvestigation.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Action Item"
                              value={item.action_item}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "action_item", e.target.value, incidentInvestigation, setIncidentInvestigation)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Responsibility"
                              value={item.responsibility}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "responsibility", e.target.value, incidentInvestigation, setIncidentInvestigation)}
                            />
                          </TableCell>
                          <TableCell>
                            {/* <DatePicker
                              value={item.target_date}
                              onChange={(date) => handleItemChange(index, "target_date", date, incidentInvestigation, setIncidentInvestigation)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  variant="outlined"
                                  placeholder="Select Date"
                                  sx={commonInputStyles}
                                />
                              )}
                            /> */}
                            <TextField
    type="date"
    fullWidth
    variant="outlined"
    InputLabelProps={{
      shrink: true,
    }}
    value={item.target_date ? new Date(item.target_date).toISOString().split('T')[0] : ''}
    sx={commonInputStyles}
    onChange={(e) => handleItemChange(index, "target_date", new Date(e.target.value), reviewLastMeeting, setReviewLastMeeting)}
  />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="error" 
                              onClick={() => handleRemoveItem(index, incidentInvestigation, setIncidentInvestigation)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddItem(incidentInvestigation, setIncidentInvestigation)}
                  sx={{
                    marginTop: 2,
                    backgroundColor: "#29346B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1a2246",
                    },
                  }}
                >
                  Add Item
                </Button>
              </AccordionDetails>
            </Accordion>

            {/* Safety Training */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="safety-training-content"
                id="safety-training-header"
              >
                <Typography className="text-[#29346B] text-lg font-semibold">Safety Training</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-bold text-[#29346B]">Topics</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Conducted By</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Participations</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {safetyTraining.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Topics"
                              value={item.topics}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "topics", e.target.value, safetyTraining, setSafetyTraining)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Conductor"
                              value={item.conducted_by}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "conducted_by", e.target.value, safetyTraining, setSafetyTraining)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Count"
                              type="number"
                              value={item.participations}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "participations", e.target.value, safetyTraining, setSafetyTraining)}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="error" 
                              onClick={() => handleRemoveItem(index, safetyTraining, setSafetyTraining)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddItem(safetyTraining, setSafetyTraining)}
                  sx={{
                    marginTop: 2,
                    backgroundColor: "#29346B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1a2246",
                    },
                  }}
                >
                  Add Training
                </Button>
              </AccordionDetails>
            </Accordion>

            {/* Internal Audit */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="internal-audit-content"
                id="internal-audit-header"
              >
                <Typography className="text-[#29346B] text-lg font-semibold">Internal Audit</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-bold text-[#29346B]">Action Item</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Responsibility</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Target Date</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {internalAudit.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Action Item"
                              value={item.action_item}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "action_item", e.target.value, internalAudit, setInternalAudit)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Responsibility"
                              value={item.responsibility}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "responsibility", e.target.value, internalAudit, setInternalAudit)}
                            />
                          </TableCell>
                          <TableCell>
                            {/* <DatePicker
                              value={item.target_date}
                              onChange={(date) => handleItemChange(index, "target_date", date, internalAudit, setInternalAudit)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  variant="outlined"
                                  placeholder="Select Date"
                                  sx={commonInputStyles}
                                />
                              )}
                            /> */}
                            <TextField
    type="date"
    fullWidth
    variant="outlined"
    InputLabelProps={{
      shrink: true,
    }}
    value={item.target_date ? new Date(item.target_date).toISOString().split('T')[0] : ''}
    sx={commonInputStyles}
    onChange={(e) => handleItemChange(index, "target_date", new Date(e.target.value), reviewLastMeeting, setReviewLastMeeting)}
  />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="error" 
                              onClick={() => handleRemoveItem(index, internalAudit, setInternalAudit)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddItem(internalAudit, setInternalAudit)}
                  sx={{
                    marginTop: 2,
                    backgroundColor: "#29346B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1a2246",
                    },
                  }}
                >
                  Add Item
                </Button>
              </AccordionDetails>
            </Accordion>

            {/* Mock Drill */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="mock-drill-content"
                id="mock-drill-header"
              >
                <Typography className="text-[#29346B] text-lg font-semibold">Mock Drill</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-bold text-[#29346B]">Action Item</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Responsibility</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Target Date</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockDrill.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Action Item"
                              value={item.action_item}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "action_item", e.target.value, mockDrill, setMockDrill)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Responsibility"
                              value={item.responsibility}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "responsibility", e.target.value, mockDrill, setMockDrill)}
                            />
                          </TableCell>
                          <TableCell>
                            {/* <DatePicker
                              value={item.target_date}
                              onChange={(date) => handleItemChange(index, "target_date", date, mockDrill, setMockDrill)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  variant="outlined"
                                  placeholder="Select Date"
                                  sx={commonInputStyles}
                                />
                              )}
                            /> */}
                            <TextField
    type="date"
    fullWidth
    variant="outlined"
    InputLabelProps={{
      shrink: true,
    }}
    value={item.target_date ? new Date(item.target_date).toISOString().split('T')[0] : ''}
    sx={commonInputStyles}
    onChange={(e) => handleItemChange(index, "target_date", new Date(e.target.value), reviewLastMeeting, setReviewLastMeeting)}
  />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="error" 
                              onClick={() => handleRemoveItem(index, mockDrill, setMockDrill)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddItem(mockDrill, setMockDrill)}
                  sx={{
                    marginTop: 2,
                    backgroundColor: "#29346B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1a2246",
                    },
                  }}
                >
                  Add Item
                </Button>
              </AccordionDetails>
            </Accordion>

            {/* Procedure Checklist Update */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="procedure-checklist-content"
                id="procedure-checklist-header"
              >
                <Typography className="text-[#29346B] text-lg font-semibold">Procedure Checklist Update</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-bold text-[#29346B]">Description</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Procedure</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Checklist</TableCell>
                        <TableCell className="font-bold text-[#29346B]">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {procedureChecklistUpdate.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Description"
                              value={item.description}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "description", e.target.value, procedureChecklistUpdate, setProcedureChecklistUpdate)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Procedure"
                              value={item.procedure}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "procedure", e.target.value, procedureChecklistUpdate, setProcedureChecklistUpdate)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter Checklist"
                              value={item.checklist}
                              sx={commonInputStyles}
                              onChange={(e) => handleItemChange(index, "checklist", e.target.value, procedureChecklistUpdate, setProcedureChecklistUpdate)}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="error" 
                              onClick={() => handleRemoveItem(index, procedureChecklistUpdate, setProcedureChecklistUpdate)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddItem(procedureChecklistUpdate, setProcedureChecklistUpdate)}
                  sx={{
                    marginTop: 2,
                    backgroundColor: "#29346B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1a2246",
                    },
                  }}
                >
                  Add Item
                </Button>
              </AccordionDetails>
              </Accordion>
              {/* Review Last meeting */}
              
{/* Review Last Meeting */}
<Accordion>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    aria-controls="review-last-meeting-content"
    id="review-last-meeting-header"
  >
    <Typography className="text-[#29346B] text-lg font-semibold">Review Last Meeting</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="font-bold text-[#29346B]">Topic</TableCell>
            <TableCell className="font-bold text-[#29346B]">Action By</TableCell>
            <TableCell className="font-bold text-[#29346B]">Target Date</TableCell>
            <TableCell className="font-bold text-[#29346B]">Review Status</TableCell>
            <TableCell className="font-bold text-[#29346B]">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviewLastMeeting.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Topic"
                  value={item.topic}
                  sx={commonInputStyles}
                  onChange={(e) => handleItemChange(index, "topic", e.target.value, reviewLastMeeting, setReviewLastMeeting)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Action By"
                  value={item.action_by}
                  sx={commonInputStyles}
                  onChange={(e) => handleItemChange(index, "action_by", e.target.value, reviewLastMeeting, setReviewLastMeeting)}
                />
              </TableCell>
              <TableCell>
                {/* <DatePicker
                  value={item.target_date}
                  onChange={(date) => handleItemChange(index, "target_date", date, reviewLastMeeting, setReviewLastMeeting)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      placeholder="Select Date"
                      sx={commonInputStyles}
                    />
                  )}
                /> */}
                <TextField
    type="date"
    fullWidth
    variant="outlined"
    InputLabelProps={{
      shrink: true,
    }}
    value={item.target_date ? new Date(item.target_date).toISOString().split('T')[0] : ''}
    sx={commonInputStyles}
    onChange={(e) => handleItemChange(index, "target_date", new Date(e.target.value), reviewLastMeeting, setReviewLastMeeting)}
  />
              </TableCell>
              <TableCell>
                <FormControl fullWidth variant="outlined" sx={commonInputStyles}>
                  <Select
                    value={item.review_status || ""}
                    onChange={(e) => handleItemChange(index, "review_status", e.target.value, reviewLastMeeting, setReviewLastMeeting)}
                    displayEmpty
                  >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Delayed">Delayed</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveItem(index, reviewLastMeeting, setReviewLastMeeting)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Button
      startIcon={<AddIcon />}
      onClick={() => handleAddItem(reviewLastMeeting, setReviewLastMeeting)}
      sx={{
        marginTop: 2,
        backgroundColor: "#29346B",
        color: "white",
        "&:hover": {
          backgroundColor: "#1a2246",
        },
      }}
    >
      Add Item
    </Button>
  </AccordionDetails>
</Accordion>

{/* New Points Discussed */}
<Accordion>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    aria-controls="new-points-content"
    id="new-points-header"
  >
    <Typography className="text-[#29346B] text-lg font-semibold">New Points Discussed</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="font-bold text-[#29346B]">Topic</TableCell>
            <TableCell className="font-bold text-[#29346B]">Action By</TableCell>
            <TableCell className="font-bold text-[#29346B]">Target Date</TableCell>
            <TableCell className="font-bold text-[#29346B]">Remarks</TableCell>
            <TableCell className="font-bold text-[#29346B]">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newPointsDiscussed.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Topic"
                  value={item.topic}
                  sx={commonInputStyles}
                  onChange={(e) => handleItemChange(index, "topic", e.target.value, newPointsDiscussed, setNewPointsDiscussed)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Action By"
                  value={item.action_by}
                  sx={commonInputStyles}
                  onChange={(e) => handleItemChange(index, "action_by", e.target.value, newPointsDiscussed, setNewPointsDiscussed)}
                />
              </TableCell>
              <TableCell>
                {/* <DatePicker
                  value={item.target_date}
                  onChange={(date) => handleItemChange(index, "target_date", date, newPointsDiscussed, setNewPointsDiscussed)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      placeholder="Select Date"
                      sx={commonInputStyles}
                    />
                  )}
                /> */}
                <TextField
    type="date"
    fullWidth
    variant="outlined"
    InputLabelProps={{
      shrink: true,
    }}
    value={item.target_date ? new Date(item.target_date).toISOString().split('T')[0] : ''}
    sx={commonInputStyles}
    onChange={(e) => handleItemChange(index, "target_date", new Date(e.target.value), reviewLastMeeting, setReviewLastMeeting)}
  />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Remarks"
                  value={item.remarks}
                  sx={commonInputStyles}
                  onChange={(e) => handleItemChange(index, "remarks", e.target.value, newPointsDiscussed, setNewPointsDiscussed)}
                />
              </TableCell>
              <TableCell>
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveItem(index, newPointsDiscussed, setNewPointsDiscussed)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Button
      startIcon={<AddIcon />}
      onClick={() => handleAddItem(newPointsDiscussed, setNewPointsDiscussed)}
      sx={{
        marginTop: 2,
        backgroundColor: "#29346B",
        color: "white",
        "&:hover": {
          backgroundColor: "#1a2246",
        },
      }}
    >
      Add Item
    </Button>
  </AccordionDetails>
</Accordion>

{/* Signatures Section */}
<div className="p-4 border border-gray-200 rounded-lg mt-4">
  <h3 className="text-[#29346B] text-xl font-semibold mb-3">Signatures</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block mb-1 text-[#29346B] font-semibold">
        Minutes Prepared By
      </label>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter Name"
        value={minutesPreparedBy}
        sx={commonInputStyles}
        onChange={(e) => setMinutesPreparedBy(e.target.value)}
      />
    </div>
    <div>
      <label className="block mb-1 text-[#29346B] font-semibold">
        Signature (Prepared By)
      </label>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Signature URL or Base64"
        value={signaturePreparedBy}
        sx={commonInputStyles}
        onChange={(e) => setSignaturePreparedBy(e.target.value)}
      />
      {signaturePreparedBy && (
        <div className="mt-2">
          <img 
            src={signaturePreparedBy} 
            alt="Prepared By Signature" 
            className="max-h-16" 
          />
        </div>
      )}
    </div>
    <div>
      <label className="block mb-1 text-[#29346B] font-semibold">
        Signature (Chairman)
      </label>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Signature URL or Base64"
        value={signatureChairman}
        sx={commonInputStyles}
        onChange={(e) => setSignatureChairman(e.target.value)}
      />
      {signatureChairman && (
        <div className="mt-2">
          <img 
            src={signatureChairman} 
            alt="Chairman Signature" 
            className="max-h-16" 
          />
        </div>
      )}
    </div>
  </div>
</div>

{/* Dialog Actions */}
<DialogActions sx={{ padding: '16px' }}>
  <Button 
    onClick={handleClose}
    sx={{
      color: "#29346B",
      borderColor: "#29346B",
      "&:hover": {
        borderColor: "#1a2246",
        backgroundColor: "rgba(41, 52, 107, 0.04)"
      }
    }}
    variant="outlined"
  >
    Cancel
  </Button>
  <Button
    onClick={handleSubmit}
    sx={{
      backgroundColor: "#FACC15",
      color: "#29346B",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "#FBBF24",
      }
    }}
    variant="contained"
  >
    Submit
  </Button>
</DialogActions>

            </div>
            </DialogContent>
            </Dialog>)}
