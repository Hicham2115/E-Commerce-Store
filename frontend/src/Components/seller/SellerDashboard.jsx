import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography } from '@mui/material';
import ProductList from './ProductList';
import OrderList from './OrderList';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Seller Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          aria-label="seller dashboard tabs"
        >
          <Tab label="Products" id="products-tab" aria-controls="products-tabpanel" />
          <Tab label="Orders" id="orders-tab" aria-controls="orders-tabpanel" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <ProductList />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <OrderList />
      </TabPanel>
    </Container>
  );
};

export default SellerDashboard;
