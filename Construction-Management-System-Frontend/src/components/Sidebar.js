import React, { useState } from 'react';
import { Link,useParams } from 'react-router-dom';


export default function Sidebar() {

    const { projectId } = useParams();


    const [tooltipStyle , setTooltipStyle] = useState({});
    const [visibleTooltipIndex , setVisibleTooltipIndex] = useState(null);

    const menuItems = [
        {icon:  <Link to={`/project/${projectId}`}> <svg className='dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg> </Link>   , label: 'Dashboard'},


        {icon: <Link to={`/project/${projectId}/schedule`} > <svg className='text-black dark:fill-white '  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg> </Link> , label: 'Schedule'},



        {icon:  <Link to={`/project/${projectId}/estimations`} >  <svg className="w-6 h-6 stroke-current dark:stroke-white " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg> </Link>  , label: 'Estimation'},

        // {icon:  <Link to={`/project/${projectId}/approvals`} >    <svg  className='text-black dark:fill-white '  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M517-518 347-688l57-56 113 113 227-226 56 56-283 283ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z"/></svg>  </Link> , label: 'Approvals'},

        

        {icon:  <Link to={`/project/${projectId}/quality-control`} ><svg  className='text-black dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></Link>  , label: 'Quality Control'},

       
        {icon:  <Link to={`/project/${projectId}/works`} > <svg  className='text-black dark:fill-white '  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg> </Link>  , label: 'Works'},
        
        {icon: <Link to={`/project/${projectId}/accounting`}><svg xmlns="http://www.w3.org/2000/svg" className='text-black dark:fill-white ' height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-640h80v640h640v80H200Zm40-120v-360h160v360H240Zm200 0v-560h160v560H440Zm200 0v-200h160v200H640Z"/></svg>  </Link>, label: 'Accounting'},


        {icon: <Link to={`/project/${projectId}/gallery`}> <svg  className='text-black dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-200q-33 0-56.5-23.5T40-280v-400q0-33 23.5-56.5T120-760h400q33 0 56.5 23.5T600-680v400q0 33-23.5 56.5T520-200H120Zm600-320q-17 0-28.5-11.5T680-560v-160q0-17 11.5-28.5T720-760h160q17 0 28.5 11.5T920-720v160q0 17-11.5 28.5T880-520H720Zm40-80h80v-80h-80v80ZM120-280h400v-400H120v400Zm40-80h320L375-500l-75 100-55-73-85 113Zm560 160q-17 0-28.5-11.5T680-240v-160q0-17 11.5-28.5T720-440h160q17 0 28.5 11.5T920-400v160q0 17-11.5 28.5T880-200H720Zm40-80h80v-80h-80v80Zm-640 0v-400 400Zm640-320v-80 80Zm0 320v-80 80Z"/></svg> </Link> , label: 'Gallery'},


        {icon: <Link to={`/project/${projectId}/files`}> <svg  className='text-black dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg> </Link> , label: 'Fills'},


        {icon: <Link to={`/project/${projectId}/resources`}>  <svg className='text-black dark:fill-white ' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z"/></svg> </Link>  , label: 'Resources'},


    




    ]
  
    const HandleMouseEnter = (e , index) =>{
        const rect = e.currentTarget.getBoundingClientRect();

        // alert(rect.top)
        setTooltipStyle({
          top: rect.top + window.scrollY + e.currentTarget.offsetHeight / 2 - 76,
          left: rect.right + 10,
        });
        setVisibleTooltipIndex(index);
    }

    const handleMouseLeave = () =>{
        setVisibleTooltipIndex(null);
    }


  return (
    <nav className='sidebar fixed h-[calc(100vh-60px)] bottom-0 left-0 top-[60px] dark:bg-black md:flex hidden'>

    	<ul className='overflow-auto  h-full sidebar-menu p-1 '>

            {
                menuItems.map((item , index) =>(
                
                <li className='dark:bg-gray-900 dark:hover:bg-slate-800 ' key={index} onMouseEnter={(e) => HandleMouseEnter(e, index)} onMouseLeave={handleMouseLeave}>

                    <span>
                        {item.icon}

                        { visibleTooltipIndex === index && (
                            <span  className=" tooltip absolute z-10 bg-gray-700 text-white p-1 rounded" style={tooltipStyle}>
                                {item.label}
                            </span>
                        )}
                    </span>
                </li>
                ))

                
            }

            

           
        </ul>
        
    </nav>
  )
}
