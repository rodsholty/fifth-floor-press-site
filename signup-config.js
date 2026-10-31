/* Newsletter endpoint.
   Leave this an empty string until the Google Apps Script web app
   is deployed. While it is empty, the form tells visitors that
   signups are opening soon and does not pretend to save anything.

   After deploy, paste the /exec URL between the quotes:
   var SIGNUP_ENDPOINT = "https://script.google.com/macros/s/DEPLOYMENT_ID/exec";

   Steps live in backend/apps-script/DEPLOY.md.

   Preview the form states by adding a query to any page with the form:
   ?signup=soon  ?signup=success  ?signup=error */
var SIGNUP_ENDPOINT = "";
