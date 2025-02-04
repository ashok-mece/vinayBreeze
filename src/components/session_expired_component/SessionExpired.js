import { useEffect } from 'react';
import './SessionExpired.css';

function SessionExpired() {

    useEffect(() => {
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
    });

    return (
        <div class="session-expired-container">
            <div class="session-expired-content">
                <h3>Session Expired !! Please Login Again !!</h3>
            </div>
        </div> 
    );
} 

export default SessionExpired;