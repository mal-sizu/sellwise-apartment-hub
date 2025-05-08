# Apartment Hub Frontend

## Overview
This directory contains the frontend application for Apartment Hub, a modern platform for property listings, management, and user interactions. The frontend is built with React and TypeScript, providing a responsive, accessible, and user-friendly interface for buyers, sellers, and administrators.

## Features
- Property browsing and detailed views
- Seller dashboard for property management
- Admin panel for managing sellers and listings
- User authentication and authorization
- Responsive design for mobile and desktop
- Real-time updates and notifications
- Modern UI components and animations

## Technology Stack
- **Framework:** React (with Vite for fast development)
- **Language:** TypeScript
- **Routing:** React Router
- **State Management:** React Context, React Query
- **UI Components:** Custom components, Lucide Icons, Framer Motion for animations
- **Styling:** Tailwind CSS (utility-first CSS framework)
- **API Communication:** Axios (or fetch, depending on implementation)
- **Testing:** (Add details if testing libraries are used)

## Project Structure
```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers (e.g., AuthContext)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components (admin, seller, property, etc.)
│   ├── services/          # API service modules
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── package.json           # Project metadata and dependencies
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Getting Started
### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Development Server
Start the local development server:
```sh
npm run dev
# or
yarn dev
```
The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Building for Production
To build the app for production:
```sh
npm run build
# or
yarn build
```
The output will be in the `dist` directory.

### Previewing the Production Build
To preview the production build locally:
```sh
npm run preview
# or
yarn preview
```

## Development Workflow
- **Code Style:** Follow the existing code style and naming conventions. Use TypeScript for type safety.
- **Component Structure:** Place reusable UI elements in `src/components`. Pages go in `src/pages`.
- **API Calls:** Use service modules in `src/services` for all backend communication.
- **State Management:** Use React Context for global state (e.g., authentication) and React Query for server state and data fetching.
- **Styling:** Use Tailwind CSS utility classes. Custom styles can be added in the appropriate CSS/SCSS files if needed.
- **Icons & Animations:** Use Lucide for icons and Framer Motion for animations.

## Contribution Guidelines
- Fork the repository and create a new branch for your feature or bugfix.
- Write clear, descriptive commit messages.
- Ensure your code passes linting and builds successfully.
- Test your changes thoroughly.
- Submit a pull request with a detailed description of your changes.

## Main Dependencies
- react
- react-dom
- react-router-dom
- @tanstack/react-query
- tailwindcss
- framer-motion
- lucide-react

## Additional Notes
- For authentication and protected routes, refer to the `AuthContext` in `src/context`.
- To add new pages, create a new file in `src/pages` and update the router configuration.
- For custom hooks, use the `src/hooks` directory.
- For API endpoints, update or add service modules in `src/services`.

## License
This project is licensed under the MIT License.

---
For backend or full-stack setup, refer to the main project README.