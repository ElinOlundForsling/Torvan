/* eslint-disable guard-for-in */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.updateAccess = functions.firestore
  .document("users/{accessId}")
  .onUpdate((change, context) => {
    const customClaims = {
      isAdmin: true,
    };

    // Set custom user claims on this update.
    return admin
      .auth()
      .setCustomUserClaims(context.params.accessId, customClaims)
      .then(() => {
        console.log("Done!");
      })
      .catch((error) => {
        console.log(error);
      });
  });

exports.addAdminRole = functions.https.onCall((data, context) => {
  // get user and add custom claim
  console.log(data);
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        isAdmin: true,
      });
    })
    .then(() => {
      return {
        message: `success ${data.email} has been made an admin`,
      };
    })
    .catch((err) => {
      return err;
    });
});
