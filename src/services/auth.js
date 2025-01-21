import apiService from "./apiService";

export const login = async (loginData) => {
    try {
      const response = await apiService.post('/user_profile/login', {
        username: loginData.username,
        password: loginData.password,
        group_id: loginData.group_id,
      });
  
      if (response.data && response.data.data && response.data.data.token) {
        sessionStorage.setItem('token', response.data.data.token);
      }
  
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  export const authenticateToken = (token) => {
    return apiService.post('/get_user_from_token', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  };

  export const logout = (navigate) => {
    sessionStorage.clear();
    navigate('/login');
  };
  