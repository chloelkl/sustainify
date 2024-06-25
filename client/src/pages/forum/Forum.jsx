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
            <Card key={item.id} style={{ marginBottom: "20px" }}>
                <Link to={`/user/${item.userId}/forum`}>
                <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.title}
                    style={{ width: "100%", objectFit: "cover" }}
                />
                <CardContent>
                    <Typography variant="h4" component="div" style={{ wordWrap: "break-word" }}>
                        {item.title}
                    </Typography>
                    <Typography variant="body1" component="div" style={{ wordWrap: "break-word" }}>
                        {item.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Created by: {item.User.username}
                    </Typography>
                </CardContent>
                </Link>
            </Card>
        
    ));

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Forum
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/addforum" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add
                    </Button>
                </Link>
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
