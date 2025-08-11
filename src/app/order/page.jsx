"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import Header from '../components/Header';
import { getOrders } from '../services/order.service';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || error.message || 'Failed to fetch orders',
          severity: 'error'
        });
      }
    };
    fetchOrders();
  }, []);

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Group orders by orderId
  const groupedOrders = orders.reduce((acc, order) => {
    const { orderId, createdAt } = order;
    if (!acc[orderId]) {
      acc[orderId] = { orderId, createdAt, items: [] };
    }
    acc[orderId].items.push(order);
    return acc;
  }, {});

  // Convert grouped orders to array and sort by createdAt (latest first)
  const orderGroups = Object.values(groupedOrders).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <Header />
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
        {/* Confirmation Image */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <img
            src="/order-confirmed.png"
            alt="Order Confirmed"
            style={{ width: '350px', height: '300px' }}
          />
        </Box>
        {/* Orders List */}
        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Your Orders
          </Typography>
          {orderGroups.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              No orders found
            </Typography>
          ) : (
            orderGroups.map((group, groupIndex) => (
              <Box key={group.orderId} sx={{ px: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Order ID: {group.orderId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placed on: {new Date(group.createdAt).toLocaleString()}
                </Typography>
                <Box sx={{ mt: 3, mb: 3, ml:5, mr: '50%' }}>
                  {group.items.map((item, itemIndex) => (
                    <Box key={item.orderItemId}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">Book: {item.bookName}</Typography>
                        <Typography variant="body1">Author: {item.author}</Typography>
                        <Typography variant="body1">Quantity: {item.quantity}</Typography>
                        <Typography variant="body1">Price: Rs. {item.discountPrice}</Typography>
                        <Typography variant="body1">Total: Rs. {item.total}</Typography>
                      </Box>
                      {itemIndex < group.items.length - 1 && (
                        <Box sx={{ height: '1px', backgroundColor: '#ccc', my: 2 }} />
                      )}
                    </Box>
                  ))}
                </Box>
                {groupIndex < orderGroups.length - 1 && (
                  <Box sx={{ height: '1px', backgroundColor: '#ccc', my: 3 }} />
                )}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </>
  );
};

export default OrderPage;