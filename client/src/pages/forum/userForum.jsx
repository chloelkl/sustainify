import React from 'react';
import { Button, Avatar, IconButton} from '@mui/material';
import { IoIosAddCircleOutline } from "react-icons/io";

const UserForum = () => {
  const user = {
    name: 'John Doe',
    blogs: 10,
    followers: 12000,
    followering: 12390,
    profileImage: 'https://via.placeholder.com/150'
  };

  const styles = {
    profileContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '20px',
      padding: '10px',
      flexDirection: 'row',
      '@media (max-width: 600px)': {
        flexDirection: 'column',
        alignItems: 'center'
      }
    },
    profileImage: {
      marginRight: '20px',
      '@media (max-width: 600px)': {
        marginRight: '0',
        marginBottom: '10px'
      }
    },
    profileDetails: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    profileName: {
      margin: '0',
      textAlign: 'center',
      fontWeight: 'normal'
    },
    profileStats: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: '70px',
      margin: '10px, 0',
      marginRight: '50px',
      textAlign: 'center'
    },
    followButton: {
      alignSelf: 'center'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '10px',
      marginLeft: '10px'
    },
    button: {
      width: '175px',
      fontSize: '15px',
    },
    stats: {
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.profileContainer}>
      <div style={styles.profileImage}>
        <Avatar alt={user.name} src={user.profileImage} sx={{ width: 150, height: 150 }} />
      </div>
      <div style={styles.profileDetails}>
        <h2 style={styles.profileName}>{user.name}</h2>
        <div style={styles.profileStats}>
          <div style={styles.profileStat}>
            <p style={styles.stats}>{user.blogs}</p>
            <p>Blogs</p>
          </div>
          <div style={styles.profileStat}>
            <p style={styles.stats}>{user.followers}</p>
            <p>Inspired</p>
          </div>
          <div style={styles.profileStat}>
            <p style={styles.stats}>{user.followering}</p>
            <p>Connections</p>
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <Button variant="contained" color="primary"style={styles.button}>Manage Profile</Button>
          <Button variant="outlined" color="primary"style={styles.button}>Liked Blogs</Button>
          <IconButton color="primary" aria-label="add">
          <IoIosAddCircleOutline />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default UserForum;
