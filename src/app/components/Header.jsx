"use client";

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, IconButton, Tooltip, TextField, InputAdornment } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Search from '@mui/icons-material/Search';
import { useRouter, useSearchParams } from 'next/navigation';
// Import the external CSS file
import './Header.css';

/**
 * Header component for navigation and search
 * @returns {JSX.Element} The rendered Header component
 */
export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Syncs searchQuery state with URL search parameter on initial load
   * @returns {void}
   */
  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchQuery(search);
  }, [searchParams]);

  /**
   * Handles search action and updates URL with search query
   * @returns {void}
   */
  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set('search', trimmed);
      params.set('page', '1'); // Reset to page 1 on new search
    } else {
      params.delete('search'); // Clear search param if empty
      params.set('page', '1');
    }

    router.push(`/dashboard?${params.toString()}`);
  };

  /**
   * Navigates to the cart page
   * @returns {void}
   */
  const handleCartClick = () => {
    router.push('/cart');
  };

  /**
   * Navigates to the wishlist page
   * @returns {void}
   */
  const handleWishlistClick = () => {
    router.push('/wishlist');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#8B0000', padding: '0 16px' }} className="header-appbar">
      <Toolbar sx={{ justifyContent: 'start', mx: 22 }} className="header-toolbar">
        {/* Left: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} className="header-logo">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: 40, cursor: 'pointer' }}
            onClick={() => router.push('/dashboard')}
          />
        </Box>

        {/* Center: Search Bar */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }} className="header-search">
          <TextField
            placeholder="Search books..."
            size="small"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            sx={{
              backgroundColor: '#fff',
              borderRadius: 1,
              width: '70%',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton edge="start" aria-label="search books" onClick={handleSearch}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="header-search-input"
          />
        </Box>

        {/* Right: Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} className="header-icons">
          <Tooltip title="Profile">
            <IconButton color="inherit" className="header-profile-icon">
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cart">
            <IconButton color="inherit" onClick={handleCartClick} className="header-cart-icon">
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Wishlist">
            <IconButton color="inherit" onClick={handleWishlistClick} className="header-wishlist-icon">
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}