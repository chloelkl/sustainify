import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http';
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { useFormik } from 'formik';
import * as yup from 'yup';

const styles = {
    NavigateButton: {
        color: 'black',
        backgroundColor: 'white', // Example background color
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        fontWeight: 'bold',
        fontSize: '40px',
        cursor: 'pointer',
    },
}

function EditReward({ onSave }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reward, setReward] = useState({
        rewardname: "",
        points: "",
        rewardImage: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/reward/${id}`).then((res) => {
            setReward(res.data);
            setLoading(false);
        }).catch((error) => {
            console.error("Error fetching reward data: ", error);
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        if (reward.rewardImage) {
            setImagePreview(`${import.meta.env.VITE_API_URL}/${reward.rewardImage}`);
        } else {
            setImagePreview(null);
        }
    }, [reward.rewardImage]);

    const formik = useFormik({
        initialValues: reward,
        enableReinitialize: true,
        validationSchema: yup.object({
            rewardname: yup.string().trim()
                .min(3, 'Reward Name must be at least 3 characters')
                .max(100, 'Reward Name must be at most 100 characters')
                .required('Reward Name is required'),
            points: yup.number()
                .required('Points are required')
                .typeError('Points must be a number')
                .positive('Points must be a positive number')
                .integer('Points must be an integer'),
            rewardImage: yup.mixed().notRequired()
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('rewardname', values.rewardname.trim());
            formData.append('points', values.points);
            if (values.rewardImage instanceof File) {
                formData.append('rewardImage', values.rewardImage);
            }
            try {
                const res = await http.put(`/reward/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                navigate("/rewards/Rewards");
                handleSaveReward(res.data);
            } catch (error) {
                console.error("Error updating reward:", error);
            }
        }
    });

    const handleSaveReward = (updatedReward) => {
        setReward(updatedReward);
        console.log("Reward saved:", updatedReward);
    };

    const handleBack = () => {
        navigate(`/rewards/Rewards`);
    }

    return (
        <Box
            sx={{
                bgcolor: 'white',
                p: 2,
                borderRadius: 8,
                maxWidth: '800px',
                margin: '50px auto', // Space at the top and bottom, centered horizontally
                paddingLeft: '120px',
                paddingRight: '120px',
                paddingTop: '50px',
                paddingBottom: '50px',
                boxSizing: 'border-box',
            }}
        >
            <button
                onClick={handleBack}
                variant="contained"
                style={styles.NavigateButton}
            >
                &lt;
            </button>
            <Typography variant="h5" sx={{ mb: 2, fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }}>
                Edit Reward
            </Typography>
            <Box>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                margin="normal"
                                autoComplete="off"
                                label="Reward Name"
                                name="rewardname"
                                value={formik.values.rewardname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.rewardname && Boolean(formik.errors.rewardname)}
                                helperText={formik.touched.rewardname && formik.errors.rewardname}
                                sx={{
                                    maxWidth: '100%' // Ensure the TextField does not exceed the container
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                margin="normal"
                                autoComplete="off"
                                label="Points"
                                name="points"
                                value={formik.values.points}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.points && Boolean(formik.errors.points)}
                                helperText={formik.touched.points && formik.errors.points}
                                sx={{
                                    maxWidth: '100%' // Ensure the TextField does not exceed the container
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                mt: 2,
                                textAlign: 'center'
                            }}
                        >
                            Upload Image
                            <input
                                type="file"
                                hidden
                                onChange={(event) => {
                                    const file = event.currentTarget.files[0];
                                    formik.setFieldValue('rewardImage', file);
                                    if (file) {
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            height: '300px',
                            marginBottom: '20px',
                            marginTop: '20px',
                            paddingTop: '25px',
                            paddingBottom: '25px',
                            border: '2px solid lightgrey',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}
                    >
                        {imagePreview ? (
                            <>
                                <Typography variant="body2">Selected file:</Typography>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '5px' }}
                                />
                            </>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No image selected
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
                        <Button variant="contained" type="submit">
                            Edit
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export default EditReward;
