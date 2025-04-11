import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFetchUsersQuery } from "../../../../api/users/usersApi";
import { useGetActivitiesQuery } from "../../../../api/users/projectActivityApi";
import { useGetLandCategoriesQuery } from "../../../../api/users/categoryApi";
import { useGetCompaniesQuery } from "../../../../api/company/companyApi";
import { useGetDropdownSubActivitiesQuery } from "../../../../api/users/subActivityApi";
import { useGetMultipleSubSubActivitiesMutation } from "../../../../api/users/multipleActivityApi";
import { useGetLandBankMasterQuery } from "../../../../api/users/landbankApi";
import { toast } from "react-toastify";
import { useCreateMainProjectMutation } from "../../../../api/users/projectApi";
// import { useFetchUsersQuery } from '../api/userApi';
function ProjectCreate({ open, handleClose, refetch }) {
  const { data: usersData, isLoading } = useFetchUsersQuery();
  const spocOptions =
    usersData?.map((user) => ({
      id: user.id,
      full_name: user.full_name,
    })) || [];

  const { data: activitiesData, isLoading: activitiesLoading } =
    useGetActivitiesQuery();
  const { data: companiesData, isLoading: companiesLoading } =
    useGetCompaniesQuery();
  const [
    getSubSubActivities,
    { data: subSubActivitiesData, isLoading: subSubActivitiesLoading },
  ] = useGetMultipleSubSubActivitiesMutation();
  const [createMainProject, { isError, isSuccess, error }] =
    useCreateMainProjectMutation();
  // console.log("SUB SUB SUB:",subSubActivitiesData)
  const activitiesFetched = activitiesData?.data || []; // Ensure we get an array
  const companyOptions =
    companiesData?.data?.map((company) => ({
      id: company.id,
      label: company.company_name, // Ensures proper display in dropdown
    })) || [];

  const [companyName, setCompanyName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedLandId, setSelectedLandId] = useState(null);
  const [projectLocation, setProjectLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [codDate, setCodDate] = useState("");
  const [committedDate, setCommittedDate] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [capacity, setCapacity] = useState("");
  const [numDays, setNumDays] = useState("");
  const [locations, setLocations] = useState([]);
  // State for selection fields
  const [projectCategory, setProjectCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [activity, setActivity] = useState(null);
  const [subActivities, setSubActivities] = useState([]);
  // console.log("Sub categories id",subActivities)
  const [spoc, setSpoc] = useState(null);
  const [criticalActivity, setCriticalActivity] = useState(null);
  const [selectedMultipleActivities, setSelectedMultipleActivities] = useState(
    []
  );
  const [multipleActivities, setMultipleActivities] = useState([]);
  const { data: categories } = useGetLandCategoriesQuery();
  const [ciUtility, setCiUtility] = useState(null);
  const [cppIpp, setCppIpp] = useState(null);
  const [electricityLine, setElectricityLine] = useState(null);
  const [areaError, setAreaError] = useState("");

  const ciUtilityOptions = [
    { id: "ci", label: "CI" },
    { id: "utility", label: "Utility" },
  ];

  const cppIppOptions = [
    { id: "cpp", label: "CPP" },
    { id: "ipp", label: "IPP" },
  ];

  const electricityLineOptions = [
    { id: "1", label: "11KV" },
    { id: "2", label: "33KV" },
  ];
  const { data: landBankData, isLoading: LandLoading } =
    useGetLandBankMasterQuery();
  // const [selectedLandId, setSelectedLandId] = useState(null);
  const [totalLandArea, setTotalLandArea] = useState("");
  const [selectTotalLandArea, setSelectTotalLandArea] = useState();
  const landOptions =
    landBankData?.data?.map((land) => ({
      id: land.id,
      label: land.land_name,
      totalArea: land.total_land_area,
    })) || [];

  const handleLandChange = (event, value) => {
    if (value) {
      setSelectedLandId(value.id);
      setTotalLandArea(value.totalArea);
      setTotalArea("");
      setAreaError("");
    } else {
      setSelectedLandId(null);
      setTotalLandArea("");
      setTotalArea("");
      setAreaError("");
    }
  };

  const handleTotalAreaChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setTotalArea("");
      setAreaError("");
      return;
    }

    const numericValue = parseFloat(inputValue);
    const availableArea = parseFloat(totalLandArea);

    if (isNaN(numericValue) || numericValue < 0) {
      setAreaError("Please enter a valid positive number");
    } else if (numericValue > availableArea) {
      setAreaError(
        `Selected area cannot exceed available land area of ${availableArea}`
      );
    } else {
      setAreaError("");
    }

    setTotalArea(inputValue);
  };

  // console.log("Multiple activities",multipleActivities);
  // const criticalActivities = ["Critical 1", "Critical 2", "Critical 3"];
  const { data: subActivitiesData, isLoading: subActivitiesLoading } =
    useGetDropdownSubActivitiesQuery(activity, {
      skip: !activity,
    });

  const subActivitiesOptions =
    subActivitiesData?.data[0]?.sub_activity?.map((sub) => ({
      id: sub.sub_activity_id, // FIX: Correct ID key
      label: sub.sub_activity_name,
    })) || [];

  // console.log("sub",subActivitiesOptions);

  useEffect(() => {
    if (subActivities.length > 0) {
      getSubSubActivities(subActivities);
    }
  }, [subActivities, getSubSubActivities]); // Make sure getSubSubActivities is memoized if needed

  // useEffect(() => {
  //     if (subSubActivitiesData?.data) {
  //         console.log("Check:",subSubActivitiesData?.data)
  //         const formattedActivities = subSubActivitiesData.data.map(activity => (
  //             {
  //                 id: activity.id,
  //                 name: activity?.sub_sub_activity_name[0]
  //             }));
  //         setMultipleActivities(formattedActivities);
  //         setSelectedMultipleActivities([]);
  //     }
  // }, [subSubActivitiesData]);
  useEffect(() => {
    if (subSubActivitiesData?.data) {
      const formattedActivities = subSubActivitiesData.data.map((activity) => ({
        id: activity?.id,
        name: activity?.sub_sub_activity_name[0],
      }));
      // console.log("SUBSUB Activity",formattedActivities);
      setMultipleActivities(formattedActivities);
      setSelectedMultipleActivities([]);
    }
  }, [subSubActivitiesData]);

  // console.log("Select Checkeeer",selectedMultipleActivities)
  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      border: "1px solid #FACC15",
      borderBottom: "4px solid #FACC15",
      borderRadius: "6px",
      padding: "1px",
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      outline: "none",
      borderBottom: "4px solid #E6A015",
    },
  };

  const handleSubmit = async () => {
    let isValid = true;

    if (!companyName) {
      toast.error("Company Name is required");
      isValid = false;
    }
    if (!projectName) {
      toast.error("Project Name is required");
      isValid = false;
    }
    if (!selectedLandId) {
      toast.error("Land selection is required");
      isValid = false;
    }
    if (!totalArea) {
      toast.error("Total Area is required");
      isValid = false;
    }
    if (!startDate) {
      toast.error("Start Date is required");
      isValid = false;
    }
    if (!endDate) {
      toast.error("End Date is required");
      isValid = false;
    }
    if (!codDate) {
      toast.error("COD Date is required");
      isValid = false;
    }
    if (!committedDate) {
      toast.error("Committed Date is required");
      isValid = false;
    }
    if (!capacity) {
      toast.error("Capacity is required");
      isValid = false;
    }
    if (!ciUtility) {
      toast.error("CI Utility selection is required");
      isValid = false;
    }
    if (!cppIpp) {
      toast.error("CPP/IPP selection is required");
      isValid = false;
    }
    if (!electricityLine) {
      toast.error("Electricity Line selection is required");
      isValid = false;
    }
    if (!projectCategory) {
      toast.error("Project Category is required");
      isValid = false;
    }
    if (!activity) {
      toast.error("Activity selection is required");
      isValid = false;
    }
    if (subActivities.length === 0) {
      toast.error("At least one Sub Activity is required");
      isValid = false;
    }
    if (selectedMultipleActivities.length === 0) {
      toast.error("At least one Multiple Activity is required");
      isValid = false;
    }
    // console.log("New new new check",selectedMultipleActivities);
    if (!spoc) {
      toast.error("SPOC selection is required");
      isValid = false;
    }

    if (!isValid) {
      return; // Stop execution if validation fails
    }

    // Proceed with form submission if all fields are filled
    // console.log("Form submitted successfully!");
    const submissionData = {
      company_id: companyName,
      landbank_id: selectedLandId,
      project_name: projectName.trim(),
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      alloted_land_area: totalArea,
      available_land_area: totalLandArea,
      cod_commission_date: new Date(codDate).toISOString(),
      capacity: capacity,
      ci_or_utility: ciUtility.id,
      cpp_or_ipp: cppIpp.id,
      project_activity_id: activity,
      electricity_line_id: electricityLine.id,
      spoc_user: spoc,
      project_predication_date: new Date(committedDate).toISOString(),
      location_name:Array.isArray(locations)?locations.join(', '):locations,
      project_sub_activity_ids: subActivities.map(Number),
      project_sub_sub_activity_ids: selectedMultipleActivities.map(
        (item) => item.id
      ),
    };
    // console.log("Submitting form",submissionData)
    try {
      const response = await createMainProject(submissionData).unwrap(); // Call mutation & unwrap response
      console.log("Project Created:", response);
      refetch();
      handleClose();

      // alert("Project Created Successfully!");
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project");
    }
  };

  useEffect(() => {
    if (!open) {
      setCompanyName("");
      setProjectName("");
      setSelectedLandId(null);
      setProjectLocation("");
      setStartDate("");
      setEndDate("");
      setCodDate("");
      setCommittedDate("");
      setTotalArea("");
      setCapacity("");
      setNumDays("");
      setProjectCategory(null);
      setSubCategory(null);
      setActivity(null);
      setSubActivities([]);
      setSpoc(null);
      setCriticalActivity(null);
      setSelectedMultipleActivities([]);
      setMultipleActivities([]);
      setCiUtility(null);
      setCppIpp(null);
      setElectricityLine(null);
      setAreaError("");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent>
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">
          Create Project
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Select Company
            </label>
            <Autocomplete
              options={companyOptions}
              getOptionLabel={(option) => option.label}
              value={
                companyOptions.find((comp) => comp.id === companyName) || null
              } // Match selected value
              onChange={(_, value) => setCompanyName(value?.id || "")} // Store only ID in state
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select Company"
                  sx={inputStyles}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Select Project Name
            </label>
            <TextField
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Select Project Name"
              fullWidth
              sx={inputStyles}
            />
          </div>
          {/* <div className='flex flex-col gap-2'>
                        <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                            Project Location
                        </label>
                        <TextField value={projectLocation} onChange={(e) => setProjectLocation(e.target.value)} placeholder='Project Location' fullWidth sx={inputStyles} />
                    </div> */}
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Select Land
            </label>
            <Autocomplete
              options={landOptions}
              getOptionLabel={(option) => option.label}
              onChange={handleLandChange}
              loading={isLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select Land"
                  sx={inputStyles}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            {selectedLandId && (
              <div className="flex flex-col gap-2">
                <label className="block text-[#29346B] text-lg font-semibold">
                  Total Land Area
                </label>
                <TextField
                  value={totalLandArea}
                  disabled
                  fullWidth
                  sx={inputStyles}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Add Total Area
            </label>
            <TextField
              type="number"
              value={totalArea}
              onChange={handleTotalAreaChange}
              placeholder="Add Total Area"
              fullWidth
              sx={inputStyles}
              error={!!areaError}
              helperText={areaError}
              disabled={!totalLandArea} // Disable if no land is selected
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Start Date
            </label>
            <TextField
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              sx={inputStyles}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              End Date
            </label>
            <TextField
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              sx={inputStyles}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Cod Date
            </label>
            <TextField
              type="date"
              value={codDate}
              onChange={(e) => setCodDate(e.target.value)}
              fullWidth
              sx={inputStyles}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Committed Date
            </label>
            <TextField
              type="date"
              value={committedDate}
              onChange={(e) => setCommittedDate(e.target.value)}
              fullWidth
              sx={inputStyles}
            />
          </div>
          {/* <div className='flex flex-col gap-2'>
                        <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                            Add Total Area
                        </label>
                        <TextField type='number' value={totalArea} onChange={(e) => setTotalArea(e.target.value)} placeholder='Add Total Area' fullWidth sx={inputStyles} />
                    </div> */}
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Add Capacity
            </label>
            <TextField
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Add Capacity"
              fullWidth
              sx={inputStyles}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Utility Options
            </label>
            <Autocomplete
              options={ciUtilityOptions}
              getOptionLabel={(option) => option.label}
              value={ciUtility}
              onChange={(_, value) => setCiUtility(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select CI/Utility"
                  sx={inputStyles}
                />
              )}
            />
          </div>

          {/* CPP/IPP Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              CPP/IPP
            </label>
            <Autocomplete
              options={cppIppOptions}
              getOptionLabel={(option) => option.label}
              value={cppIpp}
              onChange={(_, value) => setCppIpp(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select CPP/IPP"
                  sx={inputStyles}
                />
              )}
            />
          </div>

          {/* Electricity Line Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Electricity Line
            </label>
            <Autocomplete
              options={electricityLineOptions}
              getOptionLabel={(option) => option.label}
              value={electricityLine}
              onChange={(_, value) => setElectricityLine(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select Electricity Line"
                  sx={inputStyles}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Project Category
            </label>
            <Autocomplete
              options={
                categories?.data?.map((category) => ({
                  id: category.id,
                  label: category.category_name, // Ensure Autocomplete has a label
                })) || []
              }
              value={projectCategory}
              onChange={(_, value) => setProjectCategory(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select Project Category"
                  sx={inputStyles}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Select Activity
            </label>
            <Autocomplete
              options={activitiesFetched}
              getOptionLabel={(option) => option.activity_name} // Display the activity name
              value={
                activitiesFetched.find((act) => act.id === activity) || null
              } // Match selected activity
              onChange={(_, value) => setActivity(value?.id || null)} // Store only ID
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select Activity"
                  sx={inputStyles}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Select Sub Activities
            </label>
            <Autocomplete
              multiple
              options={subActivitiesOptions}
              getOptionLabel={(option) => option.label}
              value={
                subActivitiesOptions.filter((sub) =>
                  subActivities.includes(sub.id)
                ) || []
              }
              onChange={(_, selected) =>
                setSubActivities(selected?.map((sub) => sub.id) || [])
              }
              disabled={!activity}
              loading={subActivitiesLoading}
              isOptionEqualToValue={(option, value) => option?.id === value?.id} // Ensures correct selection
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select Sub Activity"
                  sx={inputStyles}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Select Multiple Activities
            </label>
            {/* <Autocomplete
        multiple
        options={multipleActivities}
        getOptionLabel={(option) => option.name || ''}
        value={selectedMultipleActivities}
        onChange={(_, newValue) => {
            setSelectedMultipleActivities(newValue);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disabled={subSubActivitiesLoading || multipleActivities.length === 0}
        renderInput={(params) => (
            <TextField 
                {...params} 
                fullWidth 
                placeholder="Select Multiple Activities" 
                sx={inputStyles}
            />
        )}
    /> */}
            <Autocomplete
              multiple
              options={multipleActivities}
              getOptionLabel={(option) => option.name || ""}
              value={selectedMultipleActivities}
              onChange={(_, newValue) => {
                // console.log("new check",newValue)
                setSelectedMultipleActivities(newValue);
              }}
              isOptionEqualToValue={(option, value) => {
                if (
                  typeof value === "object" &&
                  value !== null &&
                  typeof option === "object" &&
                  option !== null
                ) {
                  return option.id === value.id;
                }
                return false;
              }}
              disabled={
                subSubActivitiesLoading || multipleActivities.length === 0
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select Multiple Activities"
                  sx={inputStyles} // Make sure inputStyles is defined
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              SPOC
            </label>
            <Autocomplete
              options={spocOptions}
              getOptionLabel={(option) => option.full_name} // Display full name
              value={spocOptions.find((user) => user.id === spoc) || null}
              onChange={(_, selectedUser) => setSpoc(selectedUser?.id || null)} // Store only a single user ID
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select SPOC"
                  sx={inputStyles}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Enter number of Days
            </label>
            <TextField
              type="number"
              value={numDays}
              onChange={(e) => setNumDays(e.target.value)}
              placeholder="Enter number of Days"
              fullWidth
              sx={inputStyles}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Add Locations
            </label>
            <Autocomplete
              multiple
              freeSolo
              options={[]} // You can populate this if you have location suggestions
              value={locations}
              onChange={(_, newValue) => setLocations(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Type and press Enter to add location"
                  sx={inputStyles}
                />
              )}
            />
          </div>

          {/* <Autocomplete options={criticalActivities} value={criticalActivity} onChange={(_, value) => setCriticalActivity(value)} renderInput={(params) => <TextField {...params} fullWidth placeholder='Select Critical Activity' sx={inputStyles} />} /> */}
        </div>
        <div className="flex flex-row justify-center my-4">
          <Button
            onClick={handleSubmit}
            variant="contained"
            style={{
              backgroundColor: "#FF8C00",
              color: "white",
              fontWeight: "bold",
              padding: "10px 30px",
              fontSize: "16px",
              textTransform: "none",
            }}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectCreate;
