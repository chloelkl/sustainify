import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import { Typography, Card, CardContent, CardMedia, Button, Grid, Avatar } from '@mui/material';
import theme from '../themes/MyTheme.js';

// Styled components
const Container = styled('div')({
  width: '100%',
});

const Banner = styled('div')({
  height: '80vh',
  width: '100%',
  backgroundColor: theme.palette.secondary.light,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  textAlign: 'center',
  flexDirection: 'row',
});

const AwarenessSection = styled('div')({
  backgroundColor: theme.palette.secondary.main,
  padding: '40px',
  textAlign: 'center',
  height: '50vh'
});

const CommunityChallengersSection = styled('div')({
  backgroundColor: theme.palette.secondary.light,
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center'
});

const TakeActionSection = styled('div')({
  backgroundColor: theme.palette.primary.main,
  padding: '20px',
  textAlign: 'center',
});

const StyledCard = styled(Card)({
  width: '25%',
  margin: 'auto',
});

const StyledEvent = styled(Card)({
  maxWidth: 345,
  margin: 'auto',
});

const StyledCardContent = styled(CardContent)({
  height: '120px', // Adjust based on desired height
  overflow: 'auto',
});

const CardCarousel = styled('div')({
  display: 'flex',
  gap: '16px', // Adds some space between cards in the carousel
});

const StyledButton = styled(Button)({
  color: theme.palette.secondary.dark,
  borderBottom: '1px solid black',
  margin: '50px 0',
  transition: 'all .3s linear',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.secondary.light
  },
});

const StyledButtonWhite = styled(Button)({
  color: theme.palette.secondary.light,
  borderBottom: '1px solid white',
  margin: '50px 0',
  transition: 'all .3s linear',
  '&:hover': {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.dark
  },
});

const CreatorCard = styled(Card)({
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  width: '90%',
  minHeight: '20vh'
});

// Awareness & Exposure Section Component
const AwarenessExposure = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/homepage/events`);
      const data = await response.json();
      setEvents(data.slice(0, 3)); // Display up to 3 events
    };

    fetchEvents();
  }, []);

  return (
    <AwarenessSection>
      <Typography variant="h4"><b>Awareness & Exposure</b></Typography>
      <Typography paddingBottom={5} variant="body2">Grab the opportunity to start taking action!</Typography>
      <Grid container spacing={2} justifyContent="center">
        {events.map((event, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledEvent>
              <StyledCardContent style={{height: 'auto'}}>
                <Typography variant="h6">{event.eventname}</Typography>
                <Typography variant="body2" height="150px">{event.eventdescription}</Typography>
                <Typography variant="body2">{event.eventdate}</Typography>
              </StyledCardContent>
            </StyledEvent>
          </Grid>
        ))}
      </Grid>
      <StyledButton component={Link} to="/eventoverview">Explore</StyledButton>
    </AwarenessSection>
  );
};

// Community Challengers Section Component
const CommunityChallengers = () => (
  <CommunityChallengersSection>
    <div style={{ width: '30%'}}>
      <Typography variant='body2'>Be the change for the world.</Typography>
      <Typography variant="h4" paddingBottom={5}><b>Community Challengers</b></Typography>
      <Typography variant="body1">
      Make the change and help the earth by taking part in daily challenges while earning points to redeem exciting rewards!
      </Typography>
      <StyledButton component={Link} to="/challenges">Be the change now</StyledButton>
    </div>
    <img src="/homechal.jpg" alt="" width="400px"/>
  </CommunityChallengersSection>
);

// Take Action & Inspire Section Component
const TakeActionInspire = () => {
  const [forums, setForums] = useState([]);
  const [visibleForums, setVisibleForums] = useState([]);
  const totalForums = 6; // Assume we have 6 forums available

  useEffect(() => {
    const fetchForums = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/homepage/forums`);
      const data = await response.json();
      setForums(data);
      setVisibleForums(data.slice(0, 4)); // Display the first 4 forums initially
    };

    fetchForums();
  }, []);

  const nextSlide = () => {
    const firstForum = visibleForums.pop(); 
    setVisibleForums([firstForum, ...visibleForums ]);
  };

  const prevSlide = () => { 
    const firstForum = visibleForums.shift(); // Remove the first forum
    setVisibleForums([...visibleForums, firstForum]); // Add it to the end of the array
  };

  return (
    <TakeActionSection>
      <Typography variant="h4" paddingBottom={5} color={theme.palette.secondary.light}><b>Take action & Inspire</b></Typography>
      <CardCarousel>
        {visibleForums.map((forum, index) => (
          <StyledCard key={index}>
            <CardMedia
              component="img"
              height="140"
              image={forum.image ? `${import.meta.env.VITE_API_URL}/${forum.image}` : 'https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
              alt="forum image"
            />
            <StyledCardContent>
              <Typography variant="h6">{forum.title}</Typography>
              <Typography variant="body2">{forum.description}</Typography>
            </StyledCardContent>
          </StyledCard>
        ))}
      </CardCarousel>
      <StyledButtonWhite onClick={nextSlide} style={{marginBottom: 0, border: 'none'}} >&lt;</StyledButtonWhite>
      <StyledButtonWhite onClick={prevSlide} style={{marginBottom: 0, border: 'none'}}>&gt;</StyledButtonWhite>
      <br/>
      <StyledButtonWhite component={Link} to="/forum">Delve Deeper</StyledButtonWhite>
    </TakeActionSection>
  );
};

