import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostEvent.css';
import PostEventAdminSidebar from '../../components/PostEventAdminSidebar';
import {
    Typography, IconButton, Card, CardContent, CardActions,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PostEventAdmin = () => {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/eventpost`)
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    };

    const handleEditClick = (id) => {
        navigate(`/edithostingadmin/${id}`);
    };

    const handleClickOpen = (id) => {
        setSelectedEventId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEventId(null);
    };

    const handleConfirmDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/eventpost/${selectedEventId}`)
            .then(() => {
                fetchEvents();
                handleClose();
            })
            .catch(error => {
                console.error('There was an error deleting the event!', error);
                handleClose();
            });
    };

    return (
        <div className="postevent">
            <PostEventAdminSidebar />

            <div className="postevent-content">
                <Typography variant="h4" component="h1" gutterBottom>
                    Events
                </Typography>
                {events.map(event => (
                    <Card className="event-card" key={event.id}>
                        <CardContent>
                            {event.image && (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/${event.image}`}
                                    alt={event.eventname}
                                    className="event-image"
                                />
                            )}
                            <Typography variant="h5" component="h2">
                                {event.eventname}
                                <Typography color="textSecondary">
                                    Date: {event.eventdate}
                                </Typography>
                            </Typography>
                            <Typography color="textSecondary">
                                Time: {event.eventtime}
                            </Typography>
                            <Typography color="textSecondary">
                                Venue: {event.venue}
                            </Typography>
                            <Typography variant="body2" component="p">
                                Event Description: {event.eventdescription}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <IconButton onClick={() => handleEditClick(event.id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleClickOpen(event.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
                ))}
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <DialogContentText>
                        Are you sure you want to delete this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>                    
                    <Button onClick={handleConfirmDelete} sx={{ color: 'black', background: "#87AEA6" }}>
                        Delete
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PostEventAdmin;
