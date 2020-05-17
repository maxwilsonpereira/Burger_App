// INSTALL: npm i axios
import axios from "axios";

// Firebase: https://console.firebase.google.com/
const instance = axios.create({
  baseURL: "https://react-my-burger-e6fac.firebaseio.com/",
});

export default instance;
