import React, { useState } from 'react';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  useCreateUserMutation, 
  useFetchDepartmentQuery, 
  useFetchUsersQuery, 
  useUpdateUserMutation, 
  useUpdateUserPasswordMutation, 
  useUpdateUserStatusMutation,
  useAssignUserAllThingsMutation, // Assign hook
  useGetUserAllThingsQuery // Add this hook
} from '../../../../api/users/usersApi';
import { useGetAllGroupsQuery } from '../../../../api/permission/permissionApi';
// import { useGetMainProjectsQuery } from '../../../../api/projects/projectsApi';
import { useGetMainProjectsQuery } from '../../../../api/users/projectApi'; // Using this path as per your code

// Import our components
import UserTableHeader from './UserTableHeader';
import UserTableContent from './UserTableContent';
import UserTablePagination from './UserTablePagination';
import AddEditUserModal from './AddEditUserModal';
import PasswordResetModal from './PasswordResetModal';
import AssignUserModal from './AssignUserModal';
import ViewUserAssignmentsModal from './ViewUserAssignmentsModal'; // Add this import

function UserTable() {
  // --- API related hooks ---
  const { 
    data: users, 
    error, 
    isLoading, 
    refetch 
  } = useFetchUsersQuery();
  
  const { 
    data: departmentData, 
    error: DepartmentError, 
    isLoading: DepartmentLoading 
  } = useFetchDepartmentQuery();
  
  const { 
    data: groupData, 
    isLoading: GroupLoading, 
    error: GroupError 
  } = useGetAllGroupsQuery();

  const {
    data: projectData,
    isLoading: ProjectLoading,
    error: ProjectError
  } = useGetMainProjectsQuery();
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [updateUserPassword] = useUpdateUserPasswordMutation();
  const [assignUserAllThings] = useAssignUserAllThingsMutation();
  const getUserAllThings = useGetUserAllThingsQuery; // This is a factory function
  
  const navigate = useNavigate();

  // --- State management ---
  // Filter and pagination state
  const [userFilter, setUserFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // User form state
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState([1]);
  const [dob, setDob] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [group, setGroup] = useState("");
  
  // Password reset modal state
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordModal, setPasswordModal] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);

  // Assignment modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUserForAssignment, setSelectedUserForAssignment] = useState(null);
  
  // View Assignments modal state (new)
  const [viewAssignmentsModalOpen, setViewAssignmentsModalOpen] = useState(false);
  const [selectedUserIdForViewAssignments, setSelectedUserIdForViewAssignments] = useState(null);

  // --- Toast notifications ---
  const showSuccessToast = (message) => {
    toast.success(message);
  };
  
  const showErrorToast = (message) => {
    toast.error(message);
  };

  // --- Handlers ---
  // Filter data
  const filteredRows = isLoading || !users ? [] : users.filter((row) =>
    row.full_name?.toLowerCase().includes(userFilter?.toLowerCase())
  );
  
  // Get current page rows
  const currentRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Navigation
  const handleGroupRedirect = () => {
    navigate('/user-groups');
  };

  // User modal handlers
  const handleOpenModal = (user = null) => {
    if (user) {
      setIsEditMode(true);
      setEmail(user?.email || '');
      setFullName(user?.full_name || '');
      setPhone(user?.phone || '');
      setAddress(user?.address || '');
      setPassword('');
      setDob(user?.dob || '');
      setDepartment(user?.department || '');
      setDesignation(user?.designation || '');
      setProfileImage(user?.profile_image || null);
      setSelectedUserId(user?.id);
      setGroup(user?.group_id || "");
    } else {
      setIsEditMode(false);
      setEmail('');
      setFullName('');
      setPhone('');
      setAddress('');
      setPassword('');
      setUserRole([1]);
      setDob('');
      setDepartment('');
      setDesignation('');
      setProfileImage(null);
      setPreviewImage(null);
      setGroup("");
    }
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  // Password modal handlers
  const handleOpenPasswordModal = (user) => {
    setSelectedUserForPassword(user);
    setPasswordModal(true);
    setNewPassword('');
    setNewPasswordConfirm('');
  };

  const handleClosePasswordModal = () => {
    setPasswordModal(false);
    setNewPassword('');
    setNewPasswordConfirm('');
    setSelectedUserForPassword(null);
  };

  // Assignment modal handlers
  const handleOpenAssignModal = (user) => {
    setSelectedUserForAssignment(user);
    setAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedUserForAssignment(null);
  };
  
  // View Assignments modal handlers (new)
  const handleOpenViewAssignmentsModal = (userId) => {
    setSelectedUserIdForViewAssignments(userId);
    setViewAssignmentsModalOpen(true);
  };
  
  const handleCloseViewAssignmentsModal = () => {
    setViewAssignmentsModalOpen(false);
    setSelectedUserIdForViewAssignments(null);
  };

  // API handlers
  const handleSaveUser = async () => {
    if (!email || !fullName || !phone) {
      toast.error('Please fill in all the required fields (email, full name, phone).');
      return;
    }

    try {
      if (isEditMode) {
        const formData = new FormData();
        
        formData.append('email', email);
        formData.append('full_name', fullName);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('user_role', JSON.stringify(userRole));
        formData.append('dob', dob);
        formData.append('department_id', department);
        formData.append('designation', designation);
        formData.append('group_id', group);
        
        if (profileImage) {
          formData.append('profile_image', profileImage);
        }
        
        const response = await updateUser({ userId: selectedUserId, formData: formData });
        
        if (response?.data?.status) {
          showSuccessToast('User updated successfully!');
          refetch();
        } else {
          showErrorToast(response?.data?.message || 'Error updating user');
        }
      } else {
        const userPayload = { 
          email, 
          full_name: fullName, 
          phone, 
          address, 
          password, 
          user_role: userRole 
        };
        
        const response = await createUser(userPayload);
        
        if (response?.data?.status) {
          showSuccessToast('User created successfully!');
          refetch();
        } else {
          showErrorToast(response?.data?.message || 'Error creating user');
        }
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
      showErrorToast('An error occurred while saving the user');
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      await updateUserStatus({ userId: id });
      refetch();
      showSuccessToast('User status updated successfully!');
    } catch (error) {
      console.error('Error updating user status:', error);
      showErrorToast('Error updating user status');
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== newPasswordConfirm) {
      showErrorToast("Passwords don't match.");
      return;
    }

    try {
      const response = await updateUserPassword({ 
        userId: selectedUserForPassword.id, 
        password: newPassword 
      });
      
      if (!response?.data?.status) {
        showErrorToast("Something went wrong.");
      } else {
        showSuccessToast("Password updated successfully.");
      }
      
      handleClosePasswordModal();
    } catch (error) {
      console.error('Password reset failed:', error);
      showErrorToast("Something went wrong.");
    }
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[80%] mx-auto my-8 rounded-md">
      {/* Header with search and add button */}
      <UserTableHeader 
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        handleOpenModal={handleOpenModal}
        handleGroupRedirect={handleGroupRedirect}
      />
      
      {/* Table content */}
      <UserTableContent 
        isLoading={isLoading}
        error={error}
        currentRows={currentRows}
        handleOpenModal={handleOpenModal}
        handleUpdateStatus={handleUpdateStatus}
        handleOpenPasswordModal={handleOpenPasswordModal}
        handleOpenAssignModal={handleOpenAssignModal}
        handleOpenViewAssignmentsModal={handleOpenViewAssignmentsModal} // Add the handler here
      />
      
      {/* Pagination */}
      {!isLoading && !error && users && (
        <UserTablePagination 
          filteredRowsLength={filteredRows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
      
      {/* Add/Edit User Modal */}
      <AddEditUserModal 
        open={open}
        handleCloseModal={handleCloseModal}
        handleSaveUser={handleSaveUser}
        isEditMode={isEditMode}
        fullName={fullName}
        setFullName={setFullName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        address={address}
        setAddress={setAddress}
        password={password}
        setPassword={setPassword}
        userRole={userRole}
        setUserRole={setUserRole}
        dob={dob}
        setDob={setDob}
        department={department}
        setDepartment={setDepartment}
        designation={designation}
        setDesignation={setDesignation}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
        group={group}
        setGroup={setGroup}
        departmentData={departmentData}
        groupData={groupData}
        GroupLoading={GroupLoading}
        GroupError={GroupError}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
      
      {/* Password Reset Modal */}
      <PasswordResetModal 
        passwordModal={passwordModal}
        handleClosePasswordModal={handleClosePasswordModal}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        newPasswordConfirm={newPasswordConfirm}
        setNewPasswordConfirm={setNewPasswordConfirm}
        handlePasswordReset={handlePasswordReset}
      />

      {/* Assignment Modal */}
      <AssignUserModal
        open={assignModalOpen}
        handleClose={handleCloseAssignModal}
        selectedUser={selectedUserForAssignment}
        departmentData={departmentData}
        projectData={projectData}
        groupData={groupData}
        assignUserAllThings={assignUserAllThings}
        onSuccess={refetch}
      />
      
      {/* View Assignments Modal (new) */}
<ViewUserAssignmentsModal
  open={viewAssignmentsModalOpen}
  handleClose={handleCloseViewAssignmentsModal}
  selectedUserId={selectedUserIdForViewAssignments}
  getUserAllThings={getUserAllThings}
  assignUserAllThings={assignUserAllThings}
  onSuccess={refetch}
/>
    </div>
  );
}

export default UserTable;