import React, { useEffect, useState } from "react";
import Masonry from "react-responsive-masonry";
import SaveIcon from "@mui/icons-material/Save";
import ForumCard from "./ForumCard";
import {
  Box,
  Input,
  IconButton,
  Typography,
  Modal,
  CardMedia,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import dayjs from "dayjs";
import global from "../../global";
import http from "../../http";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const dateFormat = "D MMM YYYY";
function Forum() {
  const { user, role, authToken } = useAuth();
  const [forumList, setForumList] = useState([]);
  const [search, setSearch] = useState("");
  const [saveStatus, setSaveStatus] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSaveForum = async () => {
    if (!selectedItem) return;

    try {
      const response = await http.post('/forum/save-forum', {
        title: selectedItem.title,
        description: selectedItem.description,
        image: selectedItem.image,
        username: selectedItem.User.username,
        createdDate: selectedItem.createdAt,
        userId: user.userID,
      });
  
      if (response.status === 200) {
        setSaveStatus(prevStatus => ({
          ...prevStatus,
          [selectedItem.id]: 'success'
        }));
      }
    } catch (error) {
      console.error('Error saving forum:', error);
      setSaveStatus(prevStatus => ({
        ...prevStatus,
        [selectedItem.id]: 'error'
      }));
      alert('Failed to save the forum. Please try again.');
    }
  };

  const getIconColor = (itemId) => {
    return saveStatus[itemId] === 'success'
      ? 'green'
      : saveStatus[itemId] === 'error'
      ? 'red'
      : 'default';
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getForums = () => {
    http
      .get("/forum", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setForumList(res.data);
          console.log("Fetched Forums:", res.data);
        } else {
          setForumList([]);
          console.error("Expected array but received:", res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching forums:", error);
      });
  };

  const searchForums = () => {
    http
      .get(`/forum?search=${search}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setForumList(res.data);
          console.log("Searched Forums:", res.data);
        } else {
          setForumList([]);
          console.error("Expected array but received:", res.data);
        }
      })
      .catch((error) => {
        console.error("Error searching forums:", error);
      });
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchForums();
    }
  };

  const onClickSearch = () => {
    searchForums();
  };

  const onClickClear = () => {
    setSearch("");
    getForums();
  };

  useEffect(() => {
    getForums();
  }, []);

  if (role !== "admin" && role !== "user") {
    return (
      <Typography variant="h6">You do not have access to this page.</Typography>
    );
  }

  return (
    <Box
    sx={{
      mx: "7rem",
      mt: "2rem"
    }}>
      <Typography variant="h5" sx={{ my: 2 }}></Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mb: 2,
          backgroundColor: "white",
          borderRadius: 2,
          padding: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: 1,
            padding: "2px 10px",
            
          }}
        >
          <Input
            value={search}
            placeholder="Search"
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            disableUnderline
            sx={{
              flex: 1,
              padding: "6px 8px",
              fontSize: "1rem",
              borderRadius: 1,
            }}
          />
          <IconButton
            color="primary"
            onClick={onClickSearch}
            sx={{ padding: "8px" }}
          >
            <Search />
          </IconButton>
          <IconButton
            color="primary"
            onClick={onClickClear}
            sx={{ padding: "8px" }}
          >
            <Clear />
          </IconButton>
        </Box>
      </Box>
      <div className="Forum" style={{ padding: "20px" }}>
        <Masonry columnsCount={4} gutter="10px">
          {forumList.map((item) => (
            <ForumCard
              key={item.id}
              item={item}
              onCardClick={() => handleCardClick(item)}
            />
          ))}
        </Masonry>
      </div>

      {selectedItem && (
        <Modal
          open={Boolean(selectedItem)}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "80%",
              maxWidth: 900,
              height: "auto",
              minHeight: "300px",
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 24,
              display: "flex",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box sx={{ width: "40%", height: "auto" }}>
              <CardMedia
                component="img"
                image={
                  selectedItem.image
                    ? `${import.meta.env.VITE_API_URL}/${selectedItem.image}`
                    : "https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                }
                alt={selectedItem.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box sx={{ width: "60%", padding: 3, position: "relative" }}>
            <IconButton
                aria-label="save"
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: getIconColor(selectedItem.id), // Apply color based on save status
                }}
                onClick={handleSaveForum}
              >
                <SaveIcon />
              </IconButton>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                {selectedItem.title}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-line",
                    wordBreak: "break-word", // Ensures long words break and wrap
                  }}
                >
                  {selectedItem.description}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                sx={{ position: "absolute", bottom: 16, left: 16, right: 16 }}
              >
                <Link
                  to={`/forum/by/${selectedItem.userId}`}
                  style={{
                    textDecoration: "none", // Remove default underline
                    color: "inherit", // Inherit color from parent
                    display: "inline-block", // Make the link inline-block for better styling
                    position: "relative", // Needed for the pseudo-element
                    paddingBottom: "2px", // To adjust space for underline effect
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "textSecondary",
                      transition: "color 0.3s, textDecoration 0.3s", // Smooth transition
                      "&:hover": {
                        color: "primary.main", // Change text color on hover
                      },
                    }}
                  >
                    {selectedItem.User?.username}
                  </Typography>
                </Link>
                <Typography variant="body2" color="textSecondary">
                  {dayjs(selectedItem.createdAt).format(dateFormat)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default Forum;
