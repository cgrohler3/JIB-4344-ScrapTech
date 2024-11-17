# Materials Collection Dashboard to Assist Scraplanta with Donation Activities
This application supports the non-profit Scraplanta by innovating their donation intake process as well as by providing multiple avenues for visualizing the impact they have through receiving donations.

# 🔧 Technologies Used
## Frontend: React Native
React Native along with the Expo framework provides an optimal way of developing an application across platforms (iOS, Android, Web) within a single development environment.
## Backend: Node.js
With a small user base, employing node on the back end with the express framework benefits the application since it is fast and handles real-time updates efficiently for our donation logging.
## Database: Firebase Firestore
Firestore meets the cost needs for the application while offering a powerful cloud database that can be scaled as needed. It also requires very little maintenance.

# 📄 Release Notes
## v0.0.0 Release
### Features
-Logging Donations Base Functionality
+ This feature was chosen for demonstration of the tech stack as it is perhaps the most crucial feature of the application. It is the only feature that writes to the database (firestore). It allows for interactioin with the UI on the front end (react native) that communicates to the backend (node.js), ensuring the entire stack's proficiency is demonstrated for our application's 0.0.0 release.


### Bug Fixes
-N/a
### Known Issues
-TBD

# ⚙️ Installation
1. Clone the Repository
2. Install dependecies
+ Navigate to backend
+ run npm install
+ Navigate to frontend
+ run npm install
3. Create a firebase project on Firebase Console and add your configuration to firebaseConfig in the backend files.

# ♻️ Run the ScrapApp
1. Run the Backend Server
+ Change directory to backend
+ run: node index.js
2. Run the Frontend App
+ Change driectory to ScrapApp
+ run: npx expo start
3. Acces the app on Expo Go (Mobile) or press 'w' key to view web version.
