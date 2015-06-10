

1.  Increment the version number in manifest.xml
/client/platforms/android/build/intermediates/manifests/full/release/AndroidManifest.xml
2.  Run cordova plugin rm cordova-plugin-console
3.  Comment out the "CLICK HERE FOR BROWSER" element in login.html
4.  Record the Github commit sha for this version of the app
5.  Make sure the automated and manual tests pass