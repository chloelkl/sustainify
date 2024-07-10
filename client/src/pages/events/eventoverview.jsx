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
            <section className="host-with-us">
                <h2>HOST WITH US FOR A SUSTAINABLE IMPACT</h2>
                <p>
                    Plan your next sustainable event with us! We specialize in hosting eco-friendly challenges for
                    like-minded individuals and organizations who care about the environment. From conferences to
                    hackathons, we provide the sustainability with every event. Join us for a sustainable world
                    and start making your green event vision come to life!
                </p>
                <button className="host-now-button" onClick={handleHostNowClick}>HOST NOW</button>
            </section>

            <section className="full-free-services">
                <h2>FULL & FREE SERVICES TO HOST EVENTS</h2>
                <p>
                    SUST EVERY offers individuals and organizations the opportunity to host engaging and meaningful events
                    that foster community involvement.
                </p>
                <button className="view-all-events-button" onClick={handleViewAllEventsClick}>VIEW ALL EVENTS</button>
            </section>

            <section className="explore-events">
                <h2>EXPLORE EVENTS</h2>
                <div className="explore-events-container">
                    <form>
                        <label>
                            Event:
                            <input type="text" placeholder="Sustainability workshops, etc." />
                        </label>
                        <label>
                            Where:
                            <input type="text" placeholder="Eg. Abuja, CO" />
                        </label>
                        <label>
                            When:
                            <input type="text" placeholder="dd/mm/yyyy" />
                        </label>
                        <button type="submit" className="search-button">SEARCH</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default EventOverview;
