# Travel-Buddy 1
-Travel buddy is a RESTFUL API desinged to help users manage their travel plans, destinations, reviews and user profiles. it ensures secure and efficient data handling.

## Table of content 
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

## Features 
### User Managment 
- **Registration and login**:secure your registartion and login with JWT
- **Profile Management**: View , update ,and delete user profiles

### Destination Management
- **CRUD Operations**: Add, view, update, and delete destinations.
- **Category Filtering**: Filter destinations by category for easy navigation.

### Trip Management
- **Trip Planning**: Create trips with start dates, budgets, and notes.
- **Trip Updates**: View, update, and delete trips as needed.

### Review systems 
- Adds reviews with ratings and comments 

### Responsive frontend 
- Built with vite 

## tech stack
### Backend 
- **Framework**: Flask
-  **ORM**: SQLALCHEMY
- **Database**:sqlite
- **Authentication**:JWT (Jason web tokens)

### Frontend 
- **Framework**:vite
- **styling**: Tailwind css

## Setup instructions 
### Backend setup
1. Clone the repo 
```bash 
git clone  git@github.com:MaryMachuma/travel-buddy1.git
cd travel-buddy1 
```
2. set up virtual environment 
```bash 
python3 -m venv venv
source venv/bin/activate  
```
3. install dependencies 
```bash
pip install -r requirements.txt
```
4. set up the database 
```bash 
flask db init
flask db migrate
flask db upgrade
```
5. seed the database 
```bash 
python seed.py
```
6. run the surver 
```bash 
 python app.py 
```

### Frontend setup
``` bash 
# navigate to the frontend directory 
cd frontend 

# install dependencies 
npm install

# start the development server
 npm run dev 
 ```

 ## Contribution guidelines
 We welcome contributions to the community 
 1. Fork the repo and clone it locally 
 2. create a branch fory our fix :
 ``` bash 
 git checkout -b fix name 
 ```
 3. Make changes and commit:
 ```bash 
 git add .
 git commit -m "Add a description of your chnages"
 ```
 4. push to github 
 ```bash 
 git push 
 ```
  ## license 
  This project is licensed under MIT license.





















































# vite react 
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


