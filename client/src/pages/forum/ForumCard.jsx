import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import dayjs from "dayjs";

const ForumCard = ({ item, onCardClick }) => (
  <Card
    key={item.id}
    sx={{
      mb: 2,
      margin: "5px",
      boxShadow: 3,
      position: "relative",
      transition: "transform 0.3s ease",
      overflow: "hidden",
      cursor: "pointer",
      "&:hover": {
        transform: "scale(1.05)", // Slight enlargement on hover
        boxShadow: 6, // Increase the shadow on hover to emphasize the effect
      },
      "&:hover .cardContent": {
        opacity: 1,
        transform: "scale(1.05) translateY(-5px)", // Slight pop-out effect with upward translation
      },
    }}
    onClick={() => onCardClick(item)}
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
        minHeight: "12rem",
        objectFit: "cover",
        display: "block",
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
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        opacity: 0,
        transform: "translateY(20px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        borderRadius: "0 0 4px 4px",
      }}
    >
      <Typography
        component="div"
        sx={{ wordWrap: "break-word", mb: 1, fontWeight: "bold" }}
      >
        {item.title}
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2" color="textSecondary"
        sx={{ color: 'white' ,opacity: 0.5, fontSize: '0.7rem'}}>
          {item.User?.username}
        </Typography>
        <Typography variant="body2" color="textSecondary"
        sx={{ color: 'white' ,opacity: 0.5, fontSize: '0.7rem'}}>
          {dayjs(item.createdAt).format("D MMM YYYY")}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default ForumCard;
