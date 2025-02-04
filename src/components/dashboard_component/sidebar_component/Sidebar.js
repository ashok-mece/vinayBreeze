import './Sidebar.css';
import { CDBNavLink, CDBSidebar, CDBSidebarContent, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Constants from '../../Constants';

function Sidebar() {

    const [activeSidebarMenuItem, setActiveSidebarMenuItem] = useState(null);
    const [expandedMenus, setExpandedMenus] = useState({});
    const location = useLocation();
    const userType = localStorage.getItem('breezeUserType');
    const exponentTypeList = JSON.parse(localStorage.getItem('breezeExponentType'));
    const selectedExponentType = localStorage.getItem("breezeSelectedExponentType");

    const toggleMenu = (menuName) => {
        setExpandedMenus(prevState => ({
            ...prevState,
            [menuName]: !prevState[menuName]
        }));
    };

    // Define menu items based on userType  
    const getMenuItems = () => {
        switch (userType) {
            case Constants.ADMIN:
                return [
                    {
                        path: "/dashboard",
                        name: "Home",
                        icon: "home",
                    },
                    {
                        path: "/dashboard/create-admin",
                        name: "Create Admin",
                        icon: "edit",
                    },
                    {
                        path: "/dashboard/admin-users",
                        name: "Users",
                        icon: "users",
                    },
                    {
                        path: "/dashboard/CompanyUsersComponent",
                        name: "UsersByComapanyName",
                        icon: "users",
                    },
                    {
                        path: "/dashboard/technology",
                        name: "Technical Stack",
                        icon: "microchip",
                    },
                    {
                        name: "Training",
                        icon: "book",
                        submenu: [
                            {
                                path: "/dashboard/course",
                                name: "Course",
                                icon: "book",
                            },
                            {
                                path: "/dashboard/created-trainings",
                                name: "Created Trainings",
                                icon: "check-circle",
                            },
                            {
                                path: "/dashboard/add-sample",
                                name: "Add Sample Intro Video",
                                icon: "video-slash",
                            },
                            {
                                path: "/dashboard/admin-enrolled-trainings",
                                name: "Enrolled Trainings",
                                icon: "registered",
                            },
                            {
                                path: "/dashboard/admin-started-trainings",
                                name: "Started Trainings",
                                icon: "arrow-right",
                            },
                            {
                                path: "/dashboard/admin-completed-trainings",
                                name: "Completed Trainings",
                                icon: "history",
                            },
                        ]
                    },
                    {
                        name: "Interview Support",
                        icon: "chalkboard-teacher",
                        submenu: [
                            {
                                path: "/dashboard/created-interview-supports",
                                name: "Created Interview Supports",
                                icon: "check-circle",
                            },
                            {
                                path: "/dashboard/updated-interview-supports",
                                name: "Updated Interview Supports",
                                icon: "pen",
                            },
                            {
                                path: "/dashboard/admin-booked-interview-supports",
                                name: "Booked Interview Supports", 
                                icon: "bookmark",
                            },
                            {
                                path: "/dashboard/admin-rescheduled-interview-supports",
                                name: "Rescheduled Bookings", 
                                icon: "calendar-plus",
                            },
                            {
                                path: "/dashboard/admin-today-interview-support-bookings",
                                name: "Today Interview Support Bookings",
                                icon: "calendar-alt",
                            },
                            {
                                path: "/dashboard/admin-completed-interview-support-bookings",
                                name: "Completed Interview Support Bookings",
                                icon: "history",
                            },
                        ]
                    },
                    {
                        name: "Job Support",
                        icon: "book",
                        submenu: [
                            {
                                path: "/dashboard/created-job-supports",
                                name: "Created Job Supports",
                                icon: "check-circle",
                            },
                            {
                                path: "/dashboard/updated-job-supports",
                                name: "Updated Job Supports",
                                icon: "pen",
                            },
                            {
                                path: "/dashboard/admin-booked-job-supports",
                                name: "Booked Job Supports", 
                                icon: "bookmark",
                            },
                            {
                                path: "/dashboard/admin-rescheduled-job-supports",
                                name: "Rescheduled Bookings", 
                                icon: "calendar-plus",
                            },
                            {
                                path: "/dashboard/admin-stopped-job-supports",
                                name: "Stopped Bookings", 
                                icon: "stop-circle",
                            },
                            {
                                path: "/dashboard/admin-continued-job-supports",
                                name: "Continued Bookings", 
                                icon: "play",
                            },
                            {
                                path: "/dashboard/admin-assigned-job-supports",
                                name: "Assigned Bookings", 
                                icon: "file-alt",
                            },
                            {
                                path: "/dashboard/admin-today-job-support-bookings",
                                name: "Today Job Support Bookings",
                                icon: "calendar-alt",
                            },
                            {
                                path: "/dashboard/admin-completed-job-support-bookings",
                                name: "Completed Job Support Bookings",
                                icon: "history",
                            },
                        ]
                    },
                    // Add more admin specific menu items if needed
                ];
            case Constants.EXPONENT:
                switch (selectedExponentType) {
                    case Constants.TRAINER:
                        return [
                            {
                                path: "/dashboard",
                                name: "Home",
                                icon: "home",
                            },
                            {
                                path: "/dashboard/create-training",
                                name: "Create Training",
                                icon: "edit",
                            },
                            {
                                path: "/dashboard/trainer-rejected-trainings",
                                name: "Rejected Trainings",
                                icon: "times",
                            },
                            {
                                path: "/dashboard/trainer-approved-trainings",
                                name: "Approved Trainings",
                                icon: "check",
                            },
                            {
                                path: "/dashboard/trainer-started-trainings",
                                name: "Scheduled Trainings",
                                icon: "arrow-right",
                            },
                            {
                                path: "/dashboard/trainer-completed-trainings",
                                name: "Completed Trainings",
                                icon: "history",
                            },
                            // Add trainer specific menu items
                        ];
                    case Constants.INTERVIEW_SUPPORTER:
                        return [
                            {
                                path: "/dashboard",
                                name: "Home",
                                icon: "home",
                            },
                            {
                                path: "/dashboard/create-interview-support",
                                name: "Create Interview Support",
                                icon: "edit",
                            },
                            {
                                path: "/dashboard/exponent-rejected-interview-support",
                                name: "Rejected Interview Support",
                                icon: "times",
                            },
                            {
                                path: "/dashboard/exponent-approved-interview-support",
                                name: "Approved Interview Support",
                                icon: "check",
                            },
                            {
                                path: "/dashboard/interview-supporter-bookings",
                                name: "Interview Support Bookings",
                                icon: "book-reader",
                            },
                            {
                                path: "/dashboard/interview-supporter-today-bookings",
                                name: "Scheduled Bookings",
                                icon: "arrow-right",
                            },
                            {
                                path: "/dashboard/interview-supporter-completed-bookings",
                                name: "Completed Bookings",
                                icon: "history",
                            },
                        ];
                    case Constants.JOB_SUPPORTER:
                        return [
                            {
                                path: "/dashboard",
                                name: "Home",
                                icon: "home",
                            },
                            {
                                path: "/dashboard/create-job-support",
                                name: "Create Job Support",
                                icon: "edit",
                            },
                            {
                                path: "/dashboard/exponent-rejected-job-support",
                                name: "Rejected Job Support",
                                icon: "times",
                            },
                            {
                                path: "/dashboard/exponent-approved-job-support",
                                name: "Approved Job Support",
                                icon: "check",
                            },
                            {
                                path: "/dashboard/job-supporter-bookings",
                                name: "Job Support Bookings",
                                icon: "book-reader",
                            },
                            {
                                path: "/dashboard/job-supporter-today-bookings",
                                name: "Scheduled Bookings",
                                icon: "arrow-right",
                            },
                            {
                                path: "/dashboard/job-supporter-completed-bookings",
                                name: "Completed Bookings",
                                icon: "history",
                            },
                        ];
                    default:
                        return [];
                }
            case Constants.CANDIDATE:
                return [
                    {
                        path: "/dashboard",
                        name: "Home",
                        icon: "home",
                    },
                    {
                        name: "Training",
                        icon: "book",
                        submenu: [
                            {
                                path: "/dashboard/candidate-search-training",
                                name: "Search Trainings",
                                icon: "search",
                            },
                            {
                                path: "/dashboard/enrolled-trainings",
                                name: "Enrolled Trainings",
                                icon: "registered",
                            },
                            {
                                path: "/dashboard/candidate-started-trainings",
                                name: "Scheduled Trainings",
                                icon: "arrow-right",
                            },
                            {
                                path: "/dashboard/candidate-completed-trainings",
                                name: "Completed Trainings",
                                icon: "history",
                            },
                        ]
                    },
                    {
                        name: "Interview Support",
                        icon: "chalkboard-teacher",
                        submenu: [
                            {
                                path: "/dashboard/candidate-search-interview-supports",
                                name: "Search Interview Supports",
                                icon: "search",
                            },
                            {
                                path: "/dashboard/candidate-interview-support-bookings",
                                name: "Interview Support Bookings",
                                icon: "book-reader",
                            },
                            {
                                path: "/dashboard/candidate-today-interview-support-bookings",
                                name: "Scheduled Bookings",
                                icon: "arrow-right",
                            },
                            {
                                path: "/dashboard/candidate-completed-interview-support-bookings",
                                name: "Completed Bookings",
                                icon: "history",
                            },
                        ]
                    },
                    {
                        name: "Job Support",
                        icon: "book",
                        submenu: [
                            {
                                path: "/dashboard/candidate-search-job-supports",
                                name: "Search Job Supports",
                                icon: "search",
                            },
                            {
                                path: "/dashboard/candidate-job-support-bookings",
                                name: "Job Support Bookings",
                                icon: "book-reader",
                            },
                            {
                                path: "/dashboard/candidate-today-job-support-bookings",
                                name: "Scheduled Bookings",
                                icon: "arrow-right",
                            },
                            {
                                path: "/dashboard/candidate-completed-job-support-bookings",
                                name: "Completed Bookings",
                                icon: "history",
                            },
                        ]
                    },
                    // Add candidate specific menu items
                ];
            default:
                return [];
        }
    };

    const sidebarMenuItems = getMenuItems();

    useEffect(() => {
        const pathname = location.pathname;
        setActiveSidebarMenuItem(pathname);
    }, [location]);

    // exponent type change code
    const handleExponentTypeChange = (event) => {
        const selectedValue = event.target.value;
        localStorage.setItem("breezeSelectedExponentType", selectedValue);
        window.location.href = '/dashboard';
    };

    return (
        <div>
            <CDBSidebar className='app-bg-color'>
                <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
                    {userType === Constants.ADMIN || userType === Constants.CANDIDATE ? userType : (
                        <select className='sidebar-exponent-dropdown' value={selectedExponentType} onChange={handleExponentTypeChange} style={{ cursor: 'pointer' }}>
                            {exponentTypeList.map((item, index) => (
                                <option key={index} className='sidebar-exponent-dropdown-option' value={item} >{item}</option>
                            ))}
                        </select>
                    )}
                </CDBSidebarHeader>
                <CDBSidebarContent>
                    <CDBSidebarMenu>
                        {sidebarMenuItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.submenu ? (
                                    <div>
                                        <CDBNavLink
                                            to="#"
                                            className="nav-link"
                                            onClick={() => toggleMenu(item.name)}
                                        >
                                            <CDBSidebarMenuItem
                                                icon={item.icon}
                                                iconSize='lg'
                                                className={`sidebar-menu-item ${expandedMenus[item.name] ? 'active' : ''}`}
                                            >
                                                {item.name}
                                                <i className={`fa fa-caret-${expandedMenus[item.name] ? 'up' : 'down'}`} style={{ float: 'right',marginTop: '5px',marginRight: '5px' }} />
                                            </CDBSidebarMenuItem>
                                        </CDBNavLink>
                                        {expandedMenus[item.name] && (
                                            item.submenu.map((subitem, subindex) => (
                                                <CDBNavLink
                                                    key={subindex}
                                                    to={subitem.path}
                                                    className="nav-link"
                                                >
                                                    <CDBSidebarMenuItem
                                                        icon={subitem.icon}
                                                        iconSize='lg'
                                                        className={`sidebar-submenu-item ${activeSidebarMenuItem === subitem.path ? 'active' : ''}`}
                                                    >
                                                        {subitem.name}
                                                    </CDBSidebarMenuItem>
                                                </CDBNavLink>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <CDBNavLink
                                        to={item.path}
                                        className="nav-link"
                                    >
                                        <CDBSidebarMenuItem
                                            icon={item.icon}
                                            iconSize='lg'
                                            className={`sidebar-menu-item ${activeSidebarMenuItem === item.path ? 'active' : ''}`}
                                        >
                                            {item.name}
                                        </CDBSidebarMenuItem>
                                    </CDBNavLink>
                                )}
                            </React.Fragment>
                        ))}
                    </CDBSidebarMenu>
                </CDBSidebarContent>
            </CDBSidebar>
        </div>
    );

}

export default Sidebar;













// with sub mneu
// import './Sidebar.css';
// import { CDBNavLink, CDBSidebar, CDBSidebarContent, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import Constants from '../../Constants';

// function Sidebar() {
//     const [activeSidebarMenuItem, setActiveSidebarMenuItem] = useState(null);
//     const [expandedMenus, setExpandedMenus] = useState({});
//     const location = useLocation();
//     const userType = localStorage.getItem('breezeUserType');
//     const exponentTypeList = JSON.parse(localStorage.getItem('breezeExponentType'));
//     const selectedExponentType = localStorage.getItem("breezeSelectedExponentType");

//     const toggleMenu = (menuName) => {
//         setExpandedMenus(prevState => ({
//             ...prevState,
//             [menuName]: !prevState[menuName]
//         }));
//     };

//     const getMenuItems = () => {
//         switch (userType) {
//             case Constants.ADMIN:
//                 return [
//                     { path: "/dashboard", name: "Home", icon: "home" },
//                     {
//                         name: "Training",
//                         icon: "book",
//                         submenu: [
//                             { path: "/dashboard/technology", name: "Technology", icon: "th-large" },
//                             { path: "/dashboard/course", name: "Course", icon: "sticky-note" },
//                             { path: "/dashboard/created-trainings", name: "Created Trainings", icon: "th-large" },
//                             { path: "/dashboard/add-sample", name: "Add Sample Intro Video", icon: "sticky-note" },
//                             { path: "/dashboard/admin-enrolled-trainings", name: "Enrolled Trainings", icon: "th-large" }
//                         ]
//                     },
//                     // Add more admin specific menu items if needed
//                 ];
//             // Add other user types similarly
//             default:
//                 return [];
//         }
//     };

//     const sidebarMenuItems = getMenuItems();

//     useEffect(() => {
//         const pathname = location.pathname;
//         setActiveSidebarMenuItem(pathname);
//     }, [location]);

//     const handleExponentTypeChange = (event) => {
//         const selectedValue = event.target.value;
//         localStorage.setItem("breezeSelectedExponentType", selectedValue);
//         window.location.href = '/dashboard';
//     };

//     return (
//         <div>
//             <CDBSidebar className='app-bg-color'>
//                 <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
//                     {userType === Constants.ADMIN || userType === Constants.CANDIDATE ? userType : (
//                         <select className='sidebar-exponent-dropdown' value={selectedExponentType} onChange={handleExponentTypeChange} style={{cursor:'pointer'}}>
//                             {exponentTypeList.map((item, index) => (
//                                 <option key={index} className='sidebar-exponent-dropdown-option' value={item} >{item}</option>
//                             ))}
//                         </select>
//                     )}
//                 </CDBSidebarHeader>
//                 <CDBSidebarContent>
//                     <CDBSidebarMenu>
//                         {sidebarMenuItems.map((item, index) => (
//                             <React.Fragment key={index}>
//                                 {item.submenu ? (
//                                     <div>
//                                         <CDBNavLink
//                                             to="#"
//                                             className="nav-link"
//                                             onClick={() => toggleMenu(item.name)}
//                                         >
//                                             <CDBSidebarMenuItem
//                                                 icon={item.icon}
//                                                 iconSize='lg'
//                                                 className={`sidebar-menu-item ${expandedMenus[item.name] ? 'active' : ''}`}
//                                             >
//                                                 {item.name}
//                                                 <i className={`fa fa-caret-${expandedMenus[item.name] ? 'up' : 'down'}`} style={{ float: 'right' }} />
//                                             </CDBSidebarMenuItem>
//                                         </CDBNavLink>
//                                         {expandedMenus[item.name] && (
//                                             item.submenu.map((subitem, subindex) => (
//                                                 <CDBNavLink
//                                                     key={subindex}
//                                                     to={subitem.path}
//                                                     className="nav-link"
//                                                 >
//                                                     <CDBSidebarMenuItem
//                                                         icon={subitem.icon}
//                                                         iconSize='lg'
//                                                         className={`sidebar-submenu-item ${activeSidebarMenuItem === subitem.path ? 'active' : ''}`}
//                                                     >
//                                                         {subitem.name}
//                                                     </CDBSidebarMenuItem>
//                                                 </CDBNavLink>
//                                             ))
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <CDBNavLink
//                                         to={item.path}
//                                         className="nav-link"
//                                     >
//                                         <CDBSidebarMenuItem
//                                             icon={item.icon}
//                                             iconSize='lg'
//                                             className={`sidebar-menu-item ${activeSidebarMenuItem === item.path ? 'active' : ''}`}
//                                         >
//                                             {item.name}
//                                         </CDBSidebarMenuItem>
//                                     </CDBNavLink>
//                                 )}
//                             </React.Fragment>
//                         ))}
//                     </CDBSidebarMenu>
//                 </CDBSidebarContent>
//             </CDBSidebar>
//         </div>
//     );
// }

// export default Sidebar;













// without sub menu
// import './Sidebar.css';
// import { CDBNavLink, CDBSidebar, CDBSidebarContent, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import Constants from '../../Constants';

// function Sidebar() {

//     const [activeSidebarMenuItem, setActiveSidebarMenuItem] = useState(null);
//     const location = useLocation();
//     const userType = localStorage.getItem('breezeUserType');
//     const exponentTypeList = JSON.parse(localStorage.getItem('breezeExponentType'));
//     const selectedExponentType = localStorage.getItem("breezeSelectedExponentType");

//     // Define menu items based on userType
//     const getMenuItems = () => {
//         switch (userType) {
//             case Constants.ADMIN:
//                 return [
//                     {
//                         path: "/dashboard",
//                         name: "Home",
//                         icon: "home",
//                     },
//                     {
//                         path: "/dashboard/create-admin",
//                         name: "Create Admin",
//                         icon: "edit",
//                     },
//                     {
//                         path: "/dashboard/technology",
//                         name: "Technology",
//                         icon: "microchip",
//                     },
//                     {
//                         path: "/dashboard/course",
//                         name: "Course",
//                         icon: "book",
//                     },
//                     {
//                         path: "/dashboard/created-trainings",
//                         name: "Created Trainings",
//                         icon: "check-circle",
//                     },
//                     {
//                         path: "/dashboard/add-sample",
//                         name: "Add Sample Intro Video",
//                         icon: "video-slash",
//                     },
//                     {
//                         path: "/dashboard/admin-enrolled-trainings",
//                         name: "Enrolled Trainings",
//                         icon: "registered",
//                     },
//                     {
//                         path: "/dashboard/admin-started-trainings",
//                         name: "Started Trainings",
//                         icon: "arrow-right",
//                     },
//                     {
//                         path: "/dashboard/admin-completed-trainings",
//                         name: "Completed Trainings",
//                         icon: "history",
//                     },
//                     // Add more admin specific menu items if needed
//                 ];
//             case Constants.EXPONENT:
//                 switch (selectedExponentType) {
//                     case Constants.TRAINER:
//                         return [
//                             {
//                                 path: "/dashboard",
//                                 name: "Home",
//                                 icon: "home",
//                             },
//                             {
//                                 path: "/dashboard/create-training",
//                                 name: "Create Training",
//                                 icon: "edit",
//                             },
//                             {
//                                 path: "/dashboard/trainer-rejected-trainings",
//                                 name: "Rejected Trainings",
//                                 icon: "times",
//                             },
//                             {
//                                 path: "/dashboard/trainer-approved-trainings",
//                                 name: "Approved Training",
//                                 icon: "check",
//                             },
//                             {
//                                 path: "/dashboard/trainer-started-trainings",
//                                 name: "Scheduled Trainings",
//                                 icon: "arrow-right",
//                             },
//                             {
//                                 path: "/dashboard/trainer-completed-trainings",
//                                 name: "Completed Training",
//                                 icon: "history",
//                             },
//                             // Add trainer specific menu items
//                         ];
//                     case Constants.JOB_SUPPORTER:
//                         return [
//                             {
//                                 path: "/dashboard",
//                                 name: "Home",
//                                 icon: "home",
//                             },
//                         ];
//                     case Constants.INTERVIEW_SUPPORTER:
//                         return [
//                             {
//                                 path: "/dashboard",
//                                 name: "Home",
//                                 icon: "home",
//                             },
//                         ];
//                     default:
//                         return [];
//                 }
//             case Constants.CANDIDATE:
//                 return [
//                     {
//                         path: "/dashboard",
//                         name: "Home",
//                         icon: "home",
//                     },
//                     {
//                         path: "/dashboard/candidate-search-training",
//                         name: "Search Trainings",
//                         icon: "search",
//                     },
//                     {
//                         path: "/dashboard/enrolled-trainings",
//                         name: "Enrolled Trainings",
//                         icon: "registered",
//                     },
//                     {
//                         path: "/dashboard/candidate-started-trainings",
//                         name: "Scheduled Trainings",
//                         icon: "arrow-right",
//                     },
//                     {
//                         path: "/dashboard/candidate-completed-trainings",
//                         name: "Completed Trainings",
//                         icon: "history",
//                     },
//                     // Add candidate specific menu items
//                 ];
//             default:
//                 return [];
//         }
//     };

//     const sidebarMenuItems = getMenuItems();

//     useEffect(() => {
//         const pathname = location.pathname;
//         setActiveSidebarMenuItem(pathname);
//     }, [location]);

//     // exponent type change code
//     const handleExponentTypeChange = (event) => {
//         const selectedValue = event.target.value;
//         localStorage.setItem("breezeSelectedExponentType", selectedValue);
//         window.location.href = '/dashboard';
//     };

//     return (
//         <div>
//             <CDBSidebar className='app-bg-color' >
//                 <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
//                     {userType === Constants.ADMIN || userType === Constants.CANDIDATE ? userType : (
//                         <select className='sidebar-exponent-dropdown' value={selectedExponentType} onChange={handleExponentTypeChange} style={{cursor:'pointer'}}>
//                             {exponentTypeList.map((item, index) => (
//                                 <option key={index} className='sidebar-exponent-dropdown-option' value={item} >{item}</option>
//                             ))}
//                         </select>
//                     )}
//                 </CDBSidebarHeader>
//                 <CDBSidebarContent>
//                     <CDBSidebarMenu>
//                         {
//                             sidebarMenuItems.map((item, index) => (
//                                 <CDBNavLink
//                                     to={item.path} className="nav-link"
//                                 >
//                                     <CDBSidebarMenuItem
//                                         key={index}
//                                         icon={item.icon}
//                                         iconSize='lg'
//                                         className={`sidebar-menu-item ${activeSidebarMenuItem === item.path ? 'active' : ''}`}
//                                     >
//                                         {item.name}
//                                     </CDBSidebarMenuItem>
//                                 </CDBNavLink>
//                             ))
//                         }
//                     </CDBSidebarMenu>
//                 </CDBSidebarContent>
//             </CDBSidebar>
//         </div>
//     );

// }

// export default Sidebar;