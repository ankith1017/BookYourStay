# BookYourStay

BookYourStay is a full-stack Node.js web application for booking and listing accommodations, similar to Airbnb. It allows users to sign up, log in, create listings, leave reviews, and manage their own listings. The project uses Express, MongoDB (with Mongoose), Passport.js for authentication, Cloudinary for image uploads, and EJS for templating.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [How the Project Works](#how-the-project-works)
- [Routing Overview](#routing-overview)
- [Example Route](#example-route)
- [Error Handling](#error-handling)
- [Authentication & Authorization](#authentication--authorization)
- [Environment Variables](#environment-variables)
- [Author](#author)

---

## Features

- User registration and login (authentication)
- Create, edit, and delete listings (authorization)
- Upload listing images to Cloudinary
- Leave and delete reviews on listings
- Flash messages for feedback
- Server-side validation with Joi
- Error handling for routes and validation
- Responsive UI with Bootstrap and EJS

---

## Project Structure

```
.
├── app.js
├── cloudconfig.js
├── middleware.js
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── routes/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
├── views/
│   ├── layouts/
│   ├── includes/
│   ├── listing/
│   ├── users/
│   └── error.ejs
├── public/
│   ├── css/
│   └── js/
├── schema.js
├── package.json
└── .env
```

---

## How the Project Works

1. **Startup**:  
   The app connects to MongoDB using credentials from `.env`. Sessions are stored in MongoDB using `connect-mongo`.

2. **Authentication**:  
   Passport.js with `passport-local-mongoose` handles user registration and login. Passwords are hashed and stored securely.

3. **Listings**:  
   Authenticated users can create, edit, and delete their own listings. Each listing can have an image uploaded to Cloudinary.

4. **Reviews**:  
   Authenticated users can leave reviews on listings. Only the author of a review can delete it.

5. **Validation**:  
   Joi schemas in [`schema.js`](schema.js) validate incoming data for listings and reviews.

6. **Flash Messages**:  
   Success and error messages are shown to users using `connect-flash`.

7. **Error Handling**:  
   All routes use centralized error handling via custom [`ExpressError`](utils/ExpressError.js) and a catch-all middleware.

---

## Routing Overview

- **Listings**
  - `GET /listings` — Show all listings
  - `GET /listings/new` — Form to create a new listing (auth required)
  - `POST /listings` — Create a new listing (auth required)
  - `GET /listings/:id` — Show a single listing
  - `GET /listings/:id/edit` — Edit form for a listing (owner only)
  - `PUT /listings/:id` — Update a listing (owner only)
  - `DELETE /listings/:id` — Delete a listing (owner only)

- **Reviews**
  - `POST /listings/:id/reviews` — Add a review (auth required)
  - `DELETE /listings/:id/reviews/:reviewId` — Delete a review (author only)

- **Users**
  - `GET /signup` — Registration form
  - `POST /signup` — Register a new user
  - `GET /login` — Login form
  - `POST /login` — Log in
  - `GET /logout` — Log out

---

## Example Route

**Create a New Listing**

- **Route:** `POST /listings`
- **Middleware:** `isLoggedIn`, `upload.single("listing[image]")`, `validateListing`
- **Controller:** `listingController.createListing`

**How it works:**
1. Checks if the user is logged in.
2. Handles image upload to Cloudinary.
3. Validates the listing data with Joi.
4. Saves the new listing to the database and redirects to `/listings`.

**Sample Request (using HTML form):**
```html
<form action="/listings" method="POST" enctype="multipart/form-data">
  <input name="listing[title]" type="text" required>
  <input name="listing[price]" type="number" required>
  <input name="listing[image]" type="file" required>
  <!-- other fields -->
  <button type="submit">Create</button>
</form>
```

---

## Error Handling

- All async route handlers are wrapped with `wrapAsync` to catch errors.
- Validation errors throw an `ExpressError` with a status code and message.
- A catch-all route (`app.all("*", ...)`) handles 404 errors.
- A centralized error-handling middleware renders `views/error.ejs` for any uncaught errors.

---

## Authentication & Authorization

- **Authentication** is handled by Passport.js.  
  - Users must log in to create listings or reviews.
  - Session management is done with `express-session` and `connect-mongo`.

- **Authorization** is enforced in `middleware.js`:
  - Only the owner of a listing can edit or delete it (`isOwner`).
  - Only the author of a review can delete it (`isReviewAuthor`).
  - Middleware checks are applied to relevant routes in `routes/listings.js` and `routes/reviews.js`.

---

## Environment Variables

Create a `.env` file in the root with the following keys:

```
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

---

## Author

**Ankith S**

---

## License

ISC

---

## Links

- [controllers/listings.js](controllers/listings.js)
- [controllers/reviews.js](controllers/reviews.js)
- [controllers/users.js](controllers/users.js)
- [middleware.js](middleware.js)
- [schema.js](schema.js)
- [routes/listings.js](routes/listings.js)
- [routes/reviews.js](routes/reviews.js)
- [routes/users.js](routes/users.js)