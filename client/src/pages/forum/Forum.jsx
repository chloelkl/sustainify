import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Masonry from "react-responsive-masonry";
import { Box, Input, IconButton, Button, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import http from '../../http';

function Forum() {
    const [forumList, setForumList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getForums = () => {
        http.get('/forum').then((res) => {
            setForumList(res.data);
        });
    };

    const searchForums = () => {
        http.get(`/forum?search=${search}`).then((res) => {
            setForumList(res.data);
        });
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchForums();
        }
    };

    const onClickSearch = () => {
        searchForums();
    };

    const onClickClear = () => {
        setSearch('');
        getForums();
    };

    useEffect(() => {
        getForums();
    }, []);

    const ForumItems = forumList.map((item) => (
        <Card key={item.id} sx={{ mb: 2, boxShadow: 3 }}>
            <Link to={`/user/${item.userId}/forum`} style={{ textDecoration: 'none' }}>
                <CardMedia
                    component="img"
                    image={item.image || 'https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
                    alt={item.title}
                    sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '4px 4px 0 0' }}
                />
                <CardContent sx={{ padding: 2 }}>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ wordWrap: 'break-word', mb: 1, fontWeight: 'bold' }}
                    >
                        {item.title}
                    </Typography>
                    <Typography
                        variant="body1"
                        component="div"
                        sx={{ wordWrap: 'break-word', mb: 2 }}
                    >
                        {item.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {item.User.username}
                    </Typography>
                </CardContent>
            </Link>
        </Card>

    ));

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                    
                </Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    mb: 2,
                    backgroundColor: 'white',
                        borderRadius: 2,
                        padding: 1,
                        boxShadow: 1,
                }}
            >
                <Typography variant="h5" sx={{ my: 2, fontWeight: 'bold' }}>
                    "Getting Inspired One Step at a Time."
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '40%',
                        
                    }}
                >
                    <Input
                        value={search}
                        placeholder="Search"
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown}
                        sx={{ flex: 1 }}
                    />
                    <IconButton color="primary" onClick={onClickSearch}>
                        <Search />
                    </IconButton>
                    <IconButton color="primary" onClick={onClickClear}>
                        <Clear />
                    </IconButton>
                </Box>
            </Box>


            <div className="Forum" style={{ padding: "20px" }}>
                <Masonry columnsCount={3} gutter="10px">
                    {ForumItems}
                </Masonry>
            </div>
        </Box>
    );
}

export default Forum;
