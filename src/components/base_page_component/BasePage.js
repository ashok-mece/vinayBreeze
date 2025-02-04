// import React from 'react';
// import './BasePage.css';
// import trainingFile from '../../assets/download.jpeg';
// import jobSupportFile from '../../assets/jobsupport (1).jpg';
// import interviewSupportFile from '../../assets/download (1).jpeg';

// function BasePage() { 
//     return (
//         <div className='base-page-component'>
//             <nav className="navbar navbar-expand-lg fixed-top shadow-sm">
//                 <div className="container-lg">
//                     <div style={{ marginRight: '20px' }}>
//                         <a className="navbar-brand fw-bold" href="/">Breeze</a>
//                     </div>
//                     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className="collapse navbar-collapse" id="navbarNav">
//                         <ul className="navbar-nav mx-auto">
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#home">Home</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#services">Services</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#about">About</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#contact">Contact</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link d-lg-none" href="./register-user">Join us</a>
//                             </li>
//                         </ul>
//                         <a className="btn btn-outline-dark d-none d-lg-block" href="./register-user">Join us</a>
//                     </div>
//                 </div>
//             </nav >
//             <section className="testimonials" id="home">
//                 <div className="container-fuild">
//                     <div id="demo" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" style={{ marginTop: '56px' }}>
//                         <div className="carousel-inner">
//                             <div className="carousel-item active">
//                                 <img src={trainingFile} alt="Slide 1" className="d-block w-100" />
//                             </div>
//                             <div className="carousel-item">
//                                 <img src={jobSupportFile} alt="Slide 2" className="d-block w-100" />
//                             </div>
//                             <div className="carousel-item">
//                                 <img src={interviewSupportFile} alt="Slide 3" className="d-block w-100" />
//                             </div>
//                         </div>
//                         <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
//                             <span className="carousel-control-prev-icon"></span>
//                         </button>
//                         <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
//                             <span className="carousel-control-next-icon"></span>
//                         </button>
//                     </div>
//                 </div>
//             </section>
//             <section className="services" id="services">
//                 <div className="container">
//                     <h2 className="display-5 fw-bold mb-4">Services</h2>
//                     <div className="row">
//                         <div className="col-lg col-sm-6 mt-4">
//                             <div className="card">
//                                 <i className="bi bi-cup-hot-fill"></i>
//                                 <div className="card-body">
//                                     <h5 className="card-title fw-bold">Training</h5>
//                                     <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-lg col-sm-6 mt-4">
//                             <div className="card">
//                                 <i className="bi bi-cup-hot-fill"></i>
//                                 <div className="card-body">
//                                     <h5 className="card-title fw-bold">Job Support</h5>
//                                     <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-lg col-sm-6 m-auto mt-4">
//                             <div className="card">
//                                 <i className="bi bi-cup-hot-fill"></i>
//                                 <div className="card-body">
//                                     <h5 className="card-title fw-bold">Interviewer Support</h5>
//                                     <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div> 
//             </section>
//             <section className="about" id="about">
//                 <div className="container">
//                     <h2 className="display-5 fw-bold mb-4">About Me</h2>
//                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum est id pulvinar mollis. Nullam rhoncus dignissim ipsum, ac pulvinar tellus sodales ut. Vestibulum tincidunt malesuada consectetur. Nulla vel fermentum leo. Mauris rhoncus blandit justo, at congue dui rhoncus sit amet.</p>
//                     <p>Proin molestie sapien vel nulla accumsan, sit amet viverra metus ornare. Mauris iaculis ex vitae mollis pulvinar. Phasellus fringilla neque sed ligula lacinia iaculis.</p>
//                 </div>
//             </section>
//             <section className="contact" id="contact">
//                 <div className="container">
//                     <h2 className="display-5 fw-bold mb-4">Contact Me</h2>
//                     <div className="row">
//                         <div className="col-sm-4 mt-4">
//                             <a href="#"><i className="bi bi-envelope-fill"></i> Admin@gmail.com</a>
//                         </div>
//                         <div className="col-sm-4 mt-4">
//                             <div className="social-media">
//                                 <a href="#"><i className="bi bi-twitter"></i></a>
//                                 <a href="#"><i className="bi bi-instagram"></i></a>
//                                 <a href="#"><i className="bi bi-facebook"></i></a>
//                             </div>
//                         </div>
//                         <div className="col-sm-4 mt-4">
//                             <a href="#"><i className="bi bi-telephone-fill"></i> +91 8000000000</a>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <footer className="demo" style={{ backgroundColor: '#1b4962' }}>
//                 <div>&copy; Breeze</div>
//             </footer>
//         </div>
//     );
// }

