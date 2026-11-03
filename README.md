# HASAN’s COLLECTION: Staff Orders

A separate website where staff see the orders placed on the customer website. Built with plain HTML and JavaScript.

## What it does
- Opens with a password screen.
- Shows every order: customer details, delivery address, items, payment method, transaction ID, payment screenshot and total.
- Change an order's status (New, Confirmed, Shipped, Delivered, Cancelled), filter by status and search by name, phone or order number.
- Dark and light theme.

## Set up
1. Create a new GitHub repository (for example `hasans-staff`), upload all files from this zip and turn on GitHub Pages.
2. Open `firebase-config.js` and paste the **same** Firebase config you used in the customer website.
3. In Firebase, open Firestore Database > Rules, paste the contents of `firestore.rules` and click Publish.
4. Open your staff site link and enter the password. To change the password, edit `STAFF_PASSWORD` in `firebase-config.js`.

## Security note
The password is checked in the browser, so it keeps casual visitors out but is not strong protection. Keep the staff link private. For stronger protection, add Firebase Authentication for staff.
# hc-orders-x7k2
