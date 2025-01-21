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
        password:''
    })
    const handleInput=(e)=>{
        setInputForm({...inputForm,[e.target.name]:e.target.value})
    }

    const handleFormSubmit = async(e) => {
        e.preventDefault();
        if (inputForm?.name.trim() === '') {
            toast.error("Please add an user Name");
            return; // Stop form submission
          }
        // Validation checks
        if (inputForm?.email.trim() === '') {
          toast.error("Please add an email");
          return; // Stop form submission
        }
    
        if (inputForm?.password.trim() === '') {
          toast.error("Please add a password");
          return; 
        }
        const loginData = {
          username: inputForm.name, // You can adjust this field name as needed
          password: inputForm.password,
          group_id: inputForm.email // You can replace this with actual logic for group_id
      };

      try {
        const response = await login(loginData);
        
        if (response && response.data) {
            toast.success("Login successful!");
            window.location.href = '/dashboard';
        }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please try again.');
        }

        console.log(inputForm);
        toast.success("Details!");

      };

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
                    <input type='text' name='name'  value={inputForm?.name} className='border border-b-4 p-2 rounded-md outline-none' onChange={handleInput} placeholder='Name'/>
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