"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from "next/navigation";

const defaultTheme = createTheme();

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const Interest = [
  { interest: 'HEALTH' },
  { interest: 'TECHNOLOGY' },
  { interest: 'CRICKET' },
  { interest: 'FOOTBALL' },
  { interest: 'STUDY' },
  { interest: 'PSYCHOLOGY' },
];

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
  };
  const route=useRouter();
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography component="h1" variant="h5">
            {isSignUp ? "Sign up" : "Login"}
          </Typography>
          {isSignUp ? <SignUpForm toggleForm={handleToggleForm} /> : <LoginForm toggleForm={handleToggleForm} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

function handleLogin(email, password) {
  axios.post("http://localhost:8080/auth/login", { email, password })
    .then(response => {
      console.log(response);
      if (response.data.email != null) {
        localStorage.setItem("email", response.data.email);
        localStorage.setItem('token', response.data.token);
        window.alert("User logged in");
        // route.push("/");
      }
      else
        window.alert("Usename password invalid");
    })
}

function LoginForm({ toggleForm }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const onSubmit = (data) => {
    handleLogin(data.email, data.password);
  };

  return (
    <div className="mt-12 max-w-md mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-base xs:text-lg sm:text-xl font-medium leading-relaxed font-in"
      >
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            {...register("email", { required: "Email is required" })}
            className="w-full outline-none border p-2 mt-2 focus:ring-2 focus:ring-indigo-500 placeholder:text-center placeholder:text-lg border-gray-300 focus:border-indigo-500 bg-white rounded"
            onChange={onInputChange}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="********"
            {...register("password", { required: "Password is required" })}
            className="w-full outline-none border p-2 mt-2 focus:ring-2 focus:ring-indigo-500 placeholder:text-center placeholder:text-lg border-gray-300 focus:border-indigo-500 bg-white rounded"
            onChange={onInputChange}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <input
          type="submit"
          value="Login"
          className="w-full mt-4 font-medium text-lg py-2 sm:py-3 px-6 sm:px-8 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700 transition duration-300"
        />
      </form>
      <div className="text-center mt-4">
        <p className="text-gray-700">Don't have an account? <a onClick={toggleForm} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Sign up here</a></p>
      </div>
    </div>
  );
}

function SignUpForm({ toggleForm }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [input, setInput] = useState({
    name: '',
    email: '',
    password: '',
    cnfrmpass: '',
    interests: []
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');

  const checkUserExist = () => {
    axios
      .post('http://localhost:8080/home/signup', {
        name: input.name,
        email: input.email,
        password: input.password,
        interests: input.interests
      })
      .then((response) => {
        console.log(response);
        if (response.data.message === 'user already exist') {
          setAlertMessage(`User with email ${input.email} already exists.`);
          setAlertSeverity('error');
          setOpenSnackbar(true);
        } else if (response.data.message === 'invalid email address') {
          setAlertMessage(`${input.email} invalid email`);
          setAlertSeverity('error');
          setOpenSnackbar(true);
        } else {
          window.alert("Signup successful");
        }
      })
      .catch((error) => {
        console.error('Error signing up:', error);
        setAlertMessage('Failed to sign up. Please try again later.');
        setAlertSeverity('error');
        setOpenSnackbar(true);
      });
  };

  const handleSignUp = (data) => {
    if (data.password !== data.cnfrmpass) {
      setAlertMessage('Password and Confirm Password do not match.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
    } else {
      if (data.name && data.email && data.password && data.cnfrmpass) {
        checkUserExist();
      } else {
        setAlertMessage('Please fill in all the required fields before proceeding.');
        setAlertSeverity('error');
        setOpenSnackbar(true);
      }
    }
  };

  const handleInterestChange = (values) => {
    setInput((prevState) => ({
      ...prevState,
      interests: values.map((value) => value.interest)
    }));
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit(handleSignUp)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            {...register("name", { required: "Name is required" })}
            autoComplete="given-name"
            name="name"
            required
            fullWidth
            id="name"
            label="Name"
            autoFocus
            onChange={(e) => setInput({ ...input, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register("email", { required: "Email is required" })}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => setInput({ ...input, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register("password", { required: "Password is required" })}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            onChange={(e) => setInput({ ...input, password: e.target.value })}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register("cnfrmpass", { required: "Confirm Password is required" })}
            required
            fullWidth
            name="cnfrmpass"
            label="Confirm Password"
            type="password"
            id="cnfrmpass"
            autoComplete="new-password"
            onChange={(e) => setInput({ ...input, cnfrmpass: e.target.value })}
          />
          {errors.cnfrmpass && <p className="text-red-500 text-sm mt-1">{errors.cnfrmpass.message}</p>}
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={Interest}
            disableCloseOnSelect
            getOptionLabel={(option) => option.interest}
            onChange={(event, values) => handleInterestChange(values)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.interest}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} label="Interest" />
            )}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        className="mt-3 mb-2 bg-blue-500 text-white border-none hover:font-bold hover:bg-white hover:text-blue-500 hover:border-black hover:border-2"
      >
        Sign Up
      </Button>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link onClick={toggleForm} variant="body2">
            Already have an account? Login
          </Link>
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
    </Box>
  );
}
