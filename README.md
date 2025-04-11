# Travel Buddy API

**Travel Buddy** is a robust RESTful API designed to streamline travel planning and management. It allows users to manage their trips, destinations, reviews, and profiles effortlessly. Built with Flask, SQLAlchemy, and JWT Authentication, it ensures secure and efficient data handling. The frontend, powered by Vite, offers a modern and responsive user interface.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contribution Guidelines](#contribution-guidelines)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

### User Management
- **Registration and Login**: Secure user registration and login with JWT authentication.
- **Profile Management**: View, update, and delete user profiles.

### Destination Management
- **CRUD Operations**: Add, view, update, and delete destinations.
- **Category Filtering**: Filter destinations by category for easy navigation.

### Trip Management
- **Trip Planning**: Create trips with start dates, budgets, and notes.
- **Trip Updates**: View, update, and delete trips as needed.

### Review System
- **Add Reviews**: Add reviews with ratings and comments for destinations.
- **Manage Reviews**: View and manage reviews efficiently.

### Responsive Frontend
- **Modern UI**: Built with Vite for a seamless and responsive user experience.

---

## Tech Stack

### Backend
- **Framework**: Flask  
- **ORM**: SQLAlchemy  
- **Database**: SQLite (extendable to PostgreSQL/MySQL)  
- **Authentication**: JWT (JSON Web Tokens)  
- **Serialization**: `flask_sqlalchemy` + `SerializerMixin`  

### Frontend
- **Framework**: Vite (React/Vue/Other)  
- **Styling**: TailwindCSS or Material-UI (optional)  

### Tools
- **Migrations**: Flask-Migrate  
- **Validation**: `sqlalchemy.orm.validates`  
- **Password Hashing**: `werkzeug.security`  

---

## Setup Instructions

### Backend Setup

```bash
# Clone the Repository
git clone https://github.com/yourusername/travel-buddy-api.git
cd travel-buddy-api

# Set Up a Virtual Environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Set Up the Database
flask db init
flask db migrate
flask db upgrade

# Seed the Database
python seed.py

# Run the Server
python app.py
```
### Frontend setup
```bash 
# Navigate to the Frontend Directory
cd frontend

# Install Dependencies
npm install

# Start the Development Server
npm run dev
```
### Contribition 
1. Fork the repository and clone it locally 
2. create a  branch for your feature or fix 
```bash 
git checkout -b fix 
```
3. Make changes and commit 
```bash 
git add .
git commit -m "add description of the changes"
 ```
 4. push to git 
 ```bash 
 git push 
 ```

 ### License 
 THis project is under MIT license.
 






# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
