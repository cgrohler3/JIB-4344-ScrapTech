# Pre-Requisites
### Hardware
  - Android Tablet (Preferably Galaxy Tab A9+ or Newer) <br>
  - [Purchase the Tablet Here](https://www.amazon.com/SAMSUNG-Android-Speakers-Upgraded-Graphite/dp/B0CLF3VPMV?tag=googhydr-20&source=dsa&hvcampaign=electronics&gbraid=0AAAAA-b0EosaL1JePXRt0olLzoyRqaGP6&gclid=Cj0KCQjw2ZfABhDBARIsAHFTxGzHadUVNLCBMxvn6oQlxMN39TdUmvcu2mOzkYthpyO7RDxR7TaJ8QcaAm2YEALw_wcB&th=1)
### Software
  - Ensure device's Android OS is up-to-date.

# Libraries
- No external libraries are needed to be installed.
- Provided APK (Android Application Package) will handle all neccesary installations internally.

# Download Instructions
### Developer Installation (Release/Production Build)
<!-- Assuming you have all the necessary modules and ADK installed. -->
- Expo Build (Using Expo Cloud in [(expo.dev)](https://expo.dev)) [~15-25 mins]
  - Pre-Requisites
    1. Create an account on [(expo.dev)](https://expo.dev)) & Connect using `eas login`
    2. Populate `"apiKey": "KEY"` in `app.json` with Google Maps API key - [React Native Maps](https://docs.expo.dev/versions/latest/sdk/map-view/#create-an-api-key)
    3. Ensure all dependencies are correct using: `npx expo-doctor`
    4. Create Android prebuild using: `npx expo prebuild --clean`
  - Installation
    - To build development, use: `eas build --platform android --profile development`
    - To build production, use: `eas build --platform android`

- Android Build (Using Gradle) [~15~25 mins]
  - Pre-Requisites #1 (Getting Code Files)
    1. Ensure CMake is up-to-date; If necessary, update from Android Studio.
    2. Download `.zip` of the latest code from [GitHub Repo - JIB-4344-ScrapTech](https://github.com/cgrohler3/JIB-4344-ScrapTech)
    3. Copy/unzip `ScrapApp` folder into the root folder (`C:/` in Windows).
    4. Copy `lib` folder from provided developer files into `ScrapApp/`, where `lib/firebaseConfig.js` is the config file.
    5. In `ScrapApp/`, perform `npm install` using Powershell to install the necessary files/packages.
    6. In the same folder, perform `npx expo install --check` to update packages to the most stable version for the build.
    
  - Pre-Requisites #2 (Setting Up For Release Build)
    1. In `ScrapApp/`, create Android prebuild using: `npx expo prebuild --clean`, which created `android` folder.
    2. Copy `apk-build.keystore` into `android/app` from provided developer files.
    3. Replace `build.gradle` in `android/app` with the provided developer gradle file.
        - If you change the project, after prebuild, ensure the build gradle file is updated to include code listed in `build.gradle TO ADD.png`.
    4. Copy the last 4 lines in `gradle.properties` from `Developer Notes` into `android/gradle.properties` file.
        - If you change the project, after prebuild, ensure the gradle properties file is updated to include code listed in `gradle.properties TO ADD.png`.
    5. Replace `"apiKey": "KEY"` in `app.json`  with `Maps Platform API Key`.
    6. Replace `KEY` in `<meta-data android:name="com.google.android.geo.API_KEY" android:value="KEY"/>` in `android/app/src/main/AndroidManifest.xml` with `Maps Platform API Key`.
        - `Maps Platform API Key` can be retireved from the Google Cloud - Scraplanta Dashboard.

    - USEFUL RESOURCES FOR BUILD SETUP
      - [[Create Keystore & Setting Up Local Files for Build]](https://docs.expo.dev/guides/local-app-production/)
        - If you create a new keystore:
          1. Ensure to replace `apk-build.keystore` with this new file.
          2. Ensure to add this keystore's `SHA-1` to the `Maps Platform API Key` in Google Cloud.
        - Key commands for this are located in `Developer Notes.txt` in developer folder.
      - [[Creating API Key for Google Maps & Registering App in Google Cloud]](https://docs.expo.dev/versions/latest/sdk/map-view/#create-an-api-key)
  - Installation
      1. When in the ScrapApp folder, perform: `cd android`
      2. Then, perform: `./gradlew assembleRelease`

- NOTE: Ensure that `lib/firebaseConfig.js` & `node_modules` directories exist in `ScrapApp` before building.
- NOTE: Always prebuild before building (regardless of changes) to ensure build is up-to-date.
### Accessing the Download
- Expo Build
  1. Visit [(expo.dev)](https://expo.dev), and login.
  2. In the left navigation, select `Projects`, then select `ScrapApp`
  3. In the left navigation, select `Builds`, then select `All Builds`
  4. Select the build with profile name of `production`
  5. `Install` by scaning the QR code or `Download build` to dowload file directly to your current device.
- Android Build
  1. Once the gradle build finishes downloading, access: `android/app/build/outputs/apk/release`
  2. The `.apk` file that exists here is the completed APK build file.

# Installing the App
1. Once you acquire the `.apk` download file, export it to the device that you want to install the application on.
2. Download the `.apk` file onto the device.
3. Click on the `.apk` file to start the application download.

# Running the App
- Once the APK finishes downloading, the user can simply access & start using the app.
- No additional execution is neccesary to interact with the app.

# Troubleshooting
### Install Errors
- If the download is corrupted, meaning APK is not downloading the application: user needs to rebuild the application again and follow the install process using the new APK.
- If APK is corrupted, again, rebuild the application to generate a new APK, and follow the install process above.
### Running Errors
- If application is slow or struck, then simply close and repon the app on the device. This is the recommended solution for most errors when running the app.

### NOTE: If further help is needed, please contact us using our provided contact.