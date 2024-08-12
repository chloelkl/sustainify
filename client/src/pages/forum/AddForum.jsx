import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import http from "../../http";
import { useAuth } from "../../context/AuthContext";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const placeholderImage = "https://www.google.com/imgres?q=placeholder%20image&imgurl=https%3A%2F%2Fwww.anelto.com%2Fwp-content%2Fuploads%2F2021%2F08%2Fplaceholder-image.png&imgrefurl=https%3A%2F%2Fwww.anelto.com%2Fsenior-living%2Fplaceholder-image%2F&docid=4zZ1fveChEDkiM&tbnid=2vPMmqYJEzuiWM&vet=12ahUKEwityKrUt-mHAxVEwjgGHZ-FNWEQM3oECFUQAA..i&w=800&h=600&hcb=2&ved=2ahUKEwityKrUt-mHAxVEwjgGHZ-FNWEQM3oECFUQAA";

function AddForum() {
  const { authToken } = useAuth();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    http
      .get(`/forum/by/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching username:", error);
      });
  }, [authToken, userId]);

  const initialValues = {
    userName: user.username || "",
    title: "",
    description: "",
    image: null,
  };

  const validationSchema = yup.object({
    title: yup
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be at most 100 characters")
      .required("Title is required"),
    description: yup
      .string()
      .trim()
      .min(3, "Description must be at least 3 characters")
      .max(500, "Description must be at most 500 characters")
      .required("Description is required"),
    image: yup.mixed().required("Image is required"),
  });

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", user.username);
    formData.append("title", values.title.trim());
    formData.append("description", values.description.trim());
    formData.append("image", values.image);

    http
      .post("/forum", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        navigate("/forum");
      })
      .catch((error) => {
        console.error("Error adding forum:", error);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(formik) => (
        <Form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "70vh",
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                maxWidth: "1200px",
                width: "100%",
                mx: "auto",
                p: 3,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 3,
                gap: 2,
                flexDirection: "row",
              }}
            >
               {/* Left Section */}
               <Box
                sx={{
                  width: "40%",
                  height: "auto",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: 'auto',
                    height: 'auto',
                    minHeight: '400px', // Set a minimum height
                    overflow: 'hidden',
                    borderRadius: 1,
                    border: '1px solid #ddd',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    backgroundImage: `url(${imagePreview || placeholderImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!imagePreview && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: 1,
                      }}
                    >
                      <IconButton
                        aria-label="upload"
                        component="label"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                      >
                        <input
                          type="file"
                          hidden
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            formik.setFieldValue("image", file);
                            if (file) {
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                        <UploadFileIcon />
                      </IconButton>
                    </Box>
                  )}
                  {imagePreview && (
                    <IconButton
                      aria-label="upload"
                      component="label"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue("image", file);
                          if (file) {
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <UploadFileIcon />
                    </IconButton>
                  )}
                </Box>
                <ErrorMessage
                  name="image"
                  component="div"
                  className="field-error"
                />
              </Box>

              {/* Right Section */}
              <Box sx={{ width: "60%", pl: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: "1.8rem"}}>
                  Post Your Experiences
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, color: "text.secondary" }}
                >
                  {user.username}
                </Typography>

                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  multiline
                  minRows={3}
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button variant="contained" type="submit">
                    Publish
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default AddForum;
