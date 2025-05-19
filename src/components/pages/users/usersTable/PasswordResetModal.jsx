import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const PasswordResetModal = ({
  passwordModal,
  handleClosePasswordModal,
  newPassword,
  setNewPassword,
  newPasswordConfirm,
  setNewPasswordConfirm,
  handlePasswordReset
}) => {
  return (
    <Dialog 
      open={passwordModal} 
      onClose={handleClosePasswordModal}
      sx={{
        '& .MuiDialog-paper': {
          width: '500px',
          padding: '20px',
        }
      }}
    >
      <DialogTitle
        sx={{
          color: '#29346B',
          fontSize: '24px',
          fontWeight: '600',
          paddingTop: '20px',
        }}
      >
        Reset Password
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="border p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="border p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Button
          onClick={handlePasswordReset}
          variant="contained"
          sx={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '6px 36px',
            width: '200px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#E66A1F',
            },
          }}
        >
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordResetModal;