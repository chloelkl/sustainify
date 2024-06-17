import React, { useEffect, useState } from 'react';
import Masonry from "react-responsive-masonry";
import { Box, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import http from '../../http';
import { AccessTime } from '@mui/icons-material'

const forumList = [
    { id: 1, title: 'Beautiful Landscape', image: 'https://unsplash.com/photos/an-artists-rendering-of-the-planets-in-the-solar-system-rxKfduhgBqg' },
    { id: 2, title: 'City Lights', image: 'https://source.unsplash.com/random/2' },
    { id: 3, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' },
    { id: 4, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' },
    { id: 5, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' },
    { id: 6, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' },
    { id: 7, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' },
    { id: 8, title: 'Mountain Range', image: 'https://source.unsplash.com/random/3' }

    // Add more sample data as needed
];

function Forum() {
    // const [forumList, setForumList] = useState([]);

    useEffect(() => {
        http.get('/forum').then((res) => {
            console.log(res.data);
            // setForumList(res.data);
        });
    }, []); // Fucntion trigger when page loaded

    const Forumitems = forumList.map((item, index) => (
        <Card key={item.id} style={{ marginBottom: "20px" }}>
            <CardMedia
                component="img"
                image={item.image}
                alt={item.title}
                style={{ width: "100%", objectFit: "cover" }}
            />
            <CardContent>
                <Typography variant="h6" component="div" style={{ wordWrap: "break-word" }}>
                    {item.title}
                </Typography>
            </CardContent>
        </Card>
    ));

    return (
        <div className="Forum" style={{ padding: "20px" }}>
            <Masonry columnsCount={3} gutter="10px">
                {Forumitems}
            </Masonry>
        </div>
        // <Box>
        //     <Typography variant="h5" sx={{ my: 2 }}>
        //         Forum
        //     </Typography>
        //     <Grid container spacing={2}>
        //         {
        //             forumList.map((forum, i) => {
        //                 return (
        //                     <div style={{ padding: '20px' }}>
        //                         <Masonry columsCount={3} gutter="10px">
        //                             {
        //                                 <Card key={forum.id} style={{ marginBottom: '20px' }}>
        //                                     <CardMedia
        //                                         component="img"
        //                                         image={forum.image}
        //                                         alt={forum.title}
        //                                         style={{ width: '100%', objectFit: 'cover' }}
        //                                     />
        //                                     <CardContent>
        //                                         <Typography variant="h6" component="div" style={{ wordWrap: 'break-word' }}>
        //                                             {forum.title}
        //                                         </Typography>
        //                                     </CardContent>
        //                                 </Card>
        //                             }
        //                         </Masonry>
        //                     </div>
        //                 );
        //             })
        //         }
        //     </Grid>
        // </Box>

    );
}

export default Forum