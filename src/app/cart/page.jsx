"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, TextField, MenuItem, Select, InputAdornment, IconButton, Radio, Snackbar, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Header from '../components/Header';
import { getCart, updateCart, removeFromCart } from '../services/cart.service';
import { placeOrder } from '../services/order.service';
import { addCustomer, getCustomers } from '../services/customer.service';

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    mobileNumber: '',
    address: '',
    city: '',
    state: ''
  });

  // Fetch cart items and customer addresses on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCartItems(data || []);
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || error.message || 'Failed to fetch cart items',
          severity: 'error'
        });
      }
    };

    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomerAddresses(data || []);
        if (data.length > 0) {
          setSelectedAddress(data[0].customerId);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || error.message || 'Failed to fetch customer addresses',
          severity: 'error'
        });
      }
    };

    fetchCart();
    fetchCustomers();
  }, []);

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle quantity increment
  const handleIncrement = async (cartItemId, currentQuantity, bookId, availableQuantity) => {
    if (currentQuantity >= availableQuantity) {
      setSnackbar({ open: true, message: `Only ${availableQuantity} books available`, severity: 'error' });
      return;
    }
    const newQuantity = currentQuantity + 1;
    try {
      const updatedItem = await updateCart(cartItemId, { quantity: newQuantity });
      if (updatedItem) {
        setCartItems(cartItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQuantity, total: updatedItem.total } : item
        ));
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to update quantity',
        severity: 'error'
      });
    }
  };

  // Handle quantity decrement
  const handleDecrement = async (cartItemId, currentQuantity) => {
    if (currentQuantity <= 1) {
      setSnackbar({ open: true, message: 'Quantity cannot be less than 1', severity: 'error' });
      return;
    }
    const newQuantity = currentQuantity - 1;
    try {
      const updatedItem = await updateCart(cartItemId, { quantity: newQuantity });
      if (updatedItem) {
        setCartItems(cartItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQuantity, total: updatedItem.total } : item
        ));
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to update quantity',
        severity: 'error'
      });
    }
  };

  // Handle remove item from cart
  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to remove item from cart',
        severity: 'error'
      });
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    try {
      const response = await placeOrder();
      setCartItems([]); // Clear cart
      setSnackbar({
        open: true,
        message: `Order placed successfully! Order ID: ${response.orderId}`,
        severity: 'success'
      });
      // Redirect to /order after 1.5 seconds
      setTimeout(() => {
        router.push('/order');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to place order',
        severity: 'error'
      });
    }
  };

  // Handle customer details input change
  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  // Handle save customer details
  const handleSaveCustomer = async () => {
    try {
      const { fullName, mobileNumber, address, city, state } = customerDetails;
      if (!fullName || !mobileNumber || !address || !city || !state) {
        setSnackbar({
          open: true,
          message: 'All customer fields are required',
          severity: 'error'
        });
        return;
      }
      const customerData = {
        full_name: fullName,
        mobile_number: mobileNumber,
        address,
        city,
        state
      };
      const newCustomer = await addCustomer(customerData);
      setCustomerAddresses([...customerAddresses, newCustomer]);
      setSelectedAddress(newCustomer.id);
      setCustomerDetails({ fullName: '', mobileNumber: '', address: '', city: '', state: '' }); // Reset form
      setSnackbar({
        open: true,
        message: 'Customer details saved successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to save customer details',
        severity: 'error'
      });
    }
  };

  // Calculate grand total
  const grandTotal = cartItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      <Header />
      <Box sx={{ mt: 4, ml: 24.5, display: 'flex', justifyContent: 'start' }}>
        <Typography>
          <Typography variant="body1" component="span" sx={{ color: 'gray' }}>Home/</Typography>
          <Typography variant="body2" component="span" fontWeight="bold">My Cart</Typography>
        </Typography>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4, px: 4 }}>
        {/* MyCart Box */}
        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              MyCart ({cartItems.length})
            </Typography>
            <Select
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              displayEmpty
              sx={{ minWidth: 200, maxWidth: 400, height: 50 }}
              startAdornment={
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              }
            >
              {customerAddresses.length === 0 ? (
                <MenuItem value="" disabled>
                  No addresses available
                </MenuItem>
              ) : (
                customerAddresses.map(addr => (
                  <MenuItem key={addr.customerId} value={addr.customerId}>
                    {`${addr.address}, ${addr.city}, ${addr.state}`}
                  </MenuItem>
                ))
              )}
            </Select>
          </Box>
          {cartItems.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              Your cart is empty
            </Typography>
          ) : (
            cartItems.map((item, index) => (
              <Box key={item.cartItemId} sx={{ px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 3 }}>
                  <Box sx={{ width: 150, height: 200, border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
                    <img
                      src={item.bookImage}
                      alt={item.bookName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {item.bookName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
                      by {item.author}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        Rs. {item.discountPrice}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        Rs. {item.price}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0, alignItems: 'center', mt: 0 }}>
                      <Button
                        variant="outlined"
                        sx={{ minWidth: 20, borderRadius: '50%', border: 'solid 1px gray', p: 0, color: 'gray' }}
                        onClick={() => handleDecrement(item.cartItemId, item.quantity)}
                      >
                        <RemoveIcon />
                      </Button>
                      <Typography variant="body1" sx={{ minWidth: 40, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ minWidth: 20, borderRadius: '50%', border: 'solid 1px gray', p: 0, color: 'gray' }}
                        onClick={() => handleIncrement(item.cartItemId, item.quantity, item.bookId, item.availableQuantity)}
                      >
                        <AddIcon />
                      </Button>
                      <Button
                        sx={{ textTransform: 'none', color: '#8B0000', ml: 2 }}
                        onClick={() => handleRemove(item.cartItemId)}
                      >
                        Remove
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">Rs.{item.total}</Typography>
                      <Typography variant="h6" color="gray">(Total)</Typography>
                    </Box>
                  </Box>
                </Box>
                {index < cartItems.length - 1 && (
                  <Box sx={{ height: '1px', backgroundColor: '#ccc', my: 5 }} />
                )}
              </Box>
            ))
          )}
          {cartItems.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 5, mx: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Grand Total: Rs.{grandTotal}</Typography>
              </Box>
              <Button
                variant="contained"
                sx={{ bgcolor: '#1976d2' }}
                onClick={handlePlaceOrder}
                disabled={!selectedAddress}
              >
                Place Order
              </Button>
            </Box>
          )}
        </Box>
        {/* Customer Details Box */}
        <Box sx={{ mt: 4, mb: 5, border: '1px solid #ccc', borderRadius: 2, pt: 4, pb: 5, px: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 5 }}>
            Customer Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 10 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Full Name"
                name="fullName"
                value={customerDetails.fullName}
                onChange={handleCustomerInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={customerDetails.mobileNumber}
                onChange={handleCustomerInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Box>
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <Radio
                sx={{
                  color: "#8B0000",
                  "&.Mui-checked": { color: "#8B0000" },
                }}
              />
              <Typography variant="h6" fontWeight="bold" sx={{ mr: 4 }}>
                1. Working Address
              </Typography>
              <Radio
                sx={{
                  color: "#8B0000",
                  "&.Mui-checked": { color: "#8B0000" },
                }}
              />
              <Typography variant="h6" fontWeight="bold">
                2. Home Address
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Address"
                name="address"
                value={customerDetails.address}
                onChange={handleCustomerInputChange}
                fullWidth
                sx={{ mb: 7 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="City/Town"
                name="city"
                value={customerDetails.city}
                onChange={handleCustomerInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="State"
                name="state"
                value={customerDetails.state}
                onChange={handleCustomerInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 5, mr: 3 }}>
            <Button
              variant="contained"
              sx={{ bgcolor: '#1976d2' }}
              onClick={handleSaveCustomer}
            >
              Continue
            </Button>
          </Box>
        </Box>
        {/* Order Summary Box */}
        <Box sx={{ mt: 4, mb: 5, border: '1px solid #ccc', borderRadius: 2, pt: 4, pb: 5, px: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 5 }}>
            Order Summary
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default CartPage;