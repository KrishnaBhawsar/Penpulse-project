'use client'
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import Navbar from '@/Components/Navbar';
import { Container, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const Page = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');

    const [images, setImages] = useState([]);
    const [input, setInput] = useState({
        query: "",
        body: "",
    });
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const handleImageChange = (e) => {
        // Logic to handle image upload
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const PublishBlog = () => {
        const token = localStorage.getItem('token');

        axios.post("http://localhost:8080/home/write-blog", input, {
            params: {
                email: localStorage.getItem("email")
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            window.alert("post saved");
        }).catch((error)=>{
            setAlertMessage(`User is not authenticated to access this page`);
            setAlertSeverity('error');
            setOpenSnackbar(true);
        })
        console.log(input.query);
        console.log(input.body);
    }
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
      };
    
    return (
        <>
            {/* <Navbar /> */}
            <Container>
                <form className='p-5 m-5'>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="query"
                                name='query'
                                variant="outlined"
                                onChange={onInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name='body'
                                label="body"
                                variant="outlined"
                                onChange={onInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/* <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                multiple
                            /> */}
                            <Button
                                onChange={handleImageChange}
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload file
                                <VisuallyHiddenInput type="file" />
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                onClick={PublishBlog}
                                variant="contained"
                                style={{
                                    backgroundColor: 'green',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                        color: 'green'
                                    }
                                }}
                            >
                                Publish Blog
                            </Button>

                        </Grid>
                    </Grid>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Change anchorOrigin (change snakbar position)
                    >
                        <MuiAlert
                            elevation={6}
                            variant="filled"
                            onClose={handleSnackbarClose}
                            severity={alertSeverity}
                        >
                            {alertMessage}
                        </MuiAlert>
                    </Snackbar>
                </form>
            </Container>
        </>
    );
};

export default Page;