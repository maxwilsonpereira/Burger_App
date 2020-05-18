// SPA Authentication in general:
// https://stormpath.com/blog/token-auth-spa
// Firebase authentication REST API:
// https://firebase.google.com/docs/reference/rest/auth/

// YOU CAN NAME IT auth.js
import axios from "axios";

import * as actionTypes from "./actionTypes";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  // ***** LOCAL STORAGE (BROWSER) *****
  // LOCAL STORAGE (CLEARING IT):
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  return { type: actionTypes.AUTH_LOGOUT };
};

// AUTO logout function acording to the response.data.expiresIn,
// Time the idToken will be valid. Firebase has determined this.
export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      // dispatch will call logout() AFTER setTimeout() is done!
      dispatch(logout());
      // expirationTime * 1000 to turn milliseconds into seconds:
    }, expirationTime * 1000);
  };
};

// MUST DO:
// 1- Inside the Firebase App-Project, go to Authentication:
// On Sign in Method: Click on "E-mail/senha" and make it ACTIVE.
// API_KEY: Firebase/YourProject/"GEAR-ICON"_Project Configuration: There you will find it!
export const authentication = (email, password, isSignup) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    // ADD SIGNUP USER:
    // URL FROM: https://firebase.google.com/docs/reference/rest/auth
    // SERCH FOR: "Sign up with email / password" --> Endpoint.
    // "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]"
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOU_FIREBASE_KEY";

    // SIGNIN USER:
    // URL FROM: https://firebase.google.com/docs/reference/rest/auth
    // SERCH FOR: "Sign in with email / password" --> Endpoint.
    // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
    if (!isSignup) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOU_FIREBASE_KEY";
    }

    axios
      .post(url, authData)
      .then((response) => {
        // console.log(response);
        // expirationDate will get a date with the time + expiresIn:
        // (* 1000 to transform milliseconds in seconds)
        const expirationDate = new Date(
          // Next line will return the expiration TIME:
          new Date().getTime() + response.data.expiresIn * 1000
        );
        // ***** LOCAL STORAGE (BROWSER) *****
        // LOCAL STORAGE it's built on the browser
        // Check Local Storage:
        // Browser: Inspect/Application/Local Store
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("userId", response.data.localId);
        // ITEMS will be removed on export const logout = ()!
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        // response.data.expiresIn comes with the response from the server.
        // Its the expiration time for the idToken.
        dispatch(checkAuthTimeout(response.data.expiresIn));
        // FIND The Users at: Firebase/Project/Authentication/Users
      })
      .catch((err) => {
        // You can get the error message and print at:
        // res.data.error.message
        // Can check it on console.log
        // *** err HAS ALSO response!
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

// APP.JS is the best place to check if user already logged!
// authCheckState will be called there!
export const authCheckState = () => {
  return (dispatch) => {
    // ***** LOCAL STORAGE (BROWSER) *****
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
