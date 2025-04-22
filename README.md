# ScrapApp: Donation Tracker created for Scraplanta
This application supports the non-profit Scraplanta by innovating their donation intake process as well as by providing multiple avenues for visualizing the impact they have through receiving donations.

**The open-source license chosen for this project is: GNU GPLv3**
# 🔧 Technologies Used
## Frontend: React Native/Expo
React Native along with the Expo framework provides an optimal way of developing a mobile application. Expo Go allows for testing the application on native devices without deploying the application.
## Backend: Firebase
Firebase brings simplicity to the management of backend functionality and communication between our application and database, especially in the long-term. It allows us to enable essential operations such as logging/retrieving donations and creating data visualizations.

## Database: Firebase Firestore
Firestore meets the cost needs for the application while offering a powerful cloud database that can be scaled as needed. It also requires very little maintenance, and provides built-in security and authentication/authorization features that help make it secure and powerful.

# 📄 Release Notes
## v1.0 Release
### Features
#### Log Donations
+ Stores donations in Firestore database upon saving.
+ Created required donation fields: zip code, item name, quantity, weight, category
+ Created optional donation fields: donor name and email
+ Added request to confirm donation details.
+ Added alert upon successful donation logging.
+ Added alert upon missing input fields.
+ Added ‘clear’ button to empty user inputs.
+ Included timestamp field linked to saved donation.
#### View Donations
+ Provided a collection of donations made in the last 48 hours.
+ Added ‘retrieve donations’ button to query database.
+ Included red trash icon on each donation.
+ Listed a summary of each donation.
+ Added ability to delete a donation.
+ Included confirmation request for donation deletion.
+ Added alert upon successful deletion.
#### Zip Codes Data View
+ Added dropdown to select a zip code.
+ Added chart to display zip code data.
+ Populated pie charts with different colors for each category.
+ Added legend for pie charts.
+ Listed zip code donation count.
+ Listed zip code total weight.
+ Added ‘clear’ button to remove user selection.
#### Categories Data View
+ Created dropdown for category filtering.
+ Created dropdown for time period filtering.
+ Supplied bar chart according to user filtering.
+ Added labels to chart
+ Displayed zip code contributions to selected categories over selected time frames.
+ Provided category summary with total donation quantities and total weight.
+ Listed top zip codes and corresponding weights for the selected category.
+ Added ‘clear’ button to remove user selections.
#### Heat Map
+ Utilized React Maps to create a Heat Map of logged donations per zip code, where intensities represent weight of all donations.
+ Added refresh option to allow users to refresh the map by pulling new data.
+ Added Zoom option to allow users to toggle between Local (ATL), State (GA), and Country (USA) views for better overview of donations in the Heat Map.
+ Populated heat map with pressable icons, allowing for zip codes and totals to be identified.
#### Home Screen
+ Added Scraplanta logo.
+ Displayed a greeting for the user.
+ Added button to link externally to calendly services for booking appointments.
#### Account Screen
+ Added Scraplanta logo.
+ Added input fields for email and password.
+ Included ‘forgot password’ for recovery email option.
+ Added hidden toggle for password field.
+ Provided option to register user.
+ Provided option to login user.
+ Added error alert messages.
#### Usability / Quality of Life
+ Added navigation bar to route to all screens.
+ Limited appearance of screens based on user type (employee vs. volunteer).
+ Logout option is available on all screens, allowing users to end their session from any screen, rather than limiting this option to only the home screen.
+ Added buttons to swap between zip code and category charts.
+ Designated optional fields with text and green outlines.
### Bug Fixes
- UI fix on Log Donation corrected differences in font between header and content.
- Pie charts now update upon logging a donation without reloading the app.
- Removed visual delay in loading user routes in the navigation bar.
- Stopped view donations from querying the whole database and causing too many reads.
- Fixed Scraplanta logo appearing only partially on the screen.
- Changed error messages from being a catch all to being specific and giving guidance.
- Fixed category options in log donation failing to save due to ‘/’ character by replacing with ‘&’.
- Added loading activity to screens to prevent visual errors.
- Fixed UI consistency across screens.
- Replaced heat map spyglass icon with zoom icon to avoid confusing users.
- Added enough colors for all categories to be represented in pie charts.
- Fixed bug requiring zip code dropdown to be pressed twice to display charts.
### Known Issues
- Since the app was designed for android tablets, the UI is imperfect and the heat map is non-functional on iOS devices.
- Heat map centers itself upon first press of zoom, and then functions properly following this.
- While zip code input is limited to 5 digit integers, zip codes that do not exist are accepted in donation logging and taint the database.
- If all donations in view donations are deleted/empty, the green container still appears.
- Zip codes data view reloads on every visit, so colors may change when navigating away and back from this screen within the application.
- Deleting documents after donations have been logged with floating values (decimals) may cause undesired behavior. [e.g. 0.2 displaying as 0.20000000000001]
- Categories data view chart is not intuitively scrollable.
- There is no current method to edit donations, only to delete and then enter correctly.
