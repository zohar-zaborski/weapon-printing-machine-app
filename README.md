# Weapon Printing App
## Frontend
### Zohar Zaborski
This is the frontend application for the Weapon Printing Machine project. It provides an interactive user interface to customize weapons, manage saved customizations, view print jobs, and more.


## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Further Elaboration](#further-improvements)
- [Screens](#screens)


## Features
- **User Authentication**: Secure login and registration system.
- **Customization Dashboard**: Select weapons, customize with parts, and save your configurations.
- **Print Jobs Management**: View and manage print job statuses.
- **Upcoming Weapons**: Display a mock section for future weapon updates.
- **Responsive Design**: Fully responsive and user-friendly interface.

## Project Structure
The main components are organized as follows:
```bash
src/
├── components/          # Reusable UI components (e.g., Navbar, Customizer, etc.)
├── pages/               # Page-level components (e.g., Dashboard, SavedWeapons, etc.)
├── services/            # API service functions
├── atoms/               # State management with Jotai
├── mockData/            # Mock data for development
├── media/               # Images and other static media assets
├── styles/              # Global and component-specific styles
├── App.tsx              # Main app component
├── index.tsx            # Entry point of the application
```

## Setup Instructions
 
1. Clone the repository(if you downloaded via zip file, skip this part):
    https://github.com/zohar-zaborski/weapon-printing-machine-app.git
    cd weapon-printing-machine-app
2.Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3. Set up environment variables: Create a .env file in the project root and add the following:
    ```bash
    REACT_APP_API_URL=http://127.0.0.1:8000 #default port for React
    ```
4. Use this command to disable version mismatch in React TS:
    ```bash
    export NODE_OPTIONS=--openssl-legacy-provider
    ```
5. Start the development server:
    ```bash
    npm start
    # or
    yarn start
    ```


## Further Elaboration
- Possible Features Implementations:
    - `More Pages`: Adding a personal page to each weapon when it has more detail, endpoint exists in the server.
    - `More User options`: My choice was to give the user the option to delete customization, but maybe the user would like to cancel the print job as well.
    It's also possible to add a counter that will be specific to each weapon, because every weapon has different printing time.
    - `More Fields`: Generating more "Real world" fields, like Unique ID of the weapon, a serial number. More fields:
                    Color, Magazine Size, etc.

## Screens
Typical Work flow of the user(Logging in, Home page, create Customization, send it to print, and watch the prints list):
![Demo GIF](/demo.gif)





