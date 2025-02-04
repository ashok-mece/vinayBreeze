import './PageNotFound.css';

function PageNotFound() {

    return (
        <div class="page-not-found-container">
            <div class="page-not-found-content">
                <h3>404</h3>
                <p>Your Requested Page Is Not Found</p>
                <p>Looks like, You have passed wrong URL...</p>
                <button class="page-not-found-dashboard-button" onClick={() => window.location.href = "/"} >Go Back To Home</button>
            </div>
        </div>
    );
}

export default PageNotFound;