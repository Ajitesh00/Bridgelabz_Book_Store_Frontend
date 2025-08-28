"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, Typography, TextareaAutosize } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'next/navigation';
import { fetchBookById } from '../../services/book.service';
import { addToCart, getCart } from '../../services/cart.service';
import { addToWishlist, getWishlist } from '../../services/wishlist.service';
import Header from '../../components/Header';
// Import the external CSS file
import './page.css';

// BookPage component to display details of a single book
const BookPage = () => {
  // State to hold book data
  const [book, setBook] = useState(null);
  // State to track button click states
  const [isAddedToBag, setIsAddedToBag] = useState(false);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  // Get book ID from URL parameters
  const params = useParams();
  const bookId = params.id;

  // Fetch book data and check cart/wishlist on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch book data
      const bookData = await fetchBookById(bookId);
      setBook(bookData);

      // Check if book is already in cart
      const cartItems = await getCart();
      const isInCart = cartItems.some(item => item.bookId === bookId);
      setIsAddedToBag(isInCart);

      // Check if book is already in wishlist
      const wishlistItems = await getWishlist();
      const isInWishlist = wishlistItems.some(item => item.bookId === bookId);
      setIsAddedToWishlist(isInWishlist);
    };
    fetchData();
  }, [bookId]);

  // Handle Add to Bag button click
  const handleAddToBag = async () => {
    if (isAddedToBag) return; // Prevent adding if already in cart
    try {
      await addToCart(bookId);
      setIsAddedToBag(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Handle Add to Wishlist button click
  const handleAddToWishlist = async () => {
    if (isAddedToWishlist) return; // Prevent adding if already in wishlist
    try {
      await addToWishlist(bookId);
      setIsAddedToWishlist(true);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  // Display loading state if book data is not yet fetched
  if (!book) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} className="book-page-loading">
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ mt: 3.5, ml: 33.5, display: 'flex', justifyContent: 'start' }} className="book-page-breadcrumb">
        <Typography>
          <Typography variant="body1" component="span" sx={{ color: 'gray' }} className="book-page-breadcrumb-home">Home/</Typography>
          <Typography variant="body2" component="span" fontWeight="bold" className="book-page-breadcrumb-book">{book.bookName}</Typography>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 4, p: 4, maxWidth: '1200px', mx: 'auto', mt: -1 }} className="book-page-main">
        {/* Left Section: Book Image and Buttons */}
        <Box sx={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} className="book-page-image-section">
          {/* Book Image with Out of Stock overlay */}
          <Box sx={{ border: '2px solid #ccc', borderRadius: 2, overflow: 'hidden', width: '310px', maxWidth: '310px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} className="book-page-image">
            <img
              src={book.bookImage}
              alt={book.bookName}
              style={{ width: '100%', height: '450px', display: 'block' }}
            />
            {book.quantity === 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  maxWidth: '310px',
                  bgcolor: '#00000066',
                  color: 'white',
                  textAlign: 'center',
                  py: 1,
                  px: 2,
                  borderRadius: 1,
                }}
                className="book-page-out-of-stock"
              >
                <Typography variant="book1" fontWeight="bold">
                  Out of Stock
                </Typography>
              </Box>
            )}
          </Box>
          {/* Buttons with toggleable styles and text */}
          <Box sx={{ display: 'flex', gap: 2, width: '70%', height: '7%', mt: 2.5 }} className="book-page-buttons">
            {/* Add to Bag Button with hover effect on wrapper */}
            <Box
              sx={{
                flex: 1,
                '&:hover': {
                  '& .add-to-bag-button': {
                    bgcolor: isAddedToBag ? '#f5f5f5' : '#6B0000',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  },
                },
              }}
              className="book-page-add-to-bag-wrapper"
            >
              <Button
                className="add-to-bag-button"
                variant="contained"
                startIcon={<ShoppingBagIcon />}
                sx={{
                  bgcolor: isAddedToBag ? 'white' : '#8B0000',
                  color: isAddedToBag ? '#8B0000' : 'white',
                  flex: 1,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  border: 'none',
                  width: '100%',
                  height: '50px',
                  '&:hover': {
                    bgcolor: isAddedToBag ? '#f5f5f5' : '#6B0000',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'white',
                    color: '#8B0000',
                    opacity: 1,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    border: 'none',
                  },
                }}
                onClick={handleAddToBag}
                disabled={book.quantity === 0 || isAddedToBag}
              >
                {isAddedToBag ? 'Added✓' : 'Add to Bag'}
              </Button>
            </Box>
            {/* Wishlist Button */}
            <Box
              sx={{
                flex: 1,
                '&:hover': {
                  '& .wishlist-button': {
                    bgcolor: isAddedToWishlist ? '#f5f5f5' : '#333333',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  },
                },
              }}
              className="book-page-wishlist-wrapper"
            >
              <Button
                className="wishlist-button"
                variant="contained"
                startIcon={<FavoriteIcon />}
                sx={{
                  bgcolor: isAddedToWishlist ? 'white' : '#000000',
                  color: isAddedToWishlist ? '#000000' : 'white',
                  flex: 1,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  border: 'none',
                  width: '100%',
                  height: '50px',
                  '&:hover': {
                    bgcolor: isAddedToWishlist ? '#f5f5f5' : '#333333',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'white',
                    color: '#000000',
                    opacity: 1,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    border: 'none',
                  },
                }}
                onClick={handleAddToWishlist}
                disabled={isAddedToWishlist}
              >
                {isAddedToWishlist ? 'Added✓' : 'Wishlist'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Right Section: Book Details */}
        <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 2 }} className="book-page-details">
          {/* Book Name */}
          <Typography variant="h4" fontWeight="bold" className="book-page-title">
            {book.bookName}
          </Typography>

          {/* Author */}
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: -2 }} className="book-page-author">
            by: {book.author}
          </Typography>

          {/* Rating and Quantity */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: -1 }} className="book-page-rating">
            <Chip label="4.5 ★" sx={{ bgcolor: 'green', color: 'white', borderRadius: 1 }} className="book-page-rating-chip" />
            <Typography variant="body2" color="text.secondary" className="book-page-quantity">
              ({book.quantity})
            </Typography>
          </Box>

          {/* Price and Discount Price */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }} className="book-page-price">
            <Typography variant="h5" fontWeight="bold" className="book-page-discount-price">
              Rs. {book.discountPrice}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }} className="book-page-original-price">
              Rs. {book.price}
            </Typography>
          </Box>

          {/* Divider */}
          <Box sx={{ height: '1px', backgroundColor: '#ccc' }} className="book-page-divider" />

          {/* Book Details Heading */}
          <Typography variant="h6" fontWeight="normal" sx={{ mt: 0 }} className="book-page-details-heading">
            Book Details
          </Typography>

          {/* Book Description */}
          <Typography variant="body2" color="gray" sx={{ mb: 0 }} className="book-page-description">
            {book.description}
          </Typography>

          {/* Divider */}
          <Box sx={{ height: '1px', backgroundColor: '#ccc' }} className="book-page-divider" />

          {/* Customer Feedback Text Area (Static) */}
          <Typography variant="h6" fontWeight="normal" className="book-page-feedback-heading">
            Customer Feedback
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, bgcolor: '#ccc', py: 3, px: 2 }} className="book-page-feedback">
            <TextareaAutosize
              minRows={4}
              placeholder="Write your review..."
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                resize: 'vertical',
                background: 'white',
              }}
              className="book-page-textarea"
            />
            <Button variant="contained" sx={{ bgcolor: '#8B0000', alignSelf: 'flex-end' }} className="book-page-submit-button">
              Submit
            </Button>
          </Box>

          {/* Divider */}
          <Box sx={{ height: '1px', backgroundColor: '#ccc', mt: 3 }} className="book-page-divider" />

          {/* Static Customer Reviews */}
          <Box className="book-page-reviews">
            <Box sx={{ mt: 1 }} className="book-page-review">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} className="book-page-review-header">
                <img src={'/profile3.png'} style={{ height: '35px', width: '35px' }} className="book-page-review-image" />
                <Typography variant="h5" fontWeight="bold" className="book-page-review-name">
                  John Doe
                </Typography>
              </Box>
              <img src={'/5stars.png'} style={{ height: '50px', width: '150px', marginLeft: '42px' }} className="book-page-review-stars" />
              <Typography variant="body1" color="gray" sx={{ ml: '52px' }} className="book-page-review-text">
                Great book! Really enjoyed the storyline and characters.
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }} className="book-page-review">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} className="book-page-review-header">
                <img src={'/profile2.png'} style={{ height: '35px', width: '35px' }} className="book-page-review-image" />
                <Typography variant="h5" fontWeight="bold" className="book-page-review-name">
                  Jane Smith
                </Typography>
              </Box>
              <img src={'/5stars.png'} style={{ height: '50px', width: '150px', marginLeft: '42px' }} className="book-page-review-stars" />
              <Typography variant="body1" color="gray" sx={{ ml: '52px' }} className="book-page-review-text">
                A must-read for fans of the genre. Highly recommend!
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BookPage;