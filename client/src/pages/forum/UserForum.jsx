import React, { useEffect, useState } from 'react';
import { Button, Modal, Avatar, IconButton, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { IoIosAddCircleOutline } from "react-icons/io";
import http from '../../http';
import { useParams, Link } from 'react-router-dom';
import Masonry from "react-responsive-masonry";
import { TbEdit } from "react-icons/tb";
import EditForm from './EditForum';
import { useAuth } from '../../context/AuthContext';

const styles = {
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px',
    padding: '10px',
    flexDirection: 'row',
    '@media (maxWidth: 600px)': {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  profileImage: {
    marginRight: '20px',
    '@media (maxWidth: 600px)': {
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
    gap: '30px',
    margin: '5px 0',
    textAlign: 'center'
  },
  followButton: {
    alignSelf: 'center'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    margin: '0 10px'
  },
  button: {
    width: '175px',
    fontSize: '15px',
  },
  stats: {
    fontWeight: 'bold'
  }
};

function UserForums() {
  const { authToken } = useAuth();
  const { userId } = useParams();
  const [forums, setForums] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForum, setSelectedForum] = useState(null);

  console.log(authToken);
  console.log(userId);
  useEffect(() => {
    http.get(`/forum/by/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => {
        const forumsData = response.data;
        if (Array.isArray(response.data)) {
          setForums(response.data);
        } else {
          setForums([]);
        }
        if (forumsData.length > 0) {
          setUser(forumsData[0].User);
        } else {
          // Fetch user data separately if no forums are found
          http.get(`/user/${userId}`)
            .then(userResponse => {
              setUser(userResponse.data);
            })
            .catch(userError => {
              setError(userError.message);
            });
        }
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleEditClick = (forum) => {
    setSelectedForum(forum);
  };

  const handleCloseModal = () => {
    setSelectedForum(null);
  };

  const handleSaveForum = (updatedForum) => {
    setForums((prevForums) => prevForums.map(forum =>
      forum.id === updatedForum.id ? updatedForum : forum
    ));
  };

  const handleDeleteForum = async (forumId) => {
    try {
      await http.delete(`/forum/${userId}/${forumId}`);
      setForums((prevForums) => prevForums.filter(forum => forum.id !== forumId));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting forum:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const ForumItems = forums.map((item) => (
    <Card key={item.id} sx={{ mb: 2, boxShadow: 3, position: 'relative' }}>
      <Link to={`/user/${item.userId}/forum`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          image={item.image || 'https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
          alt={item.title}
          sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '4px 4px 0 0' }}
        />
        <CardContent sx={{ padding: 2 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{ wordWrap: 'break-word', mb: 1, fontWeight: 'bold' }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ wordWrap: 'break-word', mb: 2 }}
          >
            {item.description}
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              marginRight: '10px',
              marginBottom: '10px',
              fontSize: '25px',
              cursor: 'pointer',
            }}
            onClick={() => handleEditClick(item)}
          >
            <TbEdit />
          </Box>
        </CardContent>
      </Link>
    </Card>


  ));

  return (
    <>
      <div style={styles.profileContainer}>
        <div style={styles.profileImage}>
          <Avatar alt={user.username} src={user.profileImage || 'https://via.placeholder.com/150'} sx={{ width: 150, height: 150 }} />
        </div>
        <div style={styles.profileDetails}>
          <Typography variant="h4" component="div" style={styles.profileName}>
            {user.username}
          </Typography>
          <div style={styles.profileStats}>
            <div style={styles.profileStats}>
              <p style={styles.stats}>{forums.length}</p>
              <p>Blogs</p>
            </div>
            <div style={styles.profileStats}>
              <p style={styles.stats}>{user.followers || 0}</p>
              <p>Inspired</p>
            </div>
            <div style={styles.profileStats}>
              <p style={styles.stats}>{user.following || 0}</p>
              <p>Connections</p>
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <Button variant="contained" color="primary" style={styles.button}>Manage Profile</Button>
            <Button variant="outlined" color="primary" style={styles.button}>Liked Blogs</Button>
            <IconButton color="primary" aria-label="add">
              <Link to={`/user/${userId}/forum/addforum`}>
                <IoIosAddCircleOutline />
              </Link>
            </IconButton>
          </div>
        </div>
      </div>
      <div>
        <h1>User's Forums</h1>
        <div className="Forum" style={{ padding: "20px" }}>
          <Masonry columnsCount={3} gutter="10px">
            {ForumItems}
          </Masonry>
        </div>
      </div>
      <Modal open={Boolean(selectedForum)} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          {selectedForum && (
            <EditForm forum={selectedForum} onClose={handleCloseModal} onSave={handleSaveForum} onDelete={handleDeleteForum} />
          )}
        </Box>
      </Modal>
    </>
  );
}

export default UserForums;
