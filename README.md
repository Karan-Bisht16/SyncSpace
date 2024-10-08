<h1>SyncSpace - A Complete MERN Stack Application</h1>

SyncSpace is a Reddit-like website built using the MERN stack.
It allows users to create and join communities, known as subspaces, where they can post content, comment, and interact with others.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Design Overview](#system-design-overview)
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

## System Design Overview

[SyncSpace ER Diagram and Technical Architecture](https://app.eraser.io/workspace/dJMjbpJMcqiAW4B3AJRM?origin=share)

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
4. Create a `.env` file and add:
   ```env
   MONGO_URI = your_mongodb_uri
   SESSION_SECRET = your_session_secret
   ACCESS_TOKEN_SECRET = your_access_token_secret
   ACCESS_TOKEN_EXPIRY = 30m
   REFRESH_TOKEN_SECRET = your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY = 1d
   CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
   CLOUDINARY_API_KEY = your_cloudinary_api_key
   CLOUDINARY_API_SECRET = your_cloudinary_api_secret
   FRONT_END_DOMAIN = http://localhost:3000
   ```
5. Start the backend server
   ```sh
   node index.js
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
3. Create a `.env` file and add:
   ```env
   REACT_APP_SUBSPACE_AVATAR_SIZE = your_subspace_avatar_size_in_kb
   REACT_APP_POST_FILE_SIZE = your_post_file_size_in_kb
   REACT_APP_GOOGLE_OAUTH_API_TOKEN = your_google_oauth_api_token
   REACT_APP_JWT_TOKEN_KEY = your_jwt_token_key
   REACT_APP_BACKEND_URL = http://localhost:[your_port]
   REACT_APP_DOMAIN = http://localhost:3000
   ```
4. Start the React app
   ```sh
   npm start
   ```

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Sign up or log in to your account
3. Create and join subspaces, post content, and interact with the community

## Libraries and Tools

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
