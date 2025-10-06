import { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import ProductList from "./seller/ProductList";
import OrderList from "./seller/OrderList";

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

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Typography variant="h4" component="h1" className="font-bold">
            Seller Dashboard
          </Typography>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hi! Admin</span>
            <button className="border border-gray-300 rounded-full px-6 py-2 text-gray-700 font-medium hover:bg-gray-100">
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <ProductList />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <OrderList />
        </TabPanel>
      </div>
    </div>
  );
}
