import React, { useContext, useState } from 'react';
import loginImg from '../assets/mainBackgroundImage.png';
import logoImg from '../assets/logo.png';
import { toast } from 'react-toastify';
import { login } from '../services/auth';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const { login: contextLogin } = useContext(AuthContext);

    const [inputForm, setInputForm] = useState({
        email: '',
        password: '',
        login_type: 'desktop',
    });

    const handleInput = (e) => {
        setInputForm({ ...inputForm, [e.target.name]: e.target.value });
    };

const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (inputForm.email.trim() === '') {
        toast.error("Please add an email");
        return;
    }
    if (inputForm.password.trim() === '') {
        toast.error("Please add a password");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("email", inputForm.email);
        formData.append("password", inputForm.password);
        formData.append("login_type", inputForm.login_type);

        const response = await login(formData);
        console.log("Login API Response:", response);

        if (response.status) {
            toast.success(response.message);
            sessionStorage.setItem("token", response.data.token);

            // Update AuthContext with email included
            contextLogin(
                {
                    id: response.data.id,
                    name: response.data.full_name,
                    email: inputForm.email, // Add the email here
                    group: { id: response.data.group_id, name: response.data.group_name },
                    groups: response.data.groups,
                    department: response.data.department,
                    assignments: response.data.assignments
                },
                response.data.token,
                response.data.user_permissions || [] // Use permissions from response
            );
            window.location.href = '/';
        } else {
            toast.error(response.message);
        }
    } catch (error) {
        toast.error(error.message || 'Login failed. Please try again.');
    }
};

    return (
        <div className="min-h-screen  w-full bg-white flex flex-col md:flex-row">
            {/* Image Section - Hidden on mobile, visible on md and up */}
            <div className="hidden md:block md:w-3/5 lg:w-2/3">
                <img 
                    className="h-full w-full object-cover" 
                    src={loginImg} 
                    alt="Login background"
                />
            </div>
            
            {/* Login Form Section */}
            <div className="w-full md:w-2/5 lg:w-1/3 px-6 py-10 md:py-0 flex flex-col justify-center">
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div>
                        <img 
                            className="h-16 w-16 md:h-20 md:w-20" 
                            src={logoImg} 
                            alt="Company logo"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl text-[#29346B] font-semibold text-center">
                            Login in to you account
                        </h2>
                    </div>
                    <div>
                        <p className="text-sm md:text-base text-[#29346B] text-center">
                            Test 1Your energy, your control - sign in now.
                        </p>
                    </div>
                </div>
                
                <div className="w-full max-w-md mx-auto">
                    <form 
                        onSubmit={handleFormSubmit} 
                        className="flex flex-col w-full gap-4"
                    >
                        <input 
                            type="email" 
                            name="email" 
                            value={inputForm.email} 
                            className="border border-b-4 p-3 rounded-md outline-none" 
                            onChange={handleInput} 
                            placeholder="Email" 
                        />
                        <input 
                            type="password" 
                            name="password" 
                            value={inputForm.password} 
                            className="border border-b-4 p-3 rounded-md outline-none" 
                            onChange={handleInput} 
                            placeholder="Password" 
                        />
                        <button 
                            type="submit" 
                            className="bg-blue-500 hover:bg-blue-700 p-3 text-white rounded-md transition-colors duration-200"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;