##Phavr-Specification.md

This document is a list of functionality that needs to be verified before each Play Store submission


###Profile/Notifications/Settings - Kaivon

**User/Login**
- [ ] The fbLogin is responsible for Facebook authentication for the user, do not remove it from the button.
- [ ] Store the user's token in the local storage for persistent login, remove on logout.
- [ ] Shouldn't have the button bar in the login page
- [ ] Shouldn't be navigated to from anywhere inside the main application

**Profile**
- [ ] No voting on the profile page. That would be silly.
- [ ] Should have the user's name, photo, and favors

**Push notifications**
- [ ] There should be a list of all the recent push notifications
- [ ] Have preferences for the notifications as to not annoy the user

##Home Feed - Moriah

After logging in, the home feed is the first view users will see upon loading the app.

- [ ] should be populated within 1 second
- [ ] should display a list of all favors in an area
- [ ] should auto-refresh when the user navigates to the feed
- [ ] pulling down from the top should refresh the feed
- [ ] if no favors are available in the area, displays a short message instead
- [ ] each favor in the list displays a favor topic, description, votes and distance from the user.
- [ ] a camera icon will appear next to the favor if it is within 5mi of the user.
- [ ] if photos have been submitted to the favor, the photo with the highest number of votes is displayed.
- [ ] clicking the up and down arrows next to a favor will upvote or downvote the favor, respectively.
- [ ] if a favor is voted to -5, it is deleted from the database and removed from the homefeed.
- [ ] favors can be filtered by number of votes, recency or location.
- [ ] these filters are toggled/controlled from the footer bar.
- [ ] pressing the search icon reveals a search bar linked to google maps, which will auto-complete based on the entered parameters.
- [ ] clicking on a description or a photo will redirect the user to a favor details page.

##Favor Map - Frank

- [ ] The Favor Map should populate in less than 1 second
Each Favor within the map's boundaries should have an icon corresponding to its distance from the user:
- [ ] less than 5 miles: camera icon anchored at center point
- [ ] more than 5 miles: standard marker anchored at the base point
- [ ] Clicking on a Favor icon should redirect you to the favor details page for the clicked Favor

##Favor Details - Moriah

The favor details view displays information for a single favor, selected by the user. It can be accessed in three different ways.

- [ ] accessed by clicking on the description or top photo for a favor in the home feed
- [ ] accessed by clicking on a map marker in the favor map
- [ ] accessed by clicking on the favor description in a user's profile
- [ ] should auto-refresh after a photo upload
- [ ] pulling down from the top should refresh the feed
- [ ] displays the selected favor's address, topic, description, and all photos submitted for that favor.
- [ ] if the favor is within 5 mi of the user, a camera button is available in the footer to submit a photo.
- [ ] If a photo is uploaded there will be toast messages when the upload starts and finishes.
- [ ] There is also a toast message if the photo is cancelled
- [ ] photos each have their own set of votes displayed.
- [ ] photos can be upvoted or downvoted
- [ ] if a photo's votes drops below -5, it is removed from the database and details page.


##Favor Creation - Frank

- [ ] The Favor Creation view should have a map with a marker showing the user's current position
- [ ] The default marker should be labeled "You are here"
Below the map there will be the following input fields
- [ ] Google maps search auto-complete
- [ ] Favor topic (required)
- [ ] Favor description (required)

- [ ] If the topic or description is missing the submit should be disabled
- [ ] Choosing auto-complete dropdown items should cause navigation to the corresponding place marked by a camera icon.
- [ ] The previous marker should be removed.

##Voting - Kaivon

##Push Notifications - Frank

- [ ]  If the settings permit new photo notification then the user will be notified for each new photo submitted for their favors
- [ ]  If the settings permit new favor notification then the user will be notified for new favors created by other users within 2 miles of the user's current location
