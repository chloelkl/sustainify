import React, { useState } from 'react';
import Dashboard from './Dashboard';
import SystemOverview from './SystemOverview';
import CommunicationTools from './CommunicationTools';
import UserManagement from './UserManagement';

const AdminMain = () => {
    const [selectedSection, setSelectedSection] = useState(null);

    const handleSectionClick = (section) => {
        setSelectedSection(section);
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
                onClick={() => setSelectedSection(null)}
            >
                <img src="/src/assets/AdminLogo_XBG.png" alt="Admin Logo" style={imageStyle} />
            </div>
            {selectedSection ? (
                <div style={sectionContainerStyle}>{renderSection()}</div>
            ) : (
                <div style={mainOptionsStyle}>
                    <div onClick={() => handleSectionClick('userManagement')} style={topOptionStyle}>User Management</div>
                    <div onClick={() => handleSectionClick('communicationTools')} style={rightOptionStyle}>Communication Tools</div>
                    <div onClick={() => handleSectionClick('systemOverview')} style={bottomOptionStyle}>System Overview</div>
                    <div onClick={() => handleSectionClick('dashboard')} style={leftOptionStyle}>Dashboard</div>
                </div>
            )}
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
    backgroundColor: '#f0f8ff',
};

const logoContainerStyle = {
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.5s ease',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const logoPositionStyles = {
    dashboard: { transform: 'translate(-500%, -50%)', width: '100px', height: '100px' },
    systemOverview: { transform: 'translate(-50%, 500%)', width: '100px', height: '100px' },
    communicationTools: { transform: 'translate(400%, -50%)', width: '100px', height: '100px' },
    userManagement: { transform: 'translate(-50%, -500%)', width: '100px', height: '100px' },
};

const mainOptionsStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    position: 'relative',
};

const optionStyle = {
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#e0e0e0',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    position: 'absolute',
};

const topOptionStyle = {
    ...optionStyle,
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, 0)',
};

const rightOptionStyle = {
    ...optionStyle,
    top: '50%',
    right: '10%',
    transform: 'translate(0, -50%)',
};

const bottomOptionStyle = {
    ...optionStyle,
    bottom: '10%',
    left: '50%',
    transform: 'translate(-50%, 0)',
};

const leftOptionStyle = {
    ...optionStyle,
    top: '50%',
    left: '10%',
    transform: 'translate(0, -50%)',
};

const sectionContainerStyle = {
    width: '60%',
    height: '60%',
    margin: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    overflowY: 'auto',
    padding: '20px',
    position: 'absolute',
    top: '10%',
};

const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
};

export default AdminMain;
