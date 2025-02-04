import { useEffect, useState } from 'react';
import './AdminHome.css';

function AdminHome() {

    const userFullName = localStorage.getItem("breezeUserFullName");

    // greeting code
    const [greeting, setGreeting] = useState('');
    useEffect(() => {
        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour < 12) {
            setGreeting('Good Morning');
        } else if (currentHour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, []);

    return (
        <div>
            <div className="slider-container mt-5">
                <h5>Hello {userFullName}</h5>
                <h5>{greeting}</h5>
            </div>
        </div>
    );
}

export default AdminHome;