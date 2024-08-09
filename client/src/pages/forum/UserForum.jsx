import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Avatar,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { IoIosAddCircleOutline } from "react-icons/io";
import http from "../../http";
import { useParams, Link } from "react-router-dom";
import Masonry from "react-responsive-masonry";
import { TbEdit } from "react-icons/tb";
import EditForm from "./EditForum";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

const styles = {
  profileContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px",
    marginTop: "3rem",
    padding: "10px",
    flexDirection: "row",
    "@media (maxWidth: 600px)": {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  profileImage: {
    marginRight: "20px",
    "@media (maxWidth: 600px)": {
      marginRight: "0",
      marginBottom: "10px",
    },
  },
  profileDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  profileName: {
    margin: "0",
    textAlign: "center",
    fontWeight: "normal",
  },
  profileStats: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "30px",
    margin: "5px 0",
    textAlign: "center",
  },
  followButton: {
    alignSelf: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "0 10px",
  },
  button: {
    width: "175px",
    fontSize: "15px",
    height: "50px",
  },
  stats: {
    fontWeight: "bold",
  },
  forumContainer: {
    marginTop: "3rem",
  },
};

function UserForums() {
  const { user, admin, authToken } = useAuth();
  const { userId } = useParams();
  const [forums, setForums] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForum, setSelectedForum] = useState(null);

  const isCurrentUser = user && user.userID === parseInt(userId);

  useEffect(() => {
    http
      .get(`/forum/by/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        const forumsData = response.data;
        if (Array.isArray(response.data)) {
          setForums(response.data);
        } else {
          setForums([]);
        }
        if (forumsData.length > 0) {
          setUserProfile(forumsData[0].User);
        } else {
          http
            .get(`/user/retrieveDetails/${userId}`)
            .then((userResponse) => {
              setUserProfile(userResponse.data);
            })
            .catch((userError) => {
              setError(userError.message);
            });
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [userId, authToken]);

  const handleEditClick = (forum) => {
    setSelectedForum(forum);
  };

  const handleCloseModal = () => {
    setSelectedForum(null);
  };

  const handleSaveForum = (updatedForum) => {
    setForums((prevForums) =>
      prevForums.map((forum) =>
        forum.id === updatedForum.id ? updatedForum : forum
      )
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const ForumItems = forums.map((item) => (
    <Card
      key={item.id}
      sx={{
        mb: 2,
        boxShadow: 3,
        margin: "5px",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          ".cardContent": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
      onClick={() => handleEditClick(item)}
    >
      <CardMedia
        component="img"
        image={
          item.image
            ? `${import.meta.env.VITE_API_URL}/${item.image}`
            : "https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        }
        alt={item.title}
        sx={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
          borderRadius: "4px 4px 0 0",
        }}
      />
      <CardContent
        className="cardContent"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 2,
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay for content
          color: "white",
          opacity: 0,
          transform: "translateY(20px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ wordWrap: "break-word", mb: 1, fontWeight: "bold" }}
        >
          {item.title}
        </Typography>
        <Typography
          variant="body2"
          component="div"
          sx={{ wordWrap: "break-word" }}
        >
          {dayjs(item.createdAt).format("D MMM YYYY")}
        </Typography>
        {isCurrentUser && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: "25px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from opening when clicking the edit icon
              handleEditClick(item);
            }}
          >
            <TbEdit />
          </Box>
        )}
      </CardContent>
    </Card>
  ));

  return (
    <>
      <div style={styles.profileContainer}>
        <div style={styles.profileImage}>
          <Avatar
            alt={userProfile.username}
            src={userProfile.profileImage || "https://via.placeholder.com/150"}
            sx={{ width: 150, height: 150 }}
          />
        </div>
        <div style={styles.profileDetails}>
          <Typography variant="h4" component="div" style={styles.profileName}>
            {userProfile.username}
          </Typography>
          <div style={styles.profileStats}>
            <div style={styles.profileStats}>
              <p style={styles.stats}>{forums.length}</p>
              <p>Blogs</p>
            </div>
            <div style={styles.profileStats}>
              <p style={styles.stats}>{userProfile.followers || 0}</p>
              <p>Inspired</p>
            </div>
            <div style={styles.profileStats}>
              <p style={styles.stats}>{userProfile.following || 0}</p>
              <p>Connections</p>
            </div>
          </div>
          {isCurrentUser && (
            <div style={styles.buttonContainer}>
              {user ? (
                <Link to="/account/user/main">
                  <Button
                    variant="outlined"
                    color="primary"
                    style={styles.button}
                  >
                    Manage Profile
                  </Button>
                </Link>
              ) : admin ? (
                <Link to="/account/admin/main">
                  <Button
                    variant="outlined"
                    color="primary"
                    style={styles.button}
                  >
                    Manage Profile
                  </Button>
                </Link>
              ) : null}
              <Button variant="outlined" color="primary" style={styles.button}>
                Liked Blogs
              </Button>
            </div>
          )}
        </div>
      </div>
      <div style={styles.forumContainer}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2, // Margin bottom for spacing
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginRight: "10px", // Margin between text and button
              fontWeight: "bold",
            }}
          >
            My Experiences
          </Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <Link
              to={`/user/${userId}/forum/addforum`}
              style={{ textDecoration: "none" }}
            >
              {isCurrentUser && (
              <Button
              variant="contained"
              startIcon={<IoIosAddCircleOutline />}
              aria-label="add"
              sx={{
                marginTop: "0.5rem",
              }}
            >
              Create Post
            </Button>
              )}
              
            </Link>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Divider
            sx={{
              flexGrow: 1,
              borderBottomWidth: 2,
              borderColor: "black",
              opacity: 0.4, // Adjust opacity here
              "&::before": {
                display: "block",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "0 10px",
                color: "black",
                fontSize: "1.5rem",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
        <div style={{ padding: "20px" }}>
          <Masonry columnsCount={3} gutter="10px">
            {ForumItems}
          </Masonry>
        </div>
      </div>

      <Modal
      open={Boolean(selectedForum)}
      onClose={handleCloseModal}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "80%", md: "70%" },
          maxWidth: 900,
          height: "auto",
          minHeight: "300px",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 16, right: 16 }}
          onClick={handleCloseModal}
        >
          <TbEdit />
        </IconButton>
        {selectedForum && (
          <EditForm
            forum={selectedForum}
            onClose={handleCloseModal}
            onSave={handleSaveForum}
          />
        )}
      </Box>
    </Modal>

    </>
  );
}

export default UserForums;