// export default BasePage;


// previous working
// import React from 'react';
// import './BasePage.css';
// import trainingFile from '../../assets/download.jpeg';
// import jobSupportFile from '../../assets/jobsupport (1).jpg';
// import interviewSupportFile from '../../assets/download (1).jpeg';

// function BasePage() {
//     return (
//         <div className='base-page-component'>
//             <nav className="navbar navbar-expand-lg fixed-top shadow-sm">
//                 <div className="container-lg">
//                     <div style={{ marginRight: '20px' }}>
//                         <a className="navbar-brand fw-bold" href="/">Breeze</a>
//                     </div>
//                     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className="collapse navbar-collapse" id="navbarNav">
//                         <ul className="navbar-nav mx-auto">
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#home">Home</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#services">Services</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#about">About</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#contact">Contact</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link d-lg-none" href="./register-user">Join us</a>
//                             </li>
//                         </ul>
//                         <a className="btn btn-outline-dark d-none d-lg-block" href="./register-user">Join us</a>
//                     </div>
//                 </div>
//             </nav >
//             <section className="testimonials" id="home">
//                 <div className="" style={{paddingTop:'44px'}}>
//                     <div id="demo" className="carousel slide" data-bs-ride="carousel" style={{ marginTop: '16px' }}>
//                         <div className="carousel-inner">
//                             <div className="carousel-item active">
//                                 <img src={trainingFile} alt="Slide 1" className="d-block w-100" width={100} height={700} />
//                             </div>
//                             <div className="carousel-item">
//                                 <img src={jobSupportFile} alt="Slide 2" className="d-block w-100" width={100} height={700} />
//                             </div>
//                             <div className="carousel-item">
//                                 <img src={interviewSupportFile} alt="Slide 3" className="d-block w-100" width={100} height={700} />
//                             </div>
//                         </div>
//                         <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
//                             <span className="carousel-control-prev-icon"></span>
//                         </button>
//                         <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
//                             <span className="carousel-control-next-icon"></span>
//                         </button>
//                     </div>
//                 </div>
//             </section>
//             <section className="services" id="services">
//                 <div className="container">
//                     <h2 className="display-5 fw-bold mb-4">Services</h2>
//                     <div className="row">
//                         <div className="col-lg col-sm-6 mt-4">
//                             <div className="card">
//                                 <i className="bi bi-cup-hot-fill"></i>
//                                 <div className="card-body">
//                                     <h5 className="card-title fw-bold">Training</h5>
//                                     <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-lg col-sm-6 mt-4">
//                             <div className="card">
//                                 <i className="bi bi-cup-hot-fill"></i>
//                                 <div className="card-body">
//                                     <h5 className="card-title fw-bold">Job Support</h5>
//                                     <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-lg col-sm-6 m-auto mt-4">
//                             <div className="card">
//                                 <i className="bi bi-cup-hot-fill"></i>
//                                 <div className="card-body">
//                                     <h5 className="card-title fw-bold">Interviewer Support</h5>
//                                     <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div> 
//             </section>
//             <section className="about" id="about">
//                 <div className="container">
//                     <h2 className="display-5 fw-bold mb-4">About Me</h2>
//                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum est id pulvinar mollis. Nullam rhoncus dignissim ipsum, ac pulvinar tellus sodales ut. Vestibulum tincidunt malesuada consectetur. Nulla vel fermentum leo. Mauris rhoncus blandit justo, at congue dui rhoncus sit amet.</p>
//                     <p>Proin molestie sapien vel nulla accumsan, sit amet viverra metus ornare. Mauris iaculis ex vitae mollis pulvinar. Phasellus fringilla neque sed ligula lacinia iaculis.</p>
//                 </div>
//             </section>
//             <section className="contact" id="contact">
//                 <div className="container">
//                     <h2 className="display-5 fw-bold mb-4">Contact Me</h2>
//                     <div className="row">
//                         <div className="col-sm-4 mt-4">
//                             <a href='#'><i className="bi bi-envelope-fill"></i> Admin@gmail.com</a>
//                         </div>
//                         <div className="col-sm-4 mt-4">
//                             <div className="social-media">
//                                 <a href="#"><i className="bi bi-twitter"></i></a>
//                                 <a href="#"><i className="bi bi-instagram"></i></a>
//                                 <a href="#"><i className="bi bi-facebook"></i></a>
//                             </div>
//                         </div>
//                         <div className="col-sm-4 mt-4">
//                             <a href="#"><i className="bi bi-telephone-fill"></i> +91 8000000000</a>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <footer className="demo" style={{ backgroundColor: '#1b4962' }}>
//                 <div>&copy; Breeze</div>
//             </footer>
//         </div>
//     );
// }

