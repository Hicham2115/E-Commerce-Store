import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Minimal localStorage test
if (typeof window !== 'undefined') {
  try {
    localStorage.setItem('test_key', 'test_value');
    const testValue = localStorage.getItem('test_key');
    console.log('localStorage test value:', testValue);
  } catch (e) {
    console.error('localStorage is not available:', e);
  }
}


const STORAGE_KEY = 'seller_orders';
const OrderContext = createContext();

// Helper function to safely parse JSON
const safeJsonParse = (str, defaultValue = []) => {
  try {
    return str ? JSON.parse(str) : defaultValue;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return defaultValue;
  }
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      console.log('Loading orders from localStorage:', saved);
      return safeJsonParse(saved, []);
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error);
      return [];
    }
  });

  // Attach orders to window for manual inspection
  useEffect(() => {
    window.__orders = orders;
    window.__saveOrders = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        console.log('Manually saved orders to localStorage:', orders);
      } catch (e) {
        console.error('Manual save failed:', e);
      }
    };
  }, [orders]);
  
  // Save to localStorage whenever orders change
  useEffect(() => {
    console.log('useEffect for orders triggered:', orders);
    try {
      console.log('Saving orders to localStorage:', orders);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      
      // Verify the save
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = safeJsonParse(saved, null);
      if (parsed === null || JSON.stringify(parsed) !== JSON.stringify(orders)) {
        console.error('Failed to verify orders in localStorage');
      } else {
        console.log('Successfully verified orders in localStorage');
      }
    } catch (error) {
      console.error('Failed to save orders to localStorage:', error);
    }
  }, [orders]);
  
  // Force update function
  const forceUpdate = useCallback(() => {
    console.log('Force updating orders from localStorage');
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = safeJsonParse(saved, []);
      console.log('Reloaded orders from localStorage:', parsed);
      setOrders(parsed);
    } catch (error) {
      console.error('Failed to reload orders from localStorage:', error);
    }
  }, []);

  // Add a new order
  const addOrder = useCallback((order) => {
    console.log('Adding new order:', order);
    const newOrder = {
      ...order,
      id: Date.now(),
      order_date: new Date().toISOString(),
      status: 'pending'
    };
    
    setOrders(prevOrders => {
      const updatedOrders = [newOrder, ...prevOrders];
      console.log('Updated orders (setOrders called):', updatedOrders);
      return updatedOrders;
    });
    setTimeout(() => {
      console.log('Orders after setOrders (timeout):', window.__orders);
    }, 500);
    return newOrder;
  }, []);

  // Update order status
  const updateOrderStatus = useCallback((orderId, status) => {
    console.log(`Updating order ${orderId} status to ${status}`);
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      console.log('Orders after status update:', updatedOrders);
      return updatedOrders;
    });
  }, []);

  // Log when orders change
  useEffect(() => {
    console.log('Orders state changed:', orders);
  }, [orders]);

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      updateOrderStatus,
      forceUpdate
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
