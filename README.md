# Materials Collection Dashboard to Assist Scraplanta with Donation Activities
This application supports the non-profit Scraplanta by innovating their donation intake process as well as by providing multiple avenues for visualizing the impact they have through receiving donations.
**The open-source license chosen for this project is: GNU GPLv3**
# 🔧 Technologies Used
## Frontend: React Native/Expo
React Native along with the Expo framework provides an optimal way of developing an application across platforms (iOS, Android, Web) within a single development environment. Expo Go allows for testing for the application on native devices without deploying the application.
## Backend: Firebase
Firebase is used to perform operations such as logging donations and retrieving data for viewing purposes. It manages communication between our application and the database. It also brings simplicity to managing app operations and management long term.
## Database: Firebase Firestore
Firestore meets the cost needs for the application while offering a powerful cloud database that can be scaled as needed. It also requires very little maintenance, and provides built-in security and authentication/authorization features that help make it secure and powerful.

# 📄 Release Notes
## v0.1.0 Release
### Features
#### Account Creation / Sign in
+ A simplistic way of authenticating users via Firebase was created. Currently accounts can be created using an email and password, and a login process is available.
#### Log Donations
+ Donation logging is fully functional with a variety of fields stored to the firestore database. New fields include timestamps of donation logging, and a confirmation request is provided.
### Bug Fixes
-UI updates to Donation Retrieval <br/>
-UI updates for Log Donation
### Known Issues
-Authentication persistance seems to affect login error messages

## v0.0.0 Release
### Features
#### Logging Donations Base Functionality
+ This feature was chosen for demonstration of the tech stack as it is perhaps the most crucial feature of the application. It is the only feature that writes to the database (firestore). It allows for interaction with the UI on the front end (react native) that communicates to the backend (javascript), ensuring the entire stack's proficiency is demonstrated for our application's 0.0.0 release.


### Bug Fixes
-N/A
### Known Issues
- Becasue our application is being developed for mobile platforms, Expo's development server on the web is not optimized and has some broken UI. However, the application, for the purposes of the artifact demo, works on mobile.


# ⚙️ Installation
1. Clone the Repository
2. Install required dependecies
3. For developers, add config.js file in "frontend/src/ScrapApp" and populate it with configuration code provided on Firebase Console.

# ♻️ Run the ScrapApp
1. Run the app
+ Navigate to frontend/src/ScrapApp from powershell or any CLI.
+ From the same CLI, run "npx expo start"
2. Acces the app on Expo Go (Mobile) by scanning provided QR code or press 'w' key to view web version.
