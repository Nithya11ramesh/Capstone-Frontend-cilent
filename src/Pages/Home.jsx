/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Typography, Button, Grid, Card } from '@mui/material';
import { Carousel } from 'react-bootstrap';
import './Home.css';

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const getResponsiveStyles = () => {
    const width = window.innerWidth;

    if (width <= 576) {
      return {
        title: { fontSize: '1.5rem' },
        text: { fontSize: '1rem' },
        button: { fontSize: '1rem', padding: '6px 12px' }
      };
    } else if (width <= 768) {
      return {
        title: { fontSize: '2rem' },
        text: { fontSize: '1.2rem' },
        button: { fontSize: '1.2rem', padding: '8px 16px' }
      };
    } else {
      return {
        title: { fontSize: '3rem' },
        text: { fontSize: '1.5rem' },
        button: { fontSize: '1.5rem', padding: '10px 20px' }
      };
    }
  };

  const styles = getResponsiveStyles();

   const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSend = () => {
    // Handle sending the message here
    console.log('Message sent');
    
    // Close the chat form after sending
    setIsChatOpen(false);
  };

  return (
    <Container style={{ padding: '1rem' }}>
      {/* Carousel Section */}
      <Carousel className="mb-5 carousel-border">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://static.guvi.in/cdn-cgi/image/metadata=keep,width=1440,height=300,f=auto,fit=cover/banner/Multi-Course_Banner_1_(1).webp"
            height="300px"
            width="100%"
          
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwyvRA7v1oVCjHWYyhc45401_ETeJSpIKUGw&s"
            alt="Second slide"
            height="300px"
            width="100%"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://static.guvi.in/cdn-cgi/image/metadata=keep,width=1350,height=300,f=auto,fit=cover/banner/1356x300.webp"
            height="300px"
            width="100%"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://img.freepik.com/free-photo/teenage-girl-with-laptop-headphones-online-school_23-2148827452.jpg?ga=GA1.1.1419111530.1709450726&semt=ais_hybrid"
            alt="Fourth slide"
            height="300px"
            width="100%"
          />
        </Carousel.Item>
      </Carousel>

      <div className="text-center mb-5">
        <Typography variant="h1" style={{ ...styles.title, marginBottom: '20px' }}>
          <img src="https://clipart.com/thumbs.php?f=/599/batch_05/000599-0005-000009_tnb.png" style={{ width: '40%', maxWidth: '100px', resizeMode: 'fit' }} className="card-img-top rounded-circle" alt="Education" />
          Learn without limits in
          <br />   
          &nbsp;&nbsp; &nbsp;&nbsp;  <span className="text-success"> SMARTLEARN</span>
        </Typography>
        <Typography variant="h6" style={{ ...styles.text, marginBottom: '30px' }}>
          Enhance your learning experience with our advanced e-learning platform.
        </Typography>
        <Link to="/register">
          <Button
            variant="contained"
            color="warning"
            style={{ borderRadius: '20px' }}
          >
            Get Started
          </Button>
        </Link>
      </div>

      {/* New Section: All the skills you need in one place */}
      <div className="text-center mb-5">
        <Typography variant="h4" style={{ marginBottom: '10px',padding:'2px' }}>
          All the skills you need in one place
        </Typography>
        <Typography variant="body1">
          From critical skills to technical topics, Road to Knowledge supports your professional development.
        </Typography>
      </div>

      {/* Sale Announcement Section */}
      <div style={{ position: 'relative', width: '100%', height: '300px' }}>
        <img
          src="https://img-b.udemycdn.com/notices/web_carousel_slide/image/df60a0a5-b916-4784-935a-e47b347e586d.png"
          alt="Sale Announcement"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        />
        <div style={{
          position: 'absolute',
          zIndex: 1,
          padding: '5px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          maxWidth: '300px',
          margin: '50px'
        }}>
          <Typography variant="h4" style={{ marginBottom: '10px', marginRight: "1px" ,padding:'1px'}}>
            Skills for everyone & everything
          </Typography>
          <Typography variant="h6" style={{ marginBottom: '20px' }}>
            Our big sale is on. Get courses from ₹399 for your career & your life. Sale ends August 29.
          </Typography>
        </div>
      </div>
      
      <div className="col d-sm-flex flex-row-reverse pt-5 ">
        <div className="col">
          <img 
            src="https://www.guvi.in/build/q-yzbUD9Ue.webp"
            className="float-start"
            style={{ width: "100%" }}
            alt="Upskilling"
          />
        </div>

        <div className="col my-auto text-wrap text-center">
          <h2>Leading EdTech Platform for <br />
            <span className="text-success">
              Vernacular Upskilling
            </span>
          </h2>
          <p className="mb-0 fontSize">
           


                            At SMARTLEARN, we are proud to be the leading EdTech platform dedicated to vernacular upskilling. Our mission is to empower learners across diverse linguistic backgrounds by offering high-quality, localized educational content. By providing courses in multiple regional languages, we ensure that individuals from various communities can access and benefit from top-notch educational resources. Our platform combines cutting-edge technology with a deep understanding of cultural and linguistic nuances, creating an inclusive learning environment that supports personal and professional growth. Join us in bridging the educational gap and unlocking the potential of learners everywhere with SMARTLEARN.


          </p>
        </div>
      </div>

      {/* Why Choose Road to Knowledge? */}
      <div style={{ marginBottom: '40px' }}>
        <Typography variant="h3" style={{ marginBottom: '20px', textAlign: 'left' }}>
          Why Choose SMARTLEARN?
        </Typography>

        <Typography variant="body1" paragraph>
          At Road to Knowledge, our mission is to provide a comprehensive and engaging learning experience. Whether you are looking to improve your coding skills or advance in your career, we offer a variety of features to help you succeed:
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Card style={{ minHeight: '210px', border: '2px solid black',padding:'20px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold',padding:"5px" }}>
                <img src="https://static.vecteezy.com/system/resources/previews/000/663/196/original/vector-learning-people-set-isolated-on-white-background.jpg" style={{ width: '40%', maxWidth: '100px' }} className="card-img-top" alt="Personalized Learning" />
                Personalized Learning
              </Typography>
              <Typography variant="body2">
              Unlock your full potential with tailored learning experiences that adapt to your unique needs and goals.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card style={{ minHeight: '210px', border: '2px solid black' ,padding:'20px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                <img src="https://clipart.com/thumbs.php?f=/532/batch_61/000532-0061-000426_tnb.png" style={{ width: '40%', maxWidth: '100px' }} className="card-img-top" alt="Assured Placements" />
                Assured Placements
              </Typography>
              <Typography variant="body2">
              Secure your future with our placement assurance program, designed to connect you with top employers and career opportunities.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card style={{ minHeight: '210px', border: '2px solid black',padding:'20px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                <img src="https://media.istockphoto.com/vectors/progress-bar-chart-vector-id468140701?k=6&m=468140701&s=612x612&w=0&h=l5MuUQT2dmPgaQ9k3G0WNEKoKYya2vTVyd7Xm6cVDw4=" style={{ width: '40%', maxWidth: '100px' }} className="card-img-top" alt="Live Classes" />
                Live Classes
              </Typography>
              <Typography variant="body2">
              Engage with expert instructors in real-time with our interactive live classes, designed to enhance your learning experience.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Accreditation Section */}
      <Typography component="div" className="row text-center pt-5 mt-5 fontSize mb-20">
        <Typography variant="h4">We are accredited by</Typography>
        <div className="d-sm-flex pt-1">
          <div className="col text-wrap pt-5 ms-2 text-center">
            <img src="https://www.guvi.in/build/q-BWNJf4_3.webp" style={{ height: 74 ,border: '1px solid beige'}} alt="Accreditation 1" />
          </div>
          <div className="col text-wrap pt-5 ms-2 text-center">
            <img src="https://www.guvi.in/build/q-DQ_fo4G_.webp" style={{ height: 74,border:'1px solid beige' }} alt="Accreditation 2" />
          </div>
          <div className="col text-wrap pt-5 ms-2 text-center">
            <img className="mx-auto d-block" src="https://www.guvi.in/build/q-CvhGgDyu.webp" style={{ height: 74,border:'1px solid beige' }} alt="Accreditation 3" />
          </div>
          <div className="col text-wrap pt-5 ms-2 text-center">
            <img className="mx-auto d-block" src="https://www.guvi.in/build/q-BPo5yKTe.webp" style={{ height: 74,border:'1px solid beige' }} alt="Accreditation 4" />
          </div>
        </div>

        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mt-1">
              <img 
                src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera_assets.s3.amazonaws.com/front-page-rebrand/secondary-consumer-cta/Image-Next-Step.png?auto=format%2Ccompress&dpr=1&w=471&h=330&q=40"
                className="img-fluid"
                alt="Next Step"
              />
            </div>
            <div className="col-md-6 order-md-2 text-md-left">
            <h2>Take the next step toward your personal and professional goals with SMARTLEARN.</h2>
  <p className="mb-0 fontSize">Join now to receive personalized recommendations from the full Coursera catalog.</p>
  <Link to="/register">
    <Button variant="contained" color="primary" className="mt-3">Join for Free</Button>
  </Link>
 
    </div>
  </div>

 
          
            
        </div>
      </Typography>
      
   {/* Chat with Us Button */}
   <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRACi-B9u8lvMSODc8cOankvF2bascp6UmyuyeCrgCn2B6_R36-mk2se568MX_OE9Ia&s"
          alt="Chat"
          onClick={toggleChat}
          style={{
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        />
      </div>
        {/* Add the Get in Touch Section */}
        <div style={{ backgroundColor: '#f4a261', padding: '40px 20px', textAlign: 'center', marginTop: '40px' }}>
        <Typography variant="h4" style={{ color: '#fff', marginBottom: '20px' }}>
          GET IN TOUCH WITH US
        </Typography>
        <Typography variant="body1" style={{ color: '#fff', marginBottom: '30px' }}>
        Subscribe to our newsletter for alerts on New Courses, Free Workshops, & Masterclasses.
        </Typography>
        <form>
          <input
            type="email"
            placeholder="Your Email Address"
            style={{
              padding: '10px 20px',
              width: '300px',
             
              maxWidth: '100%',
              borderRadius: '5px',
              border: 'none',
              marginRight: '10px'
            }}
          />
          <Button
            variant="contained"
            style={{ backgroundColor: '#2a9d8f', color: '#fff', padding: '10px 20px', borderRadius: '5px' }}
          >
            SUBSCRIBE
          </Button>
        </form>
      </div>

      {/* Chat Form */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          maxWidth: '300px',
          width: '100%'
        }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            style={{ position: 'absolute', top: '5px', right: '5px' }} 
            onClick={toggleChat}
          >
            X
          </Button>
          <Typography variant="h6" style={{ marginBottom: '10px' }}>
            Chat with Us
          </Typography>
          <textarea
            placeholder="Type your message..."
            rows="4"
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <input
            type="file"
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            style={{ width: '100%' }}
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Home;
