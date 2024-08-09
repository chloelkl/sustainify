import React, { useEffect, useState } from "react";
import Masonry from "react-responsive-masonry";
import SaveIcon from "@mui/icons-material/Save";
import ForumCard from "./ForumCard"; // Correct path to your ForumCard component
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

function Forum() {
  const { user, role, authToken } = useAuth();
  const [forumList, setForumList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

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
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}></Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          mb: 2,
          backgroundColor: "white",
          borderRadius: 2,
          padding: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h5" sx={{ my: 2, fontWeight: "bold" }}>
          "Getting Inspired One Step at a Time."
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "40%",
          }}
        >
          <Input
            value={search}
            placeholder="Search"
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            sx={{ flex: 1 }}
          />
          <IconButton color="primary" onClick={onClickSearch}>
            <Search />
          </IconButton>
          <IconButton color="primary" onClick={onClickClear}>
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
              minHeight: "500px", // height of modal
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
                }}
              >
                <SaveIcon />
              </IconButton>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                {selectedItem.title}
              </Typography>
              <Box
                sx={{
                  flex: 1, // Allows the Box to grow and take up remaining space

                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {selectedItem.description}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                sx={{ position: "absolute", bottom: 16, left: 16, right: 16 }}
              >
                <Link
                  to={`/forum/by/${selectedItem.userId}`} // Add the link to the username
                  style={{ textDecoration: "none", color: "inherit" }} // Ensures no underline and maintains text color
                >
                  <Typography variant="body2" color="textSecondary">
                    {selectedItem.User?.username}
                  </Typography>
                </Link>
                <Typography variant="body2" color="textSecondary">
                  {dayjs(selectedItem.createdAt).format(global.datetimeFormat)}
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
