import React, { useState } from 'react'
import {  useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { AuthContext } from './authContext';

const AuthProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [verifyingAccount, setVerifyingAccount] = useState(false);
    const [verificationData, setVerificationData] = useState();
    const [signingIn, setSigningIn] = useState(false);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const fetchUsers = async()=>{
        try {
            const res = await fetch(`${baseUrl}/users/` )
            const data = await res.json();
            console.log(data);
            setUsers(data);
        } catch (error) {
            console.log(error);            
        }
    };

    const fetchSellerData = async()=>{
        try {
            const res = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}` )
            const data = await res.json();
            console.log(data);
            setUsers(data);
        } catch (error) {
            console.log(error);            
        }
    };

    const navigate = useNavigate();

    const signin = async (formData)=>{
        setSigningIn(true);

        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            const res = await fetch(`${baseUrl}/auth/login`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(res.statusText === "Internal Server Error"){
                toast.error("No Internet")
                console.log(res);        
            }
            if(data.status === "success"){
                if(data.isVerified){
                    toast.success("Login successful");
                    console.log(data.message);                
                    // console.log(data.user);          
                    localStorage.setItem('accessToken', data.accessToken)
                    localStorage.setItem('user', JSON.stringify(data.user))
                    navigate("/")
                }else{
                    toast.error("Please verify your email before logging in")
                }
            }      
        } catch (error) {
            console.log(error);            
        }finally{
            setSigningIn(false)
        }
    }

    const verifyAccount = async (token)=>{
        setVerifyingAccount(true)
        try {
            const res = await axios.post(`${baseUrl}/auth/verify/${token}`)
            const data = res.data
            console.log(data);
            setVerificationData(data)
        } catch (error) {
            console.log(error);            
        }finally{
            setVerifyingAccount(false)
        }
    }
    const isAuthenticated = () => {
        // check if user is authenticated by checking if there's an accessToken in the localStorage
        const accessToken = localStorage.getItem("accessToken");
        // if there's an accessToken, return true
        if (accessToken) {
            return true;
        } else {
            // if there's no accessToken in the localStorage, return false
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        // Optionally, you can clear the user state or redirect to login

        toast.success("Logged out successfully");
        navigate("/signin");
    };

    const value = {
        users,
        signingIn,
        verifyingAccount,
        verificationData,
        fetchUsers,
        isAuthenticated,
        signin,
        verifyAccount,
        logout,
        fetchSellerData
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider