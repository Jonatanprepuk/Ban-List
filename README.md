Ban List Application
A React-based web application for managing a list of banned companies with Firebase for backend services.

Project Structure
App.js: The main component that wraps the entire application and manages routing.
AppWrapper.js: Wraps the App component with AuthProvider to provide authentication context to the rest of the application.
Login.js: A component for user login using Firebase Authentication.
AdminPage.js: A component that provides an interface for admins to add new companies to the list and manage suggestions.
CompanyPage.js: A component to display detailed information of a selected company.
Suggestion.js: (Assuming it's a component for suggesting new companies, as it wasn't provided)
authContext.js: Provides authentication context to the rest of the application.
firebaseConfig.js: Contains the Firebase configuration and initialization.
Core Features
User Authentication
Admin dashboard for managing companies
Company suggestions management
Company details view
Real-time data fetching from Firebase Firestore
Setup and Installation
Clone the repository to your local machine.
Install the necessary dependencies using npm install.
Create a Firebase project and configure Firebase Authentication and Firestore.
Update firebaseConfig.js with your Firebase project credentials.
Run the application using npm start.
Usage
Users can log in to the application.
Admins can add new companies, view, and manage suggestions.
All users can view the list of companies and their details.
Users can suggest new companies for inclusion in the list.
Technologies Used
React
Firebase (Authentication and Firestore)
react-router-dom for routing