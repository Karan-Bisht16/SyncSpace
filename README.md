<h1>SyncSpace - A Complete MERN Stack Application</h1>

SyncSpace is a Reddit-like website built using the MERN stack.
It allows users to create and join communities, known as subspaces, where they can post content, comment, and interact with others.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Libraries and Tools](#libraries-and-tools)
- [Acknowledgments](#acknowledgments)

## Features

- User authentication and authorization
- Create and join subspaces
- Post content, comment, and interact within subspaces
- Like and reply to posts and comments

## Tech Stack

- **Frontend:** React.js, React Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Vercel

## Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB

### Backend Setup

1. Clone the repository
   ```sh
   git clone https://github.com/Karan-Bisht16/syncspace.git
   ```
2. Navigate to the backend directory
   ```sh
   cd syncspace/server
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create a `.env` file and add your MongoDB URI and JWT secret
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
5. Start the backend server
   ```sh
   node index.js
   // or
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory
   ```sh
   cd ../client
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the React app
   ```sh
   npm start
   ```

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Sign up or log in to your account
3. Create and join subspaces, post content, and interact with the community

<h2 id="libraries-and-tools">Libraries and Tools</h2>

- [**Material-UI**](https://mui.com/material-ui/getting-started/): A popular React UI framework for building responsive, modern user interfaces.
- [**@tansackreact-query**](https://www.npmjs.com/package/@tanstack/react-query): Used to implement infinite scroll queries with scroll recovery.
- [**@react-oauth/google**](https://www.npmjs.com/package/@react-oauth/google): Used to implement One-tap sign-up.
- [**jwt-decode**](https://www.npmjs.com/package/jwt-decode): Used to decode JWT tokens.
- [**bcrypt**](https://www.npmjs.com/package/bcrypt): Used to hash passwords.
- [**jodit-react**](https://www.npmjs.com/package/jodit-react): An open-source WYSIWYG editor.
- [**html-react-parser**](https://www.npmjs.com/package/html-react-parser): Used for parsing HTML strings into React components.
- [**react-h5-audio-player**](https://www.npmjs.com/package/react-h5-audio-player): A HTML5 media player component for React.
- [**compress-base64**](https://www.npmjs.com/package/compress-base64): Used to compress files in base64 format.
- [**ldrs**](https://www.npmjs.com/package/ldrs): Used to add lightweight loaders & spinner animations.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Vercel](https://vercel.com/)
