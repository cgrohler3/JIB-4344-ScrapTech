# Materials Collection Dashboard to Assist Scraplanta with Donation Activities
This application supports the non-profit Scraplanta by innovating their donation intake process as well as by providing multiple avenues for visualizing the impact they have through receiving donations.

**The open-source license chosen for this project is: GNU GPLv3**
# 🔧 Technologies Used
## Frontend: React Native/Expo
React Native along with the Expo framework provides an optimal way of developing an application across platforms (iOS, Android, Web) within a single development environment. Expo Go allows for testing for the application on native devices without deploying the application.
## Backend: Firebase
Firebase brings simplicity to the management of backend functionality and communication between our application and database, especially in the long-term. It allows us to enable essential operations, such as logging/retrieving donations, creating data visualizations.

## Database: Firebase Firestore
Firestore meets the cost needs for the application while offering a powerful cloud database that can be scaled as needed. It also requires very little maintenance, and provides built-in security and authentication/authorization features that help make it secure and powerful.

# 📄 Release Notes
## v0.4.0 Release
### Features
#### Category Data Bar Graph
+ Added Option to swap between category and zip code data visualizations.
#### Top Zip Codes List
+ Displayed zip codes contributing the highest number of donations in a selected category.
+ Added zip code contributions to category collection in Firestore.
#### UI Updates
+ Displayed Log Donation fields as optional.
+ Added Home Screen instructions.
+ Zoom icon replaced spyglass for improved user experience (Heat Map).
+ Visibility toggle for password input.
### Bug Fixes
-
### Known Issues
-

## v0.3.0 Release
### Features
#### Donation Density (Heat) Map
+ Added protected routing to allow only employees to access Heat Map.
+ Utilized React Maps to create a Heat Map of logged donations per zipcode, where intensities represent weight of all donations.
+ Added Refresh option to allow users to refresh the map by pulling new data.
+ Added Zoom option to allow users to toggle between Local (ATL), State (GA), and Country (USA) views for better overview of donations in the Heat Map.
#### Password Recovery
+ Created "Forgot Password" option to allow registered users to reset their password.
+ Configured Firebase to send emails to users for password recovery.
### Bug Fixes
-Setup 2-day donation retrieval to reduce excessive reads from database <br/>
-Updated UI for screens to be more visually consistent and pleasing. <br/>
-Added Loading activity to items/screen to allow them to load gracefully.
### Known Issues
-Application is volatile on iOS devices in both UI and functionality, specifically Heat Maps.


## v0.2.0 Release
### Features
#### Donation Visualization By Zip Code
+ Added taskbar navigation to show new screen for Zip Codes.
+ Dyanmic Pie Chart that's updated based on selected zip code, which details the category breakdown of donations received from that zip code.
+ Visualization also shows total quantity and weight for selected zip code.
#### Global Logout
+ Logout option is available on all screens, allowing users to end their session from any screen, rather than limiting to only the home screen.
#### Protected/User-Specific Routes
+ Users are shown application screens based on user type: Volunteer or Employee.
+ Employees can view employee-specific screens, like Zip Codes, while Volunteers cannot.
### Bug Fixes
-Login error messages are more informative and capture more error states. <br/>
-UI changes to allow Scraplanta logo to be displayed fully.
### Known Issues
-No built-in process for recovery/renewal of forgotten passwords. <br/>
-Inconsisent font/UI styling between screen header and content. <br/>
-Empty Home Screen, needs to be updated to be more informative for User/Employee. <br>
-Pie Chart is not automatically refreshed after new donation logging for selected zip code. <br>
-User-Specific Routes for Employee load after a slight delay, will need to optimize. <br>
-Application doesn't allow for two Users, regardless of type, to have the same Email. <br>
-View Donations screen queries entire "donations" collection, leading to higher # of reads, needs to be updated. <br/>


## v0.1.0 Release
### Features
#### Account Creation / Sign In
+ A simplistic way of authenticating users via Firebase was created. Currently, accounts can be registered using an email and password, and accessed using same credentials in the login process.
+ Additional alerts have been added to notify user of any errors encountered during login/register process. Ex: Invalid Credentials/User not registered.
#### Log Donations
+ Donation logging is fully functional with a variety of fields stored to the Firestore database. New fieldss include email, zipcode, and timestamp of donation logging, and a confirmation request is provided.
### Bug Fixes
-UI updates to Donation Retrieval. <br/>
-UI updates for Log Donation.
### Known Issues
-Authentication persistance seems to affect login error messages.

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
3. For developers, add "lib" folder in "frontend/src/ScrapApp" and add "firebaseConfig.js" file in "lib" folder. Then, populate .js file with configuration code (as provided by Scraplanta).

# ♻️ Run the ScrapApp
1. Run the app
+ Navigate to frontend/src/ScrapApp from powershell or any CLI.
+ From the same CLI, run "npx expo start"
2. Acces the app on Expo Go (Mobile) by scanning provided QR code or press 'w' key to view web version.


