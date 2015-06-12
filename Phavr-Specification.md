Phavr-Specification.md

This document is a list of functionality that needs to be verified before each Play Store submission


###Profile/Notifications/Settings - Kaivon

**User/Login**
- [] The fbLogin is responsible for Facebook authentication for the user, do not remove it from the button.
- [] Store the user's token in the local storage for persistent login, remove on logout.
- [] Shouldn't have the button bar in the login page
- [] Shouldn't be navigated to from anywhere inside the main application

**Profile**
- [] No voting on the profile page. That would be silly.
- [] Should have the user's name, photo, and favors

**Push notifications**
- [] There should be a list of all the recent push notifications
- [] Have preferences for the notifications as to not annoy the user

Home Feed - Moriah


##Favor Map - Frank

- [ ] The Favor Map should populate in less than 1 second
Each Favor within the map's boundaries should have an icon corresponding to its distance from the user:
- [ ] less than 5 miles: camera icon anchored at center point
- [ ] more than 5 miles: standard marker anchored at the base point

- [ ] Clicking on a Favor icon should redirect you to the favor details page for the clicked Favor


Favor Details - Moriah


Favor Creation - Frank

- [ ] The Favor Creation view should have a map with a marker showing the user's current position
- [ ] The default marker should be labeled "You are here"
Below the map there will be the following input fields
- [ ] Google maps search auto-complete
- [ ] Favor topic (required)
- [ ] Favor description (required)

- [ ] If the topic or description is missing the submit should be disabled
- [ ] Choosing auto-complete dropdown items should cause navigation to the corresponding place marked by a camera icon.
- [ ] The previous marker should be removed.




Voting - Kaivon