import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext';
import Dashboard from './Dashboard';
import SystemOverview from './SystemOverview';
import CommunicationTools from './CommunicationTools';
import UserManagement from './UserManagement';

const AdminMain = () => {
    const [selectedSection, setSelectedSection] = useState(null);
    const [isMorphed, setIsMorphed] = useState(false);
    const [showContainer, setShowContainer] = useState(false);
    const [showSectionTitles, setShowSectionTitles] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleSectionClick = (section) => {
        setSelectedSection(section);
        setIsMorphed(false);
        setShowContainer(false);
        setShowSectionTitles(false); // Hide section titles immediately
        setTimeout(() => {
            setIsMorphed(true);
        }, 250); // Set this to match the duration of the morphing animation
    };

    const handleBackClick = () => {
        setSelectedSection(null);
        setTimeout(() => {
            setShowSectionTitles(true); // Show section titles after a delay
        }, 250); // Match this delay with the morphing animation duration
    };

    useEffect(() => {
        if (isMorphed) {
            setTimeout(() => {
                setShowContainer(true);
            }, 250); // Delay to start showing container after morphing
        }
    }, [isMorphed]);

    const handleLogout = () => {
        logout();
    };

    const renderSection = () => {
        switch (selectedSection) {
            case 'dashboard':
                return <Dashboard />;
            case 'systemOverview':
                return <SystemOverview />;
            case 'communicationTools':
                return <CommunicationTools />;
            case 'userManagement':
                return <UserManagement />;
            default:
                return null;
        }
    };

    return (
        <div style={containerStyle}>
            <div
                style={{ ...logoContainerStyle, ...(selectedSection ? logoPositionStyles[selectedSection] : {}) }}
                onClick={handleBackClick}
            >
                <img src="/src/assets/AdminLogo_XBG.png" alt="Admin Logo" style={imageStyle} />
            </div>
            {selectedSection && (
                <div style={{ 
                    ...commonSectionContainerStyle, 
                    ...(selectedSection === 'dashboard' ? dashboardContainerStyle : {}),
                    ...(selectedSection === 'systemOverview' ? systemOverviewContainerStyle : {}),
                    ...(selectedSection === 'communicationTools' ? communicationToolsContainerStyle : {}),
                    ...(selectedSection === 'userManagement' ? userManagementContainerStyle : {}),
                    ...(showContainer ? fadeInStyle : fadeOutStyle) 
                }}>
                    {renderSection()}
                </div>
            )}
            {!selectedSection && (
                <div style={{ ...mainOptionsStyle, ...(showSectionTitles ? fadeInStyle : fadeOutStyle) }}>
                    <div onClick={() => handleSectionClick('userManagement')} style={topOptionStyle}>User Management</div>
                    <div onClick={() => handleSectionClick('communicationTools')} style={rightOptionStyle}>Communication Tools</div>
                    <div onClick={() => handleSectionClick('systemOverview')} style={bottomOptionStyle}>System Overview</div>
                    <div onClick={() => handleSectionClick('dashboard')} style={leftOptionStyle}>Dashboard</div>
                </div>
            )}
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    position: 'relative',
};

const logoContainerStyle = {
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.5s ease, width 0.5s ease, height 0.5s ease',
    position: 'absolute',
    top: 'calc(50% + 32px)', // Adjusted to account for half the navbar height
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const logoPositionStyles = {
    dashboard: { transform: 'translate(-515%, -50%)', width: '150px', height: '150px' },
    systemOverview: { transform: 'translate(-50%, 175%)', width: '150px', height: '150px' },
    communicationTools: { transform: 'translate(410%, -50%)', width: '150px', height: '150px' },
    userManagement: { transform: 'translate(-50%, -275%)', width: '150px', height: '150px' },
};

const mainOptionsStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 64px)', // Adjusted to take into account the height of the navbar
    width: '100vw',
    textAlign: 'center',
    position: 'relative',
    transition: 'opacity 1s ease', // Smooth fade-in effect
};

const optionStyle = {
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    position: 'absolute',
    fontSize: 'x-large',
};

const topOptionStyle = {
    ...optionStyle,
    top: 'calc(10% + 32px)', // Adjusted to take into account the height of the navbar
    left: '50%',
    transform: 'translate(-50%, 0)',
};

const rightOptionStyle = {
    ...optionStyle,
    top: '50%',
    right: '3%',
    transform: 'translate(0, -50%)',
};

const bottomOptionStyle = {
    ...optionStyle,
    bottom: 'calc(5% + 32px)', // Adjusted to take into account the height of the navbar
    left: '50%',
    transform: 'translate(-50%, 0)',
};

const leftOptionStyle = {
    ...optionStyle,
    top: '50%',
    left: '12%',
    transform: 'translate(0, -50%)',
};

// Common styles for all section containers
const commonSectionContainerStyle = {
    width: '80%',
    height: '60%',
    margin: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    overflowY: 'auto',
    padding: '20px',
    position: 'absolute',
    opacity: 0,
    transition: 'opacity 0.5s ease',
};

// Specific styles for each section container
const dashboardContainerStyle = {
    top: '10%',
    left: '0%',
    width: '100%',
    height: '80%',
};

const systemOverviewContainerStyle = {
    top: '10%',
    width: '125%',
    height: '60%',
};

const communicationToolsContainerStyle = {
    top: '10%',
    right: '0%',
    width: '100%',
    height: '80%',
};

const userManagementContainerStyle = {
    top: '28%',
    width: '125%',
    height: '60%',
};

const fadeInStyle = {
    opacity: 1,
};

const fadeOutStyle = {
    opacity: 0,
};

const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
    clipPath: 'circle(50% at 50% 50%)',
    border: '5px solid white',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
};

const logoutButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ff0000',
    color: 'white',
    cursor: 'pointer',
};

export default AdminMain;
