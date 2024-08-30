import { Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa'; // Import FontAwesome icons
import "./Footer.css"
const Footer = () => {
    return (
        <div>
            <footer className="bg-dark text-light">
                <Row className='container-fluid py-4'>

{/* Center Section with Company Logos */}
<Col md={12} className="text-center">
<br></br>
                        <h5>Top companies choose SMARTLEARN to build in-demand careers.</h5>
                        <div className="d-flex justify-content-center mt-3">
                            <img src=" https://s.udemycdn.com/partner-logos/v4/nasdaq-light.svg"/>
                            <img src="https://s.udemycdn.com/partner-logos/v4/volkswagen-light.svg" alt="Volkswagen" className="company-logo mx-2" />
                            <img src="https://s.udemycdn.com/partner-logos/v4/box-light.svg" alt="Box" className="company-logo mx-2" />
                            <img src="https://s.udemycdn.com/partner-logos/v4/netapp-light.svg" alt="NetApp" className="company-logo mx-2" />
                            <img src="https://s.udemycdn.com/partner-logos/v4/eventbrite-light.svg" alt="Eventbrite" className="company-logo mx-2" />
                        </div>
                    </Col>
                    <hr></hr>
                    {/* Left Section */}
                    <Col md={6} className="text-left mb-md-0 ">
                        <ul className="list-unstyled">
                          <li><a href="/teach-on-road-to-knowledge" className="text-light text-decoration-none">Teach on SMARTLEARN</a></li>
                            <li><a href="/get-the-app" className="text-light text-decoration-none">Get the App</a></li>
                            <li><a href="/about-us" className="text-light text-decoration-none">About Us</a></li>
                            <li><a href="/contact-us" className="text-light text-decoration-none">Contact Us</a></li>
                        </ul>
                    </Col>

                    <Col md={1} className="text-center mb-md-2">
                        <h5>Resources</h5>
                        <ul className="list-unstyled">
                            <li><a href="/careers" className="text-light text-decoration-none">Careers</a></li>
                            <li><a href="/blog" className="text-light text-decoration-none">Blog</a></li>
                            
                            <li><a href="/affiliate" className="text-light text-decoration-none">Affiliate</a></li>
                            <li><a href="/investors" className="text-light text-decoration-none">Investors</a></li>
                        </ul>
                    </Col>

                    {/* Right Section with Social Media Icons */}
                    <Col md={5} className="text-center text-md-end">
                        <h5>Follow Us</h5>
                        <ul className="list-unstyled d-flex justify-content-center justify-content-md-end mt-3">
                            <li className="mx-2">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none">
                                    <FaFacebookF className="facebook-icon" />
                                </a>
                            </li>
                            <li className="mx-2">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none">
                                    <FaInstagram className="instagram-icon" />
                                </a>
                            </li>
                            <li className="mx-2">
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none">
                                    <FaTwitter className="twitter-icon" />
                                </a>
                            </li>
                            <li className="mx-2">
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none">
                                    <FaYoutube className="youtube-icon" />
                                </a>
                            </li>
                            <li className="mx-2">
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none">
                                    <FaLinkedinIn className="linkedin-icon" />
                                </a>
                            </li>
                        </ul>
                    </Col>

                </Row>
<hr></hr>
                {/* Bottom Section */}
                <Row className="container-fluid py-2 text-center">
                    <Col md={12}>
                        <p>&copy; {new Date().getFullYear()} Road to Knowledge. All rights reserved.</p>
                    </Col>
                </Row>
            </footer>
        </div>
    );
};

export default Footer;

