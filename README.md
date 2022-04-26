# Portfolio API

This is a simple REST API to build a portfolio that I have built using for educational purposes only. While it is working, keep in mind it needs enhancements. However, clone/fork it happily and enjoy! :smile:

## Notes
- This is a single user application (You can easily extend it).
- Database backend is MongoDB.
- Mongooose is used to connect to the database.
- Authentication is handled by JWT.
- Logging is handled by winston & morgan.
- Sample `.env` file is provided.
- Helmet is used with the default configuration.
- Rate limiter and allowed HTTP verbs are configured.

## Features
### Authentication
Performs authentication using JWT and reading the headers.

### Profile
Supports CRU operations on the profile.

### Tags
Supports CRUD operations on the tags.

### Projects (Cards)
Supports CRUD operations on the projects.

### Search
Performs text search (using title and tags) on the projects.

### User
Supports create, sign-in and change password for the user.

### To-Do
- [ ] Add unit tests kmyrnx/portfolio-api#1
- [ ] Add endpoints tests kmyrnx/portfolio-api#2

## Installation
Clone the repository and run `npm install` to install the dependencies, fill the provided `.env` file then run `npm start` to start the application.

## Structure
The following structure organizes components.

```
├── README.md
├── controllers
│   ├── profile.controller.js
│   ├── projects.controller.js
│   ├── search.controller.js
│   ├── tags.controller.js
│   └── user.controller.js
├── db
│   └── conn.js
├── helpers
│   ├── auth.js
│   ├── httpLogger.js
│   ├── logger.js
│   ├── rateLimiter.js
│   └── slugify.js
├── models
│   ├── profile.model.js
│   ├── project.model.js
│   ├── tag.model.js
│   └── user.model.js
├── package.json
├── routes
│   ├── index.js
│   ├── profile.js
│   ├── projects.js
│   ├── search.js
│   ├── tags.js
│   └── user.js
├── server.js
└── services
    ├── profile.service.js
    ├── projects.service.js
    ├── search.service.js
    ├── tags.service.js
    └── user.service.js
```
