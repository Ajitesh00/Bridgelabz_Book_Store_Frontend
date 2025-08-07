"use client";

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, IconButton, Tooltip, TextField, InputAdornment } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Search from '@mui/icons-material/Search';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync searchQuery with URL on initial load
  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchQuery(search);
  }, [searchParams]);

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

  return (
    <AppBar position="static" sx={{ backgroundColor: '#8B0000', padding: '0 16px' }}>
      <Toolbar sx={{ justifyContent: 'start', mx: 22 }}>
        {/* Left: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: 40, cursor: 'pointer' }}
            onClick={() => router.push('/dashboard')}
          />
        </Box>

        {/* Center: Search Bar */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
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
          />
        </Box>

        {/* Right: Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Profile">
                <IconButton color="inherit">
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cart">
                <IconButton color="inherit">
                  <ShoppingCartIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Wishlist">
                <IconButton color="inherit">
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}