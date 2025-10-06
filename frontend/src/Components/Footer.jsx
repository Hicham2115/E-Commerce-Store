import React from "react";

export default function Footer() {
  return (
    <footer className="bg-green-50 pt-12 pb-4 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:justify-between gap-12">
        {/* Logo and Description */}
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-3xl font-extrabold text-green-600 font-sans">
              G
            </span>
            <span className="text-2xl font-bold text-gray-800 font-sans">
              reenCart
            </span>
          </div>
          <p className="text-gray-500 max-w-xs">
            We deliver fresh groceries and snacks straight to your door. Trusted
            by thousands, we aim to make your shopping experience simple and
            affordable.
          </p>
        </div>
        {/* Links */}
        <div className="flex-[2] grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold mb-3 text-gray-800">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Offers & Deals
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-gray-800">Need help?</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  Delivery Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Return & Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Payment Methods
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Track your Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-gray-800">Follow Us</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-8 border-gray-200" />
      <div className="text-center text-gray-500 text-sm">
        Copyright 2025 © Ali El Kachtaf All Right Reserved.
      </div>
    </footer>
  );
}
