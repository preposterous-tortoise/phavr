Google Play Checklist

[ ] Run cordova plugin rm cordova-plugin-console
[ ] Comment out the "CLICK HERE FOR BROWSER" element in login.html
[ ] Record the Github commit sha for this version of the app
[ ] Make sure the automated and manual tests pass

[ ] Increment the version number in manifest.xml
/client/platforms/android/build/intermediates/manifests/full/release/AndroidManifest.xml

$ cordova build --release android

$ cd drakeapp/client/platforms/android/build/outputs/apk/

$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name

$ $ANDROID_HOME/build-tools/22.0.1/zipalign -v 4 android-release-unsigned.apk Phavr.apk