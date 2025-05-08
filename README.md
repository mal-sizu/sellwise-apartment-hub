# Apartment Hub

A full-stack web application for managing, listing, and searching apartments, sellers, and customers. This project is organized into separate backend and frontend folders for clear separation of concerns and easier development.

## Table of Contents
- [Project Structure](#project-structure)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Development](#development)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

## Project Structure
```
├── backend/    # Node.js/Express backend API
├── frontend/   # React + TypeScript frontend
├── README.md   # Project overview (this file)
```

### Backend
- RESTful API for apartments, sellers, and customers
- Authentication endpoints
- Mock data and API simulation for development
- Configuration via `.env`

### Frontend
- React app with TypeScript
- Modern UI with Tailwind CSS
- Service layer for API communication
- Components for property listings, authentication, and more

## Features
- User authentication (login, mock JWT)
- List, search, filter, and paginate apartments
- Manage sellers and customers
- Responsive carousel and UI components
- Modular codebase for easy extension

## Technologies Used
- **Backend:** Node.js, Express, TypeScript, Jest (testing)
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Other:** ESLint, Prettier, Postman (API testing)

## Getting Started
Clone the repository:
```sh
git clone https://github.com/your-org/apartment-hub.git
cd apartment-hub
```

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in `.env` as needed.
4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development
- Both backend and frontend support hot-reloading for rapid development.
- Use Prettier and ESLint for code formatting and linting.
- Run tests (backend):
  ```sh
  npm test
  ```

## Contribution Guidelines
- Fork the repository and create a feature branch.
- Follow existing code style and naming conventions.
- Write clear commit messages.
- Submit a pull request with a detailed description.

## License
MIT License. See [LICENSE](LICENSE) for details.