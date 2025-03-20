import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';


function Protected() {


    const navigate = useNavigate();

    const isLogin = sessionStorage.getItem('token');

    useEffect(()=>{
        if(!isLogin){
            navigate('/login');
        }
    },[isLogin,navigate])

  return isLogin ? <Outlet /> : null;
}


export default Protected;