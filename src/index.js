import React from "react";
import ReactDOM from "react-dom";
import CardList from "./CardList";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";

import "./index.css";

const store = createStore(rootReducer, applyMiddleware(thunk));

function App() {
    return (
        <div className="App">
            <CardList />
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);
