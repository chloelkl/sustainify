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
                style={{ ...logoStyle, ...(selectedSection ? logoPositionStyles[selectedSection] : {}) }}
                onClick={() => setSelectedSection(null)}
            >
                <img src="/src/assets/AdminLogo_XBG.png" alt="Admin Logo" style={imageStyle} />
            </div>
            {selectedSection ? (
                <div style={sectionContainerStyle}>{renderSection()}</div>
            ) : (
                <div style={mainOptionsStyle}>
                    <div onClick={() => handleSectionClick('dashboard')} style={optionStyle}>Dashboard</div>
                    <div onClick={() => handleSectionClick('systemOverview')} style={optionStyle}>System Overview</div>
                    <div onClick={() => handleSectionClick('communicationTools')} style={optionStyle}>Communication Tools</div>
                    <div onClick={() => handleSectionClick('userManagement')} style={optionStyle}>User Management</div>
                </div>
            )}
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    position: 'relative',
};

const logoStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.5s ease',
};

const logoPositionStyles = {
    dashboard: { transform: 'translate(-50%, -50%)', top: '10%', left: '10%' },
    systemOverview: { transform: 'translate(-50%, 0)', bottom: '10%', left: '50%' },
    communicationTools: { transform: 'translate(0, -50%)', top: '50%', right: '10%' },
    userManagement: { transform: 'translate(-50%, -50%)', top: '10%', left: '50%' },
};

const mainOptionsStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
};

const optionStyle = {
    flex: 1,
    margin: '20px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#e0e0e0',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const sectionContainerStyle = {
    width: '80%',
    marginTop: '20px',
};

const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
};

export default AdminMain;
