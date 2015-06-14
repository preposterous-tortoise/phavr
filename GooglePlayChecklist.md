Google Play Checklist

- [ ] Run cordova plugin rm cordova-plugin-console
- [ ] Comment out the "CLICK HERE FOR BROWSER" element in login.html
- [ ] Record the Github commit sha for this version of the app
- [ ] Make sure the automated and manual tests pass
- [ ] Increment the version number in config.xml

Changes to config.xml are reflected in this manifest file:
   /client/platforms/android/build/intermediates/manifests/full/release/AndroidManifest.xml

$ cordova build --release android

$ cd client/platforms/android/build/outputs/apk/

$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name

// Frank has the password for the release key

$ $ANDROID_HOME/build-tools/22.0.1/zipalign -v 4 android-release-unsigned.apk Phavr.apk


Version  Sha
0.0.2    50a9da41e6bc8dea5a75d80c8a9b256036cc46a3