import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import EventAdminSidebar from '../../components/EventAdminSidebar';
import { useNavigate } from 'react-router-dom';
import './EventHostingAdmin.css';

const EventHostingAdmin = () => {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/event`)
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
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
        axios.delete(`${import.meta.env.VITE_API_URL}/event/${selectedEventId}`)
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
        <div className="eventhostingadmin">
            <div className="eventhostingadmin-sidebar">
                <EventAdminSidebar />
            </div>
            <div className="eventhostingadmin-content">
                <Typography variant="h4" component="h1" className="admin-title">
                    Event Proposals
                </Typography>
                <TableContainer component={Paper} className="admin-table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Event Hoster</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Event Name</TableCell>
                                <TableCell>Event Date</TableCell>
                                <TableCell>Event Time</TableCell>
                                <TableCell>Venue</TableCell>
                                <TableCell style={{ minWidth: '150px' }}>Description</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.eventhoster}</TableCell>
                                    <TableCell>{event.phonenumber}</TableCell>
                                    <TableCell>{event.email}</TableCell>
                                    <TableCell>{event.eventname}</TableCell>
                                    <TableCell>{event.eventdate}</TableCell>
                                    <TableCell>{event.eventtime}</TableCell>
                                    <TableCell>{event.venue}</TableCell>
                                    <TableCell>{event.eventdescription}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleClickOpen(event.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <DialogContentText>
                        Are you sure you want to delete this proposal?
                    </DialogContentText>
                </DialogContent >
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

export default EventHostingAdmin;
