import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button } from '@mui/material';
import { Delete as DeleteIcon, Email as EmailIcon } from '@mui/icons-material';
import EventHostingAdminSidebar from '../../components/EventHostingAdminSidebar';
import { useNavigate } from 'react-router-dom';
import './EventHostingAdmin.css';

const EventHostingAdmin = () => {
    const [events, setEvents] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEmail, setOpenEmail] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);  // New state for booking confirmation modal
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

    const handleClickOpenDelete = (id) => {
        setSelectedEventId(id);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedEventId(null);
    };

    const handleConfirmDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/event/${selectedEventId}`)
            .then(() => {
                fetchEvents();
                handleCloseDelete();
            })
            .catch(error => {
                console.error('There was an error deleting the event!', error);
                handleCloseDelete();
            });
    };

    const handleClickOpenEmail = (id) => {
        setSelectedEventId(id);
        setOpenEmail(true);
    };

    const handleCloseEmail = () => {
        setOpenEmail(false);
        setSelectedEventId(null);
    };

    const handleSendEmail = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/eventemail/send`, { eventId: selectedEventId })
            .then(() => {
                handleCloseEmail();
                setOpenConfirmation(true);  // Show the confirmation modal after sending the email
            })
            .catch(error => {
                console.error('There was an error sending the email!', error);
                handleCloseEmail();
            });
    };

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };

    return (
        <div className="eventhostingadmin">
            <div className="eventhostingadmin-sidebar">
                <EventHostingAdminSidebar />
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
                                    <TableCell className='event-description' >{event.eventdescription}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleClickOpenDelete(event.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpenEmail(event.id)}>
                                            <EmailIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {/* Delete Confirmation Modal */}
            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
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
                    <Button onClick={handleCloseDelete} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Email Confirmation Modal */}
            <Dialog
                open={openEmail}
                onClose={handleCloseEmail}
            >
                <DialogTitle>Send Approval Email</DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <DialogContentText>
                        Are you sure you want to send an approval email for this event proposal?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={handleSendEmail} sx={{ color: 'black', background: "#87AEA6" }}>
                        Send Email
                    </Button>
                    <Button onClick={handleCloseEmail} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Booking Confirmation Modal */}
            <Dialog
                open={openConfirmation}
                onClose={handleCloseConfirmation}
            >
                <DialogTitle>Booking Confirmation</DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <DialogContentText>
                        Booking confirmation email sent successfully!
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={handleCloseConfirmation} sx={{ color: 'black', background: "#87AEA6" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EventHostingAdmin;
