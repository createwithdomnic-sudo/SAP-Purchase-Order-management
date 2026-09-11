# SAP Purchase Order Management System

A full-stack SAP-inspired Purchase Order Management System developed to demonstrate procurement, vendor management, material management, purchase order processing, approval workflows, inventory tracking, and REST API integration.

## 🚀 Project Overview

The SAP Purchase Order Management System is a web-based application inspired by real-world SAP S/4HANA procurement workflows.

The system allows users to:

- Manage vendors
- Manage materials
- Create purchase orders
- Calculate purchase order values
- Approve or reject purchase orders
- Deliver approved purchase orders
- Automatically update material stock
- Monitor procurement activities through a dashboard
- Access business operations through REST APIs

This project was developed as a practical learning project to understand how enterprise procurement systems work and how SAP concepts can be implemented using modern web technologies.

---

## 🎯 Objectives

The main objectives of this project are:

1. Understand the Purchase-to-Order process.
2. Implement vendor and material management.
3. Build a purchase order workflow.
4. Develop RESTful APIs using Flask.
5. Implement database operations using SQLite.
6. Create a responsive web dashboard.
7. Test APIs using Postman.
8. Understand the relationship between procurement and inventory.
9. Build an enterprise-style application architecture.

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive UI

### Backend

- Python
- Flask
- Flask-CORS
- REST APIs

### Database

- SQLite

### API Testing

- Postman

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## 🏗️ Project Architecture

```text
Frontend
HTML + CSS + JavaScript
        |
        | REST API
        ↓
Flask Backend
        |
        ├── Routes
        ├── Models
        └── Services
        |
        ↓
SQLite Database
