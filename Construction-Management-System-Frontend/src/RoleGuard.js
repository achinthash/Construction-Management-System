

// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const RoleGuard = ({ allowedRoles, children }) => {
//   const userInfo = JSON.parse(sessionStorage.getItem('user-info'));

//   if (!userInfo || !allowedRoles.includes(userInfo.role)) {
//     return <Navigate to="/unauthorized" />; // redirect or show error page
//   }

//   return children;
// };

// export default RoleGuard;


import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const RoleGuard = ({ allowedRoles, children }) => {
  const { projectId } = useParams(); 
  const navigate = useNavigate();


  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!allowedRoles.includes(userInfo.role)) {
        setAuthorized(false);
        return;
      }

      // If no projectId in the route, only role check is needed
      if (!projectId) {
        setAuthorized(true);
        return;
      }

      // If projectId exists, check backend for access
      try {
     
        const response = await axios.get(`http://localhost:8000/api/access-projects/${userInfo.id}/${projectId}`,{
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });

        setAuthorized(true);
      } catch (error) {
        setAuthorized(false);
      }
    };

    checkAccess();
  }, [userInfo, projectId, allowedRoles]);

  if (authorized === null) return <div>Checking access...</div>;
  if (!authorized) {
    navigate('/unauthorized');
    return null;
  }

  return children;
};

export default RoleGuard;