// export default BasePage;


// updated base js
import React from 'react';
import './BasePage.css';
import trainingFile from '../../assets/trainingimage.jpeg';
import jobSupportFile from '../../assets/interviewsupportimage.jpeg';
import interviewSupportFile from '../../assets/jobsupportimage.jpeg';
import '@fortawesome/fontawesome-free/css/all.min.css';
import appLogo from '../../assets/appicon.jpeg';

const ContactItem = ({ icon, text }) => (
    <div className="col-12 col-sm-6 mt-4">
        <div className="contact-item">
            <a href="#">
                <i className={`fas ${icon}`}></i> {text}
            </a>
        </div>
    </div>
);

function BasePage() {
    return (
        <div className='base-page-component'>
            <nav className="navbar navbar-expand-lg fixed-top shadow-sm">
                <div className="container-lg">
                    <img className='' src={appLogo} alt="Logo" style={{ width: '25px', height: '25px', borderRadius: '50%', objectFit: 'contain', marginRight: '7px', boxShadow: '0 0 0 2px white', backgroundColor: 'white' }} />
                    <div style={{ marginRight: '20px' }}>
                        <a className="navbar-brand fw-bold" href="/">Prepswise</a>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#home">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#services">Services</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#about">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#contact">Contact</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link d-lg-none" href="./register-user">Register</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link d-lg-none" href="./login">Login</a>
                            </li>
                        </ul>
                        <div className="d-none d-lg-flex">
                            <a className="btn btn-outline-dark me-2" href="./register-user">Register</a>
                            <a className="btn btn-outline-dark" href="./login">Login</a>
                        </div>
                    </div>
                </div>
            </nav>
            <section className="testimonials" id="home">
                <div className="" style={{ paddingTop: '44px' }}>
                    <div id="demo" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" style={{ marginTop: '16px' }}>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src={trainingFile} alt="Slide 1" className="d-block w-100" width={100} height={700} />
                            </div>
                            <div className="carousel-item">
                                <img src={jobSupportFile} alt="Slide 2" className="d-block w-100" width={100} height={700} />
                            </div>
                            <div className="carousel-item">
                                <img src={interviewSupportFile} alt="Slide 3" className="d-block w-100" width={100} height={700} />
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </div>
            </section>
            <section className="services" id="services">
                <div className="container">
                    <h2 className="display-5 fw-bold mb-4">Services</h2>
                    <div className="row">
                        <div className="col-lg col-sm-6 mt-4">
                            <div className="card">
                                <i className="bi bi-cup-hot-fill"></i>
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">Training</h5>
                                    <p className="card-text"> Provide training from professionals with extensive experience across various IT domains.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg col-sm-6 mt-4">
                            <div className="card">
                                <i className="bi bi-cup-hot-fill"></i>
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">Job Support</h5>
                                    <p className="card-text">provide online job support for IT Professionals whos lives in USA UK Canada ETC on All major IT tech</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg col-sm-6 m-auto mt-4">
                            <div className="card">
                                <i className="bi bi-cup-hot-fill"></i>
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">Interview Guidance</h5>
                                    <p className="card-text">
                                        Provide expert proxy support for IT professionals during interviews in the USA, UK, Canada, and other regions.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="about" id="about">
                <div className="container">
                    <h2 className="display-5 fw-bold mb-4">About Me</h2>

                    <p> Get Trained from anywhere with an Internet connection with our Prepswise. Prepswise is providing Instructors to teach students in a classroom and you can attend these courses online in real-time also. Includes demonstrations & hands-on lab sessions.: Learn content tailored to match your organization specific needs. You set the date & time and we deliver it for your career set up.</p>
                </div>
            </section>
            {/* <section className="contact" id="contact">
                <div className="container">
                    <h2 className="display-5 fw-bold mb-4">Reach Out to Us</h2>
                    <div className="row">
                        <div className="col-sm-6 mt-4">
                            <div className="contactnumber">
                                <a href="#"><i className="fas fa-mobile-alt"></i> +91 83417 47125</a>
                            </div>
                        </div>
                        <div className="col-sm-6 mt-4">
                            <div className="contactnumber">
                                <a href="#"><i className="fas fa-mobile-alt"></i> +1 9703705705</a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 mt-4">
                            <div className="gmail">
                                <a href="#"><i className="far fa-envelope" style={{ marginLeft: '21px' }}></i> hr@prepswise.com</a>
                            </div>
                        </div>
                        <div className="col-sm-6 mt-4">
                            <div className="gmail">
                                <a href="#"><i className="far fa-envelope" style={{ marginLeft: '53px' }}></i> Info@prepswise.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
            <section className="contact" id="contact">
                <div className="container">
                    <h2 className="display-5 fw-bold mb-4 text-center">Reach Out to Us</h2>
                    <div className="row justify-content-center">
                        {/* Phone Number Column 1 */}
                        <div className="col-sm-6 mt-4 d-flex justify-content-center">
                            <div className="contact-item text-center">
                                <a href="tel:+91 83417 47125">
                                    <i className="fas fa-phone"></i> +91 83417 47125
                                </a>
                            </div>
                        </div>

                        {/* Phone Number Column 2 */}
                        <div className="col-sm-6 mt-4 d-flex justify-content-center">
                            <div className="contact-item text-center">
                                <a href="tel:+1 9703705705">
                                    <i className="fas fa-phone"></i> +1 9703705705
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        {/* Email Column 1 */}
                        <div className="col-sm-6 mt-4 d-flex justify-content-center">
                            <div className="contact-item text-center">
                                <a href="mailto:hr@prepswise.com">
                                    <i className="far fa-envelope"></i> hr@prepswise.com
                                </a>
                            </div>
                        </div>

                        {/* Email Column 2 */}
                        <div className="col-sm-6 mt-4 d-flex justify-content-center">
                            <div className="contact-item text-center">
                                <a href="mailto:Info@prepswise.com">
                                    <i className="far fa-envelope"></i> Info@prepswise.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="demo" style={{ backgroundColor: '#1b4962' }}>
                <div>&copy; Prepswise</div>
            </footer>
        </div>
    );
}

export default BasePage;
