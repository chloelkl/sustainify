import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventOverview.css';

const EventOverview = () => {
    const navigate = useNavigate();

    const handleHostNowClick = () => {
        navigate('/eventhosting');
    };

    const handleViewAllEventsClick = () => {
        navigate('/postevent');
    };

    return (
        <div className="event-overview">
            <section className="combined-container">
                <h2>HOST WITH US FOR A SUSTAINABLE IMPACT</h2>
                <p>
                    <strong>Plan your next sustainable event with us!</strong> We specialize in hosting eco-friendly challenges for
                    like-minded individuals and organizations who care about the environment. From conferences to
                    hackathons, we provide the sustainability with every event. Join us for a sustainable world
                    and start making your green event vision come to life!
                </p>
                <button className="host-now-button" onClick={handleHostNowClick}>HOST NOW</button>

                <h2>FULL & FREE SERVICES TO HOST EVENTS</h2>
                <p>
                    <strong>SUSTAINIFY offers individuals and organizations the opportunity to host engaging and meaningful events </strong>
                    that foster community involvement.
                </p>

                <h2>ON GOING EVENTS</h2>
                <p>
                    <strong>Explore the different events based on your interests and share your experience to earn some rewards! </strong>
                    
                </p>
                <button className="view-all-events-button" onClick={handleViewAllEventsClick}>VIEW ALL EVENTS</button>
            </section>

            
        </div>
    );
};

export default EventOverview;
