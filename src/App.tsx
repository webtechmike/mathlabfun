import { useState } from "react";
import { firebaseConfig } from "./.firebaseConfig";
import Spaceship from "./components/Spaceship";
import Game4 from "./components/Game4";
import "./App.css";
import "./styles.scss";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
    return (
        <div className="App">
            <div className="stars">
                <Spaceship />
                <Game4 level="1" />
                <span className="copyright">&copy; Mathlab.fun</span>
            </div>
        </div>
    );
}

export default App;
