import React, { useState } from 'react'
import loginImg from '../assets/mainBackgroundImage.png'
import logoImg from '../assets/logo.png'
import { toast } from 'react-toastify';
import { login } from '../services/auth'; 

function Login() {
    const showToast = () => {
        toast.success("This is a success toast!");
      };

    const [inputForm,setInputForm]=useState({
        name:'',
        email:'',
        password:'',
        login_type:'desktop'
    })
    const handleInput=(e)=>{
        setInputForm({...inputForm,[e.target.name]:e.target.value})
    }

    const handleFormSubmit = async(e) => {
        e.preventDefault();

        if (inputForm?.email.trim() === '') {
          toast.error("Please add an email");
          return; // Stop form submission
        }
    
        if (inputForm?.password.trim() === '') {
          toast.error("Please add a password");
          return; 
        }

        try {
          const formData = new FormData();
          formData.append("email", inputForm.email);
          formData.append("password", inputForm.password);
          formData.append("login_type", inputForm.login_type);

          const response = await login(formData);

          if (response.status) {
              toast.success(response.message);

              // Store token in sessionStorage
              sessionStorage.setItem("token", response.data.token);

              // Redirect after login
              window.location.href = '/';
          } else {
              toast.error(response.message);
          }
      } catch (error) {
          toast.error(error.message || 'Login failed. Please try again.');
      }
      }
    return (
  <div className="h-[100vh] w-[100vw] bg-white-500 flex flex-row">
        <div className='h-[100vh] w-[70vw]'>
            <img className='fit h-[100vh] w-[100%] object-cover' src={loginImg}/>
        </div>
        <div className='w-[30vw]'>
                <div className='flex flex-col mt-20 items-center gap-1'>
                <div>
                    <img className='h-[80px] w-[80px]' src={logoImg}/>
                </div>
                <div>
                    <h2 className='text-3xl text-[#29346B] font-semibold'>Create an Account</h2>
                </div>
                <div>
                    <p className='text-[#29346B]'>Your energy, your control-sign up now.</p>
                </div>
            </div>
            <div>
                <form onSubmit={(e)=>handleFormSubmit(e)} className='flex flex-col w-[70%] mx-auto gap-4 my-8'>
                    {/* <input type='text' name='name'  value={inputForm?.name} className='border border-b-4 p-2 rounded-md outline-none' onChange={handleInput} placeholder='Name'/> */}
                    <input type='email' name='email'  value={inputForm?.email} className='border border-b-4 p-2  rounded-md  outline-none'  onChange={handleInput} placeholder='Email'/>
                    <input type='password'  onChange={handleInput} name='password' value={inputForm?.password} className='border border-b-4 p-2  rounded-md outline-none'  placeholder='Password'/> 
                    <button type='submit' className='bg-blue-500 hover:bg-blue-700 p-2 text-white rounded-md'>Login</button>
                </form>
            </div>

        </div>
  </div>
  )
}

export default Login