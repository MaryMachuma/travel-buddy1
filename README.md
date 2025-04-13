# Travel Buddy Website

**Travel Buddy** is a full-stack travel planning web application designed to help users discover, explore, and book exciting destinations around the world. Users can browse a curated list of travel spots, view detailed destination pages with descriptions, pricing, and ratings, and add trips to their personal itinerary. With secure user authentication via JWT, each user can book a trip they desire.The app features a dynamic, user-friendly React frontend integrated with a Flask RESTful API backend using SQLAlchemy for data management, making travel planning simple, personalized, and interactive.


## Features

### User Management
- **Registration and Login**: Secure user registration and login with JWT authentication.

### Destination Management
- **CRUD Operations**: View destinations, submit booking,creating account also entails submitting credentials.
- **Destinations Filtering**: Filter destinations by city for easy navigation.

### Trip Planning
- **Trip Planning**: After viewing destinations and making up your mind after considering various factors,navigate to `MyTrips section`,represented by an airplane icon and book a trip.


### Responsive Frontend
- **Modern UI**: Built with Vite for a seamless and responsive user experience.

---

## Tech Stack

### Backend
- **Framework**: Flask  
- **ORM**: SQLAlchemy  
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)  
- **Serialization**: `flask_sqlalchemy` + `SerializerMixin`  
- **Migrations**: Flask-Migrate  
- **Password Hashing**: `werkzeug.security` 

### Frontend setup 
- **Framework**: Vite (React)  
- **Styling**: global css file used


## Installation

### Backend Setup

```bash
# Clone the Repository
git clone git@github.com:MaryMachuma/travel-buddy1.git
cd travel-buddy1 


# Set Up a Virtual Environment
python3 -m venv venv
source venv/bin/activate  

# Install Dependencies
pip install -r requirements.txt

# Set Up the Database
flask db init
flask db migrate
flask db upgrade head

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


## Database schema 
The database schema includes the following tables:
- **Users**: Stores user information (id, username, email, password, etc.).
- **Destinations**: Stores destination details (id, name, category, etc.).
- **Trips**: Stores trip details (id, user_id, start_date, budget, etc.).

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

















































# vite react 
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


