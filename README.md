Full-Stack E-Commerce Platform

A complete end-to-end e-commerce system featuring a TypeScript Express backend, PostgreSQL + Prisma ORM, Redis caching, and a Next.js storefront + admin dashboard.
Built to simulate real-world operations including authentication, ordering, payment authorization, shipping workflows, and inventory management.

Overview

This project implements a production-style online store with:

Backend (TypeScript + Express + Prisma)

Secure JWT authentication with token blacklisting

Role-based access control (Admin, Warehouse Worker, Receiving Desk)

Product catalog management

Order processing workflow (Ordered → Packing → Shipped → Cancelled)

Inventory log tracking and reporting

Shipping cost calculation using defined weight brackets

Email notifications

Redis integration for caching / tokens

Utility scripts for seeding data and managing admin accounts

Database Layer

Prisma ORM with full migration history

Structured relational schema:

users, products, orders, order_items,

shipping_brackets, inventory_logs, blacklisted_tokens

Automatic timestamps for auditing

Referential integrity and optimized indexes

Frontend (Next.js App Router + TypeScript)

Customer storefront

Product pages and image display

Cart system and checkout flow

Order confirmation

Authentication and protected routes

Complete admin dashboard for:

Order pipeline

Inventory updates

Warehouse operations

User management

Running the Project
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev
