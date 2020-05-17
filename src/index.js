import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import burgerBuilderReducer from "./store/reducers/burgerBuilder";
import orderReducer from "./store/reducers/order";
import authenticationReducer from "./store/reducers/authentication";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// DON'T SHOW DEVTOOLS in production mode:
// (process is a GLOBAL variable)
// (NODE_ENV is found on config/env.js)
// NOT sure if works the same for all apps.
// const composeEnhancers =
//   process.env.NODE_ENV === "development"
//     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//     : null || compose;

const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authenticationReducer,
});

// STORE Without DevTools:
// const store = createStore(reducer);
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
