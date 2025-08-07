"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';

const BookCard = ({ book }) => {
  const router = useRouter();

  // Handle click on card to navigate to book details page
  const handleCardClick = () => {
    router.push(`/book/${book.id}`);
  };

  return (
    <Card 
    sx={{ 
      width: 250, 
      position: 'relative', 
      boxShadow: 3, backgroundColor: '#f5f5f5', 
      borderRadius: 2, cursor: 'pointer' 
      }}
      onClick={handleCardClick}
    >
      <CardMedia sx={{
        width: '55%',
        height: '200px',
        marginTop: '25px',
        marginX: 'auto',
        border: '2px solid ',
        borderRadius: 1,
        }}
        component="img"
        height="280"
        image={book.bookImage}
        alt={book.bookName}
      />
      {book.quantity === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: '#000000aa',
            color: 'white',
            px: 1,
            py: 0.5,
            fontSize: 12,
            borderRadius: 1
          }}
        >
          OUT OF STOCK
        </Box>
      )}
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {book.bookName}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          noWrap
        >
          by {book.author}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
          <Chip label="4.5★" size="small" sx={{ bgcolor: 'green', color: 'white', borderRadius: 1 }} />
          <Typography variant="body2" color="text.secondary">({book.quantity})</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
          <Typography fontWeight="bold" color="text.primary">
            Rs. {book.discountPrice}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
            Rs. {book.price}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookCard;