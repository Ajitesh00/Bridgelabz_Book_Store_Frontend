"use client";

import React, { useState } from 'react';
import { Button, Card, CardContent, TextField, Typography, Box, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import { loginUser,registerUser } from '../services/user.service';

// ICON IMPORTS
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthCard = ({ role }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleViewChange = (view) => {
    setIsLogin(view === 'login');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const validateFields = () => {
    if (!email.trim() || !password.trim()) {
        setSnackbar({
        open: true,
        message: 'Email and Password are required',
        severity: 'error',
        });
        return false;
    }

    if (!isLogin) {
        if (!fullName.trim()) {
        setSnackbar({
            open: true,
            message: 'Full Name is required',
            severity: 'error',
        });
        return false;
        }

        if (!mobile.trim()) {
        setSnackbar({
            open: true,
            message: 'Mobile Number is required',
            severity: 'error',
        });
        return false;
        }
    }

    return true;
    };

    const handleSubmit = async () => {
    if (!validateFields()) return;
    try {
        if (isLogin) {
        const res = await loginUser(role, { email, password });
        const isSuccess = res.data.code >= 200 && res.data.code < 300;
        
        setSnackbar({
            open: true,
            message: res.data.message || 'Login successful',
            severity: isSuccess ? 'success' : 'error',
        });
        if (isSuccess) {
            const token = res?.data?.data?.token; 
            localStorage.setItem('token', token);

            // Redirect to /dashboard after a short delay so the snackbar is visible
            setTimeout(() => {
            window.location.href = '/dashboard';
            }, 1000); // 1 second delay
        }
        } else {
        const res = await registerUser(role, {
            firstName: fullName.split(" ")[0],
            lastName: fullName.split(" ")[1] || "",
            email,
            password,
        });

        const isSuccess = res.data.code >= 200 && res.data.code < 300;
        
        setSnackbar({
            open: true,
            message: res.data.message || 'Signup successful',
            severity: isSuccess ? 'success' : 'error',
        });
        }

    } catch (err) {
        setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Something went wrong!',
        severity: 'error',
        });
    }
  };

  return (
    <div
    style={{ 
        display:'flex',
        alignItems: 'center'
        
    }}
    >
        <Card
            sx={{
                height: 440,
                width: 350,
                padding: 2,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
            <Box sx={{ mb: 5, mt:'36px' }}>
                <img
                src='/1.png'
                alt="Online Book Shopping"
                style={{ width: '280px', height: '270px' }}
                />
            </Box>
            <strong
                style={{
                    fontFamily: 'Arial, sans-serif', fontSize: '20px'
                }}
            >
                ONLINE BOOK SHOPPING
            </strong>
        </Card>
        <Card
        sx={{
            width: 400,
            height: 500,
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
        }}
        >
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 4 }}>
            <Typography
                variant="h6"
                component="span"
                onClick={() => handleViewChange('login')}
                sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    // ::after is used to render a short, rounded underline below the text.
                    '&::after': {
                    content: '""',
                    display: 'block',
                    margin: 'auto',
                    marginTop: '4px',
                    width: '30px', // control underline width
                    height: '6px',
                    borderRadius: '6px',
                    backgroundColor: isLogin ? '#8B0000' : 'transparent',
                    transition: 'all 0.3s ease',
                    },
                }}
            >
            LOGIN
            </Typography>

            <Typography
                variant="h6"
                component="span"
                onClick={() => handleViewChange('signup')}
                sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    // ::after is used to render a short, rounded underline below the text.
                    '&::after': {
                    content: '""',
                    display: 'block',
                    margin: 'auto',
                    marginTop: '4px',
                    width: '30px',
                    height: '6px',
                    borderRadius: '6px',
                    backgroundColor: !isLogin ? '#8B0000' : 'transparent',
                    transition: 'all 0.3s ease',
                    },
                }}
            >
            SIGNUP
            </Typography>
            </Box>
            <Box sx={{ mt: -1.5 }}>
            {!isLogin && (
                <TextField
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                variant="outlined"
                margin="normal"
                />
            )}
            <TextField
                fullWidth
                label="Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
            />
            <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key==='Enter' && handleSubmit()}
                variant="outlined"
                margin="normal"
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                        onClick={() => setShowPassword(prev => !prev)}
                        edge="end"
                        aria-label="toggle password visibility"
                    >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    )
                }}
            />
            {!isLogin && (
                <TextField
                fullWidth
                label="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                variant="outlined"
                margin="normal"
                />
            )}
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ height: '45px', mt: 2, backgroundColor: '#8B0000', '&:hover': { backgroundColor: '#700000' } }}
            >
                {isLogin ? 'Login' : 'Signup'}
            </Button>

            {isLogin && (
            <>
                {/* OR separator */}
                <Box sx={{ display: 'flex', alignItems: 'center', my: 5 }}>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: '#ccc' }} />
                <Typography sx={{ mx: 2, color: '#888' }}>OR</Typography>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: '#ccc' }} />
                </Box>

                {/* Social Buttons Side by Side */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                {/* Facebook Button */}
                <Button
                    sx={{
                    flex: 1,
                    height: '45px',
                    backgroundColor: '#3b5998',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: '#2d4373'
                    }
                    }}
                >
                    Facebook
                </Button>

                {/* Google Button */}
                <Button
                    sx={{
                    flex: 1,
                    height: '45px',
                    border: '1px solid #ccc',
                    color: '#555',
                    textTransform: 'none',
                    backgroundColor: '#fff',
                    '&:hover': {
                        backgroundColor: '#f5f5f5'
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                    }}
                >
                    <img
                    src="/Google.png"
                    alt="Google"
                    style={{ width: '18px', height: '18px' }}
                    />
                    Google
                </Button>
                </Box>
            </>
            )}
            </Box>
        </CardContent>
        </Card>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
            <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    </div>
  );
};

export default AuthCard;