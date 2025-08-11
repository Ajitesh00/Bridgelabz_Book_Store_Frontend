"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import Header from '../components/Header';
import { getWishlist, removeFromWishlist, clearWishlist } from '../services/wishlist.service';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  // Fetch wishlist items on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist();
        setWishlistItems(data || []);
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || error.message || 'Failed to fetch wishlist items',
          severity: 'error'
        });
      }
    };

    fetchWishlist();
  }, []);

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle remove item from wishlist
  const handleRemove = async (wishlistItemId) => {
    try {
      await removeFromWishlist(wishlistItemId);
      setWishlistItems(wishlistItems.filter(item => item.wishlistItemId !== wishlistItemId));
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to remove item from wishlist',
        severity: 'error'
      });
    }
  };

  // Handle clear wishlist
  const handleClear = async () => {
    try {
      await clearWishlist();
      setWishlistItems([]);
      setSnackbar({
        open: true,
        message: 'Wishlist cleared successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to clear wishlist',
        severity: 'error'
      });
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ mt: 4, ml: 24.5, display: 'flex', justifyContent: 'start' }}>
          <Typography>
            <Typography variant="body1" component="span" sx={{ color: 'gray' }}>Home/</Typography>
            <Typography variant="body2" component="span" fontWeight="bold">My Wishlist</Typography>
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
        {/* MyWishlist Box */}
        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              MyWishlist ({wishlistItems.length})
            </Typography>
          </Box>
          {wishlistItems.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              Your wishlist is empty
            </Typography>
          ) : (
            wishlistItems.map((item, index) => (
              <Box key={item.wishlistItemId} sx={{ px: 3 }}>
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
                    <Button
                      sx={{ textTransform: 'none', color: '#8B0000', mt: 2, alignSelf: 'flex-start' }}
                      onClick={() => handleRemove(item.wishlistItemId)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
                {index < wishlistItems.length - 1 && (
                  <Box sx={{ height: '1px', backgroundColor: '#ccc', my: 5 }} />
                )}
              </Box>
            ))
          )}
          {wishlistItems.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 5, mx: 3 }}>
              <Button
                variant="contained"
                sx={{ bgcolor: '#8B0000' }}
                onClick={handleClear}
              >
                Clear Wishlist
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default WishlistPage;