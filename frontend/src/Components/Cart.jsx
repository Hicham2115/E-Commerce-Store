import React, { useState, useRef, useEffect, useMemo, useCallback, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useOrders } from "../contexts";

const Cart = ({ cart: propCart, onUpdateCart, onRemoveFromCart }) => {
  const { addOrder, forceUpdate } = useOrders();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  
  // Use a ref to store the previous cart to prevent unnecessary updates
  const prevCartRef = useRef(propCart);
  const [cart, setCart] = useState(propCart || []);
  
  // Update local cart state when propCart changes
  useEffect(() => {
    // Only update if the cart has actually changed
    if (JSON.stringify(prevCartRef.current) !== JSON.stringify(propCart)) {
      setCart(propCart || []);
      prevCartRef.current = propCart;
    }
  }, [propCart]);
  
  // Memoize the cart to prevent unnecessary re-renders
  const memoizedCart = useMemo(() => cart, [JSON.stringify(cart)]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    try {
      // Get the current user ID from local storage or authentication context
      const user = JSON.parse(localStorage.getItem('user')) || {};
      
      if (!user || !user.id) {
        throw new Error('Please log in to place an order.');
      }

      console.log('Current cart items:', memoizedCart);
      if (!memoizedCart || memoizedCart.length === 0) {
        throw new Error('Your cart is empty');
      }

      // Prepare order data
      const orderData = {
        customer_name: formData.name || 'Guest',
        customer_email: formData.email || 'no-email@example.com',
        shipping_address: formData.address || 'No address provided',
        items: memoizedCart.map(item => ({
          id: item.id || Date.now(),
          name: item.name || 'Unnamed Product',
          price: parseFloat(item.price) || 0,
          quantity: item.quantity || 1,
          image: item.image || ''
        })),
        total_amount: memoizedCart.reduce((total, item) => {
          return total + ((parseFloat(item.price) || 0) * (item.quantity || 1));
        }, 0)
      };

      console.log('Submitting order:', orderData);

      // Add the order to our context
      try {
        console.log('Before addOrder');
        const newOrder = addOrder({
          ...orderData,
          // Add any additional fields required by OrderContext
          id: Date.now(),
          order_date: new Date().toISOString(),
          status: 'pending'
        });
        
        console.log('After addOrder, newOrder:', newOrder);
        
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Force update to ensure orders are refreshed
        forceUpdate();

        // Print the orders table in the console
        import("../contexts").then(({ useOrders }) => {
          // Use a timeout to ensure state is up-to-date
          setTimeout(() => {
            try {
              const orders = JSON.parse(localStorage.getItem('seller_orders')) || [];
              console.table(orders);
            } catch (e) {
              console.error('Could not print orders table:', e);
            }
          }, 200);
        });
        
        // Show success message
        alert("Order placed successfully!");
        
        // Close dialog and clear cart
        handleClose();
        onUpdateCart([]);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          address: "",
        });
        
        // Force a re-render of the orders list
        setTimeout(() => {
          forceUpdate();
        }, 200);
      } catch (error) {
        console.error('Error in addOrder:', error);
        alert(`Failed to place order: ${error.message}`);
        throw error;
      }
      
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error.message || "Failed to place order. Please try again.");
    }
  }, [formData, memoizedCart, handleClose, onUpdateCart]);

  const total = useMemo(() => {
    return memoizedCart.reduce((sum, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) 
        : item.price;
      return sum + (price * (item.quantity || 1));
    }, 0);
  }, [memoizedCart]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Shopping Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <>
          <List>
            {cart.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.name}
                  secondary={`$${item.price} x ${item.quantity}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom>
            Total: ${total.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            fullWidth
          >
            Place Order
          </Button>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} color="primary">
                Place Order
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default Cart;
