import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostEvent.css';
import PostEventSidebar from '../../components/PostEventSidebar';
import { Typography, Card, CardContent } from '@mui/material';

const PostEvent = () => {
    const [events, setEvents] = useState([]);

    // Fetch events from the server when the component mounts
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/eventpost`)
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div className="postevent">
            <PostEventSidebar />

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
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PostEvent;
