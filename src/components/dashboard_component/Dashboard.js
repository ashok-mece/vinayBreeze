import { Outlet } from 'react-router-dom';
import './Dashboard.css';
import NavBar from "./navbar_component/NavBar";
import Sidebar from "./sidebar_component/Sidebar";
import { useEffect, useState } from 'react';
import MandatoryUpdateFields from './feature_component/mandatory_update_fields_component/MandatoryUpdateFields';

function Dashboard() {

    const [firstTimeLogin, setFirstTimeLogin] = useState(false);
    useEffect(() => {
        const isFirstTimeLogin = localStorage.getItem('breezeUserFirstTimeLogin');
        if(isFirstTimeLogin === 'false'){
            setFirstTimeLogin(false);
        }else if(isFirstTimeLogin === 'true') {
            setFirstTimeLogin(true);
        }        
    },[]);

    // const [activeExponentType, setActiveExponentType] = useState(null);
    // const exponentTypeList = JSON.parse(localStorage.getItem('breezeExponentType'));
    // useEffect(() => {
    //     if (exponentTypeList && exponentTypeList.length > 0) {
    //         setActiveExponentType(exponentTypeList[0]);
    //     }
    //     // eslint-disable-next-line
    // }, []);
    // const handleExponentTypeChange = (type) => {
    //     setActiveExponentType(type);
    // };
    // const exponentTypeButtons = exponentTypeList?.map((type, index) => (
    //     <button 
    //         key={index} 
    //         onClick={() => handleExponentTypeChange(type)}
    //         className="exponent-type-button"
    //     >
    //         {type}
    //     </button>
    // ));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <NavBar />
            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar /> {/**activeExponentType={activeExponentType} */}
                <main className="container p-4" style={{ flex: 1 }}>
                    {/* <div style={{ display: 'flex' }}>
                        {exponentTypeButtons}
                    </div> */}
                    <Outlet />
                </main>
            </div>
            { firstTimeLogin && <MandatoryUpdateFields />}
        </div>
    );

}

export default Dashboard;