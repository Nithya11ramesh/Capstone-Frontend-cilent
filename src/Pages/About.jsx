
import { Container, Typography, Card, CardContent, CardMedia, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { Test } from "../Test";

function About() {
  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={4} display="flex" justifyContent="center">
          <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', textAlign: 'center',border: '2px solid black' }}>
            <CardMedia
              component="img"
              height="140"
              image="https://image.freepik.com/free-vector/corporate-website-abstract-concept-illustration_335657-1831.jpg"
              alt="About"
              style={{  resizeMode: 'fit' ,padding:"5px"}}
            />
            <CardContent style={{ flexGrow: 1 }}>
              <Typography variant="h5" component="div" align="center">
                About
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
              SMARTLEARN is an advanced e-learning platform designed to enhance your learning experience. Our mission is to bridge the gap between knowledge seekers and providers by offering comprehensive and interactive online courses. Whether you are a student looking to learn new skills or a mentor willing to share your expertise, KnowledgeBridge is the perfect place for you.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} display="flex" justifyContent="center">
          <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', textAlign: 'center',border: '2px solid black' }}>
            <CardMedia
              component="img"
              height="140"
              image="https://i.pinimg.com/originals/56/62/3f/56623f8c21016aab03e1da14ed6a6b64.png"
              alt="Our Mission"
              style={{ objectFit: 'contain' }}
            />
            <CardContent style={{ flexGrow: 1 }}>
              <Typography variant="h5" component="div" align="center">
                Our Mission
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                To empower individuals through accessible, high-quality education and to create a global community of learners and educators.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} display="flex" justifyContent="center">
          <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', textAlign: 'center',border: '2px solid black' }}>
            <CardMedia
              component="img"
              height="140"
              image="https://static.vecteezy.com/system/resources/previews/001/879/618/non_2x/brainstorming-to-solve-problem-startup-office-with-swing-modern-workplace-or-coworking-space-play-and-work-flat-illustration-for-landing-page-web-website-banner-mobile-flyer-poster-free-vector.jpg"
              alt="Why Choose Us?"
              style={{ objectFit: 'contain' }}
            />
            <CardContent style={{ flexGrow: 1 }}>
              <Typography variant="h5" component="div" align="center">
                Why Choose Us?
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Wide range of courses<br />
                Expert mentors<br />
                User-friendly interface<br />
                Interactive learning experience<br />
                Flexible learning schedule
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card style={{ marginTop: '20px', padding: '20px', border: '5px solid beige' }}>
  <TableContainer component={Paper}>
    <Table>
      <TableBody style={{ border: '1px solid black' }}>
        <TableRow style={{ border: '1px solid black' }}>
          <TableCell align="center" style={{ border: '1px solid black' }}>
            <img src="https://static.vecteezy.com/system/resources/previews/020/995/054/original/woman-teacher-illustration-png.png" style={{ width: '40%', maxWidth: '100px' }} alt="Course Materials" />
            <Typography variant="h5" >Course Materials</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="h6" >
              Easily access and manage all your course materials. Our platform provides a central location for all your learning resources, making it simple to stay organized and up-to-date.
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow style={{ border: '1px solid black' }}>
          <TableCell align="center" style={{ border: '1px solid black' }}>
            <img src="https://static.vecteezy.com/system/resources/previews/020/995/054/original/woman-teacher-illustration-png.png" style={{ width: '40%', maxWidth: '100px' }} alt="Assignments" />
            <Typography variant="h5">Assignments</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="h6">
              Improve your skills with hands-on assignments designed to reinforce your learning. Submit your work and receive feedback to help you progress and succeed.
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center" style={{ border: '1px solid black' }}>
            <img src="https://static.vecteezy.com/system/resources/previews/020/995/054/original/woman-teacher-illustration-png.png" style={{ width: '40%', maxWidth: '100px' }} alt="Quizzes" />
            <Typography variant="h5">Quizzes</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="h6">
              Test your knowledge with interactive quizzes that challenge your understanding. Track your performance and see where you can improve.
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
</Card>

      {/* Refactored div content into Typography */}
      <Typography component="div" className="row text-center pt-5 mt-5 fontSize ">
        <Typography variant="h3">What People are saying...</Typography>
      </Typography>

      <Typography component="div" className="d-sm-flex pt-5">
        {Test.map((img) => (
          <Typography component="div" className="col" key={img.id}>
            <img
              className="img-fluid img-thumbnail mx-auto d-block rounded-circle mb-3"
              src={img.featuresImg1}
              style={{ width: '50%', border: '1px solid black' }}
              alt={img.name}
            />
            <Typography variant="h3" align="center">
              {img.name}
            </Typography>
            <Typography variant="body1" className="fontSize" align="center">
              {img.comment}
            </Typography>
          </Typography>
        ))}
      </Typography>

      <Grid container justifyContent="center" style={{ marginTop: '20px', paddingBottom: '20px', }}>
        <Grid item xs={12} md={6} lg={4}>
          <Card style={{ width: '100%', textAlign: 'center',border: '2px solid black' }}>
            <CardContent>
              <Typography variant="h5" className="pacifico-regular">
                Contact Details
              </Typography>
              <CardMedia
                component="img"
                image="https://static.vecteezy.com/system/resources/previews/009/583/351/original/3d-illustration-contact-options-png.png"
                alt="Contact Options"
                style={{ width: '40%', maxWidth: '200px', margin: '0 auto' }}
              />

              <Typography variant="body2" className="playwrite-sk" style={{ marginTop: '10px',border: '5px solid pink' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>Phone: +011 2345 123</li>
                  <li>Email: info@SmartLearn.com</li>
                  <li>Address: 123 Learning Lane, EduCity</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default About;
