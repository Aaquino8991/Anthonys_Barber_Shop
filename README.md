# Anthony's Barbers

## Description

This app aims to store information of the barbers of the shop and the clients that visit. It is required that the client creates an account to be able to post a review. Each client has the following abilities when logged in:

 1. Write as many reviews as they want. 
 2. Update each individual review as desired. 
 3. Delete any individual review they choose. 
 
Each review will be associated with a barber chosen, by the client, in the database.

## Installation

1. Open the terminal and clone the repsitory: 
    ```
      git clone https://github.com/Aaquino8991/Anthonys_Barber_Shop
    ```
2. cd into the server directory and install pipenv dependencies and run the server:
    ```
      cd server
      pipenv install
      flask run
    ```
3. Open another terminal, cd into the client directory, install the npm packages
and run the client-side. 
    ```
      cd client
      npm install
      npm run dev
    ```

## Usage

1. Navigate to the Login Page:

    - When you access the application, you will see a login form for clients.

2. Explore the Navigation Bar:

    - At the top of the page, there is a navigation bar with three links: 'Home', 'Barbers', and 'Login'.

3. View the Barbers Page:

    - Click on the 'Barbers' link in the navigation bar.
    - You will be taken to a page that lists the names of the barbers in the shop.
    - Note: There is an 'Add Barber' button on this page, but it is intended for administrative use in future versions of the app.

4. Return to the Login Page:

    - Click on either the 'Home' or 'Login' links in the navigation bar.
    - You will be redirected to the login page.

5. Login or Signup:

    - If you already have an account, fill in your login credentials and click the login button.
    - If you don't have an account, switch to the 'Signup Form'.
    - Fill in the necessary fields in the signup form and click the signup button.

6. Access the Client Homepage:

    - After successfully logging in or signing up, you will be taken to the client homepage.
    - Here, you can see your reviews (if any), create a new review, and edit or delete an existing review.