const creators = [
  {
    name: 'Andrew Kang',
    title: 'Forum Management',
    image: '/creators/andrew.png',
    bio: 'Andrew connects with our community and drives engagement, ensuring that every voice is heard and valued.',
    link: 'https://www.linkedin.com/in/jmy-andrew/'
  },
  {
    name: 'Charlotte Poon',
    title: 'Event Management',
    image: '/creators/charlotte.png',
    bio: 'Charlotte brings creativity and innovation to every project, ensuring that the user experience is both beautiful and intuitive.',
    link: 'https://www.linkedin.com/in/charlotte-poon-a380a72b4/'
  },
  {
    name: 'Chloe Low',
    title: 'Challenge Management',
    image: '/creators/chloe.png',
    bio: 'Chloe is a tech enthusiast passionate about leveraging modern technology to make the world more fun and interesting.',
    link: 'https://www.linkedin.com/in/chloelkl/'
  },
  {
    name: 'Ji Wei',
    title: 'Reward Management',
    image: '/creators/jiwei.png',
    bio: 'Ji Wei is the brain behind our marketing strategies, driving growth and brand recognition with innovative campaigns.',
    link: 'https://www.linkedin.com/in/foo-ji-wei-9401b72b4/'
  },
  {
    name: 'Rone Peh',
    title: 'User Management',
    image: '/creators/rone.jpg',
    bio: 'Rone crafts compelling content that resonates with our audience, ensuring our message is clear and impactful.',
    link: 'https://www.linkedin.com/in/ronepeh/'
  },
];

const CreatorSection = () => (
  <Container style={{width: '95%', margin: 'auto', paddingBottom: '50px'}}>
    <Typography variant="h4" align="center" gutterBottom padding={5}>
      <b>Meet the Developers</b>
    </Typography>
    <Grid container spacing={3} justifyContent="center">
      {creators.map((creator, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={index} style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to={`${creator.link}`} target="_blank" style={{textDecoration: 'none', color: 'inherit'}}>
          <CreatorCard>
            <Avatar src={creator.image} alt={creator.name} style={{ marginRight: '20px', width: '80px', height: '80px' }} />
            <CardContent>
              <Typography variant="h6">{creator.name}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {creator.title}
              </Typography>
              <Typography variant="body2">{creator.bio}</Typography>
            </CardContent>
          </CreatorCard>
          </Link>
          
        </Grid>
      ))}
    </Grid>
  </Container>
);


// Main Home Component
function Homepage() {
  return (
    <Container style={{ padding: 0 }}>
      <Banner>
        <div>
          <Typography variant="h5">LET'S MAKE THE ENVIRONMENT</Typography>
          <Typography variant="h5" style={{ color: theme.palette.primary.main }}>A BETTER PLACE</Typography>
          <StyledButton component={Link} to="/forum">Learn More</StyledButton>
        </div>
        <img src="/treebulb.png" alt="" width="400px" />
      </Banner>
      <AwarenessExposure/>
      <CommunityChallengers />
      <TakeActionInspire />
      <CreatorSection />
    </Container>
  );
};

export default Homepage;
