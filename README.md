# Book App

## Description

Book App is a responsive web application that allows users to browse and explore a variety of books across different categories. It features a clean, modern interface with dark mode support, user authentication, and detailed book information.

## Features

### 1. Theme Toggle

- **Light and Dark Modes**: Users can switch between light and dark themes using a toggle switch. The theme is applied instantly to the entire application interface.

### 2. User Authentication Modal

- **Sign Up / Sign In Modal**: A modal interface allows users to either sign up for a new account or sign in to an existing one. The modal can be opened and closed using a button for smooth interaction.

### 3. SignUp Functionality

- **Create an Account**: Users can fill in their details (name, email, password) to create a new account. The form validates user input to ensure proper email format and password strength.
- **Form Submission**: Once the user submits the form, their information is securely stored, and they are redirected to the main page with a welcome message.
- **Local Storage**: User data (e.g., name and email) can be stored in local storage for future sessions, allowing for a personalized experience.

### 4. SignIn Functionality

- **Login to Account**: Users can sign in by entering their registered email and password.
- **Authentication Check**: The app verifies the user's credentials against the stored data. If the credentials match, the user is granted access to the application.
- **Session Management**: After signing in, the user session is maintained, allowing them to browse the app without repeated logins.

### 5. Dynamic Category List

- **Category Selection**: The app displays a list of book categories that users can browse. The category list is dynamically populated from an array, making it easy to manage and update.

### 6. Book List Display

- **Book Cards**: Books are displayed in a responsive grid layout. Each book card shows the book's cover image, title, and author. Additional information is displayed when hovering over a book card.

### 7. Responsive Design

- **Mobile and Desktop Views**: The app is designed to be fully responsive, providing an optimal viewing experience across a range of devices.

## Technologies Used

- **HTML5**: For structuring the content.
- **CSS3**: For styling and layout, including Tailwind CSS for utility-first styling.
- **JavaScript**: For handling user interactions, dynamic content, theme toggling, and user authentication.

## Live Demo

- Check out live demo : [here](https://praveenbook.netlify.app/)

## API Reference

This project uses the Books API from GoIT:

- Categories: `https://books-backend.p.goit.global/books/category-list`
- Top Books: `https://books-backend.p.goit.global/books/top-books`
