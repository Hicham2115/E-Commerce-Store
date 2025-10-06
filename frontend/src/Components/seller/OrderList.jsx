import React, { useState, useEffect } from "react";
import { useOrders } from "../../contexts/OrderContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const OrderList = () => {
  const { orders, updateOrderStatus, forceUpdate } = useOrders();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Load orders on component mount
  useEffect(() => {
    console.log("OrderList mounted, loading orders...");
    forceUpdate();
    setIsLoading(false);

    // Set up a small delay to check if orders were loaded
    const timer = setTimeout(() => {
      console.log("Current orders after load:", orders);
    }, 1000);

    return () => clearTimeout(timer);
  }, [forceUpdate]);

  // Log when orders change
  useEffect(() => {
    console.log("Orders updated:", orders);
  }, [orders]);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading orders...</Typography>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">No orders found</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Orders will appear here when customers place them
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.items?.length || 0} items</TableCell>
                <TableCell>${order.total_amount?.toFixed(2)}</TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={order.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      displayEmpty
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  {new Date(order.order_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>Order #{selectedOrder.id} Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Customer Information
                      </Typography>
                      <Typography>
                        <strong>Name:</strong> {selectedOrder.customer_name}
                      </Typography>
                      {selectedOrder.customer_email && (
                        <Typography>
                          <strong>Email:</strong> {selectedOrder.customer_email}
                        </Typography>
                      )}
                      {selectedOrder.shipping_address && (
                        <>
                          <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Shipping Address:
                          </Typography>
                          <Typography>
                            {selectedOrder.shipping_address.street}
                          </Typography>
                          <Typography>
                            {selectedOrder.shipping_address.city},{" "}
                            {selectedOrder.shipping_address.state}{" "}
                            {selectedOrder.shipping_address.zipCode}
                          </Typography>
                          <Typography>
                            {selectedOrder.shipping_address.country}
                          </Typography>
                          <Typography>
                            Phone: {selectedOrder.shipping_address.phone}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Order Summary
                      </Typography>
                      <Typography>
                        <strong>Date:</strong>{" "}
                        {new Date(selectedOrder.order_date).toLocaleString()}
                      </Typography>
                      <Typography>
                        <strong>Status:</strong>{" "}
                        {selectedOrder.status || "pending"}
                      </Typography>
                      <Typography>
                        <strong>Subtotal:</strong> $
                        {selectedOrder.subtotal?.toFixed(2)}
                      </Typography>
                      <Typography>
                        <strong>Shipping:</strong> $
                        {selectedOrder.shipping?.toFixed(2)}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        <strong>Total:</strong> $
                        {selectedOrder.total_amount?.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Order Items */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Items
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {item.image_url && (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      marginRight: 10,
                                      objectFit: "cover",
                                    }}
                                  />
                                )}
                                {item.name}
                              </Box>
                            </TableCell>
                            <TableCell>${item.price?.toFixed(2)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell align="right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default OrderList;
