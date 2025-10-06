import React, { useState, useEffect } from "react";
import { productService } from "../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    rating: "",
    price: "",
    original_price: "",
    about_product: "",
    description: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        about_product: Array.isArray(product.about_product) ? product.about_product.join(', ') : product.about_product || '',
        image: null // Don't prefill image input
      });
    } else {
      setEditingProduct(null);
      setFormData({
        category: "",
        name: "",
        rating: "",
        price: "",
        original_price: "",
        about_product: "",
        description: "",
        stock: "",
        image: null,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Prepare the data object
      const data = {
        ...formData,
        // Convert about_product to array if it's a string
        about_product: typeof formData.about_product === 'string' 
          ? formData.about_product.split(',').map(s => s.trim()).filter(Boolean)
          : formData.about_product || []
      };
      
      // Validate required fields
      if (!data.name || !data.category || !data.price) {
        throw new Error("Name, category, and price are required fields");
      }

      // Make API call
      if (editingProduct) {
        await productService.update(editingProduct.id, data);
        setSuccess("Product updated successfully!");
      } else {
        await productService.create(data);
        setSuccess("Product created successfully!");
      }
      
      // Refresh products and close dialog
      await loadProducts();
      handleClose();
    } catch (error) {
      console.error("Error saving product:", error);
      setError(error.message || "An error occurred while saving the product");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      console.log('Attempting to delete product with ID:', id);
      
      // First, get CSRF cookie
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });
      
      // Get CSRF token from cookies
      const getCsrfToken = () => {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];
      };
      
      const csrfToken = getCsrfToken();
      
      if (!csrfToken) {
        throw new Error('Failed to retrieve CSRF token. Please refresh the page and try again.');
      }
      
      console.log('Retrieved CSRF token:', csrfToken);
      
      // Make the delete request with CSRF token
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken)
        },
        body: JSON.stringify({
          _method: 'DELETE'
        }),
        credentials: 'include' // Important for sending session cookie
      });
      
      console.log('Delete response status:', response.status);
      
      if (response.status === 419) {
        const errorData = await response.json().catch(() => ({}));
        console.error('CSRF token validation failed:', errorData);
        throw new Error('Security validation failed. Please refresh the page and try again.');
      } else if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete failed with status:', response.status, 'Error:', errorData);
        throw new Error(errorData.message || `Failed to delete product (Status: ${response.status})`);
      }
      
      setSuccess("Product deleted successfully!");
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error.message || "Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show success/error messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div>
      {/* Success/Error Messages */}
      {success && (
        <div style={{ 
          backgroundColor: '#4caf50', 
          color: 'white', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ 
          backgroundColor: '#f44336', 
          color: 'white', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        style={{ marginBottom: "20px" }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Add New Product'}
      </Button>

      {/* Dynamic Product Card/List View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: 32 }}>
        {products.length === 0 && <div>No products found.</div>}
        {products.map(product => (
          <div key={product.id} style={{ display: 'flex', alignItems: 'center', padding: 16, border: '1px solid #eee', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', background: '#fff', maxWidth: 500 }}>
            {product.image_url && (
              <img
                src={product.image_url.startsWith('http') ? product.image_url : `http://localhost:8000/${product.image_url}`}
                alt={product.name}
                style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, marginRight: 24 }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 18 }}>{product.name}</div>
              <div style={{ color: '#888', fontSize: 15, margin: '2px 0 4px 0' }}>{product.category}</div>
              <div style={{ fontWeight: 500, fontSize: 16 }}>${product.price}</div>
            </div>
            <div>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => handleOpen(product)}
                style={{ marginRight: '8px' }}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Edit'}
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                color="error"
                onClick={() => handleDelete(product.id)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Delete'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Dialog for Add/Edit --- */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Original Price"
            type="number"
            value={formData.original_price}
            onChange={(e) =>
              setFormData({ ...formData, original_price: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Rating"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="About Product (comma separated)"
            value={formData.about_product}
            onChange={(e) =>
              setFormData({ ...formData, about_product: e.target.value })
            }
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            onChange={e =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            style={{ marginTop: 16, marginBottom: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : (editingProduct ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductList;
