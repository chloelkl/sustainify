import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Masonry from "react-responsive-masonry";
import { Box, Grid, Card, CardMedia, CardContent, Typography, Input, IconButton, Button } from '@mui/material';
import http from '../../http';
import { AccessTime, Search, Clear } from '@mui/icons-material';

// const ForumList = [
//     { id: 1, title: 'Beautiful Landscape', image: 'https://unsplash.com/photos/an-artists-rendering-of-the-planets-in-the-solar-system-rxKfduhgBqg' },
//     { id: 2, title: 'City Lights', image: 'https://source.unsplash.com/random/2' },
//     { id: 3, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' },
//     { id: 4, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' },
//     { id: 5, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' },
//     { id: 6, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' },
//     { id: 7, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' },
//     { id: 8, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' }

//     // Add more sample data as needed
// ];

function Forum() {
    const [ForumList, setForumList] = useState([]);
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
    useEffect(() => {
        getForums();
    }, []);
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchForums();
        }
    };
    const onClickSearch = () => {
        searchForums();
    }
    const onClickClear = () => {
        setSearch('');
        getForums();
    };

    useEffect(() => {
        http.get('/forum').then((res) => {
            console.log(res.data);
            setForumList(res.data);
        });
    }, []); // Fucntion trigger when page loaded

    const Forumitems = ForumList.map((item, index) => (
        <Card key={item.id} style={{ marginBottom: "20px" }}>
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
                <Typography variant="h4" component="div" style={{ wordWrap: "break-word" }}>
                    {item.name}
                </Typography>
            </CardContent>
        </Card>
    ));

    return (

        <><Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Forum
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/addforum" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add
                    </Button>
                </Link>
            </Box>
        </Box>
            <><div className="Forum" style={{ padding: "20px" }}>
                <Masonry columnsCount={3} gutter="10px">
                    {Forumitems}
                </Masonry>
            </div></></>

    );
}

export default Forum