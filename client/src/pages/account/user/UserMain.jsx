import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext';
import UserProfile from './UserProfile';
import UserSettings from './UserSettings';
import UserAnalytics from './UserAnalytics';
import ChatWithFriends from './ChatWithFriends';

const UserMain = () => {
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
        setShowSectionTitles(false);
        setTimeout(() => {
            setIsMorphed(true);
        }, 250);
    };

    const handleBackClick = () => {
        setSelectedSection(null);
        setTimeout(() => {
            setShowSectionTitles(true);
        }, 250);
    };

    useEffect(() => {
        if (isMorphed) {
            setTimeout(() => {
                setShowContainer(true);
            }, 250);
        }
    }, [isMorphed]);

    const handleLogout = () => {
        logout();
    };

    const renderSection = () => {
        switch (selectedSection) {
            case 'editProfile':
                return <UserProfile />;
            case 'settings':
                return <UserSettings />;
            case 'analytics':
                return <UserAnalytics />;
            case 'chatWithFriends':
                return <ChatWithFriends />;
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
                <img src="/src/assets/UserLogo_XBG.png" alt="User Logo" style={imageStyle} />
            </div>
            {selectedSection && (
                <div style={{
                    ...commonSectionContainerStyle,
                    ...(selectedSection === 'editProfile' ? profileContainerStyle : {}),
                    ...(selectedSection === 'settings' ? settingsContainerStyle : {}),
                    ...(selectedSection === 'analytics' ? analyticsContainerStyle : {}),
                    ...(selectedSection === 'chatWithFriends' ? chatContainerStyle : {}),
                    ...(showContainer ? fadeInStyle : fadeOutStyle)
                }}>
                    {renderSection()}
                </div>
            )}
            {!selectedSection && (
                <div style={{ ...mainOptionsStyle, ...(showSectionTitles ? fadeInStyle : fadeOutStyle) }}>
                    <div onClick={() => handleSectionClick('editProfile')} style={topOptionStyle}>Edit Profile</div>
                    <div onClick={() => handleSectionClick('settings')} style={rightOptionStyle}>Settings</div>
                    <div onClick={() => handleSectionClick('analytics')} style={bottomOptionStyle}>Analytics</div>
                    <div onClick={() => handleSectionClick('chatWithFriends')} style={leftOptionStyle}>Chat with Friends</div>
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
    top: 'calc(50% + 32px)',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const logoPositionStyles = {
    editProfile: { transform: 'translate(-50%, -275%)', width: '150px', height: '150px' },
    settings: { transform: 'translate(410%, -50%)', width: '150px', height: '150px' },
    analytics: { transform: 'translate(-50%, 175%)', width: '150px', height: '150px' },
    chatWithFriends: { transform: 'translate(-515%, -50%)', width: '150px', height: '150px' },
};

const mainOptionsStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 64px)',
    width: '100vw',
    textAlign: 'center',
    position: 'relative',
    transition: 'opacity 1s ease',
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
    top: 'calc(10% + 32px)',
    left: '50%',
    transform: 'translate(-50%, 0)',
};

const rightOptionStyle = {
    ...optionStyle,
    top: '50%',
    right: '15%',
    transform: 'translate(0, -50%)',
};

const bottomOptionStyle = {
    ...optionStyle,
    bottom: 'calc(5% + 32px)',
    left: '50%',
    transform: 'translate(-50%, 0)',
};

const leftOptionStyle = {
    ...optionStyle,
    top: '50%',
    left: '5%',
    transform: 'translate(0, -50%)',
};

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

const profileContainerStyle = {
    top: '28%',
    width: '125%',
    height: '60%',
};

const settingsContainerStyle = {
    top: '10%',
    right: '0%',
    width: '100%',
    height: '80%',
};

const analyticsContainerStyle = {
    top: '10%',
    width: '125%',
    height: '60%',
};

const chatContainerStyle = {
    top: '10%',
    left: '0%',
    width: '100%',
    height: '80%',
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

export default UserMain;
