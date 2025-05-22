import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const PasswordResetModal = ({
  passwordModal,
  handleClosePasswordModal,
  newPassword,
  setNewPassword,
  newPasswordConfirm,
  setNewPasswordConfirm,
  handlePasswordReset
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    score: 0
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Password validation function
  const validatePassword = (pwd) => {
    const minLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    
    const score = [minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;
    
    setPasswordStrength({
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      score
    });
  };

  // Check if passwords match
  const checkPasswordMatch = () => {
    if (newPasswordConfirm === '') {
      setPasswordsMatch(true);
      return;
    }
    setPasswordsMatch(newPassword === newPasswordConfirm);
  };

  // Handle new password change
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    setNewPasswordConfirm(e.target.value);
  };

  // Check password match whenever passwords change
  useEffect(() => {
    checkPasswordMatch();
  }, [newPassword, newPasswordConfirm]);

  // Get password strength color and text
  const getPasswordStrengthInfo = () => {
    if (passwordStrength.score === 0) return { color: 'text-gray-400', text: 'Enter password' };
    if (passwordStrength.score <= 2) return { color: 'text-red-500', text: 'Weak' };
    if (passwordStrength.score <= 3) return { color: 'text-yellow-500', text: 'Fair' };
    if (passwordStrength.score <= 4) return { color: 'text-blue-500', text: 'Good' };
    return { color: 'text-green-500', text: 'Strong' };
  };

  const strengthInfo = getPasswordStrengthInfo();

  // Check if form is valid
  const isFormValid = passwordStrength.score >= 4 && passwordsMatch && newPassword !== '' && newPasswordConfirm !== '';

  // Password requirement component
  const PasswordRequirement = ({ met, text }) => (
    <div className="flex items-center space-x-2 text-sm">
      {met ? (
        <CheckCircleIcon className="w-4 h-4 text-green-500" />
      ) : (
        <CancelIcon className="w-4 h-4 text-red-500" />
      )}
      <span className={met ? 'text-green-600' : 'text-red-600'}>{text}</span>
    </div>
  );

  return (
    <Dialog 
      open={passwordModal} 
      onClose={handleClosePasswordModal}
      sx={{
        '& .MuiDialog-paper': {
          width: '600px',
          maxWidth: '90vw',
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
          {/* New Password Field */}
          <div>
            <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700 mb-2">
              New Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="Enter new password"
                className="border p-3 pr-12 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                  <span className={`text-sm font-semibold ${strengthInfo.color}`}>
                    {strengthInfo.text}
                  </span>
                </div>
                
                {/* Strength Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 2 ? 'bg-red-500' :
                      passwordStrength.score <= 3 ? 'bg-yellow-500' :
                      passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                
                {/* Password Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <PasswordRequirement 
                    met={passwordStrength.minLength} 
                    text="At least 8 characters" 
                  />
                  <PasswordRequirement 
                    met={passwordStrength.hasUppercase} 
                    text="One uppercase letter" 
                  />
                  <PasswordRequirement 
                    met={passwordStrength.hasLowercase} 
                    text="One lowercase letter" 
                  />
                  <PasswordRequirement 
                    met={passwordStrength.hasNumber} 
                    text="One number" 
                  />
                  <PasswordRequirement 
                    met={passwordStrength.hasSpecialChar} 
                    text="One special character" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={newPasswordConfirm}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm new password"
                className={`border p-3 pr-12 rounded-md w-full border-yellow-300 border-b-4 focus:outline-none ${
                  newPasswordConfirm && !passwordsMatch 
                    ? 'border-b-red-400 border-red-300' 
                    : newPasswordConfirm && passwordsMatch 
                    ? 'border-b-green-400 border-green-300' 
                    : 'border-b-yellow-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {newPasswordConfirm && (
              <div className="mt-2">
                {passwordsMatch ? (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Passwords match</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-sm text-red-600">
                    <CancelIcon className="w-4 h-4" />
                    <span>Passwords do not match</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Overall Form Status */}
          {(newPassword || newPasswordConfirm) && (
            <div className="mt-2 p-3 rounded-md bg-gray-50 border-l-4 border-gray-400">
              <div className="flex items-center space-x-2">
                {isFormValid ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-700">
                      Ready to reset password
                    </span>
                  </>
                ) : (
                  <>
                    <CancelIcon className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-medium text-orange-700">
                      Please meet all requirements to continue
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Button
          onClick={handlePasswordReset}
          disabled={!isFormValid}
          variant="contained"
          sx={{
            backgroundColor: isFormValid ? '#F6812D' : '#CCCCCC',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '6px 36px',
            width: '200px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: isFormValid ? '#E66A1F' : '#CCCCCC',
            },
            '&:disabled': {
              backgroundColor: '#CCCCCC',
              color: '#888888',
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