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

                // Update AuthContext
                contextLogin(
                    {
                        id: response.data.id,
                        name: response.data.full_name,
                        group: { id: response.data.group_id, name: response.data.group_name }
                    },
                    response.data.token,
                    [] // Permissions will be updated when backend supports them
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
        <div className="h-[100vh] w-[100vw] bg-white-500 flex flex-row">
            <div className='h-[100vh] w-[70vw]'>
                <img className='fit h-[100vh] w-[100%] object-cover' src={loginImg} />
            </div>
            <div className='w-[30vw]'>
                <div className='flex flex-col mt-20 items-center gap-1'>
                    <div>
                        <img className='h-[80px] w-[80px]' src={logoImg} />
                    </div>
                    <div>
                        <h2 className='text-3xl text-[#29346B] font-semibold'>Create an Account</h2>
                    </div>
                    <div>
                        <p className='text-[#29346B]'>Your energy, your control - sign up now.</p>
                    </div>
                </div>
                <div>
                    <form onSubmit={handleFormSubmit} className='flex flex-col w-[70%] mx-auto gap-4 my-8'>
                        <input type='email' name='email' value={inputForm.email} className='border border-b-4 p-2 rounded-md outline-none' onChange={handleInput} placeholder='Email' />
                        <input type='password' name='password' value={inputForm.password} className='border border-b-4 p-2 rounded-md outline-none' onChange={handleInput} placeholder='Password' />
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 p-2 text-white rounded-md'>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
