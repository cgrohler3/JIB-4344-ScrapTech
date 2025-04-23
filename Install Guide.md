# Pre-Requisites
### Hardware
  - Android Tablet (Preferably Galaxy Tab A9+ or Older) <br>
  - [Purchase the Tablet Here](https://www.amazon.com/SAMSUNG-Android-Speakers-Upgraded-Graphite/dp/B0CLF3VPMV?tag=googhydr-20&source=dsa&hvcampaign=electronics&gbraid=0AAAAA-b0EosaL1JePXRt0olLzoyRqaGP6&gclid=Cj0KCQjw2ZfABhDBARIsAHFTxGzHadUVNLCBMxvn6oQlxMN39TdUmvcu2mOzkYthpyO7RDxR7TaJ8QcaAm2YEALw_wcB&th=1)
### Software
  - Ensure device's Android OS is up-to-date.

# Libraries
- No external libraries are needed to be installed.
- Provided APK will handle such installations internally.

# Download Instructions
### Developer Installation Instructions
- Pre-Requisites:
  - Ensure Package Name & SHA-1 are added in `Maps Platform API Key` to allow maps to work properly.
- Expo Build (Using Expo Cloud in [(expo.dev)](https://expo.dev)) [~15-25 mins]
  - Pre-Requisites:
    1. Create Account on [(expo.dev)](https://expo.dev)) & Connect using `eas login`
    2. Populate `"apiKey": "KEY"` in app.json with your key using this guide: [React Native Maps](https://docs.expo.dev/versions/latest/sdk/map-view/#create-an-api-key)
    3. Create Android Prebuild using `npx expo prebuild --clean`
  - To build development, use: `eas build --platform android --profile development`
  - To build production, use: `eas build --platform android`

- Android Build (Using Gradle) [~20-60 mins]
  - Pre-Requisites:
    1. Ensure CMake is up-to-date, Update if necessary from Android Studio.
    2. Place "ScrapApp" folder in most parent root, preferably "C:\\" to avoid errors with long file paths.
    3. Populate `"apiKey": "KEY"` in app.json with your key using this guide: [React Native Maps](https://docs.expo.dev/versions/latest/sdk/map-view/#create-an-api-key)
    4. Add these properties to bundle.properties to ensure maps work as expected: [Maps Conf](https://docs.expo.dev/guides/local-app-production/)
    5. Create Android Prebuild using `npx expo prebuild --clean`
  - To build production, use: `cd android` & `./gradlew assembleRelease`

- NOTE: Always prebuild before building (regardless of changes) to ensure build is up-to-date.
### Accessing the Download
- All APK builds will reside in Expo [(expo.dev)](https://expo.dev), where developer account would've been setup using client's provided credentials.
- Access to such an account will be handed off to primary contact from client.
# Installing the App
- To download latest APK:
1. Visit [(expo.dev)](https://expo.dev), and login using client credentials.
2. In the navigation to the left, select "Projects"
3. Select "ScrapApp" within Project list.
4. In the navigation to the left, select "Builds", then "All builds"
5. Click on the build with profile name of "production"
6. Click on the blue button titled "Install", and install by scaning the QR code on the device to download.
7. Or, click the dot menu to the right of "Install", then "Download build" to download the file directly to device.
8. Lastly, click on the downloaded APK file to install app on the device.
# Running the App
- Once the APK downloads, user simply has to access the application to use it.
- No additional execution is necessary to interact with the app.
# Troubleshooting
### Install Errors
- If the download is corrupted, meaning APK is not downloading the application: user needs to rebuild the application again and follow the install process using the new APK.
- If APK is corrupted, again, rebuild the application to generate a new APK, and follow the install process above.
### Running Errors
- If application is slow or struck, then simple close and repon the app on the device. This is the common solution for most errors when running the app.
