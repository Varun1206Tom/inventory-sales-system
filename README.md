# Inventory & Sales Management System

A full-stack web application for managing product inventory, processing customer 
orders, and handling staff operations. Built with React, Node.js/Express, and MongoDB.

## Overview
This project implements a complete e-commerce and inventory management solution with 
role-based access control, cart management, and order processing operations.

## Key Features
- **User Authentication**: JWT-based auth with role-based access (Admin, Staff, Customer)
- **Product Management**: Admin dashboard to manage product inventory
- **Shopping Cart**: 
  - Guest cart with localStorage persistence
  - User-specific cart with database storage
  - Automatic cart merge on login with stock validation
- **Order Management**:
  - Atomic order placement with stock validation
  - Order status tracking (pending → processing → completed/cancelled)
  - Status history with audit trail (timestamps & who changed it)
- **Concurrency Control**:
  - Optimistic locking on cart operations
  - Atomic stock decrements preventing race conditions
  - Rollback mechanism for failed operations
- **Staff Dashboard**: 
  - View recent orders
  - Update order statuses
  - View sales/order analytics
- **Admin Dashboard**:
  - Manage products (add, edit, delete)
  - View sales reports
  - Manage staff members

## Tech Stack
**Frontend:**
- React 18+ with React Router v7
- Bootstrap 5 for UI
- Lucide React for icons
- Axios for HTTP client

**Backend:**
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication
- RESTful API design

**Features:**
- Atomic transactions with MongoDB
- Race condition prevention with optimistic locking
- Role-based authorization middleware
- Error handling and validation
