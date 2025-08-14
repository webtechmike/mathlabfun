import {
    Navigate,
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
} from "react-router-dom";

import Home from "./components/Home";

import Game4 from "./components/Game4";

import "./App.scss";
import "./outerspace.scss"; // @TOOD: themed stylesheets for v1
// import "./floral.scss";
// import "./mountain.scss";

import { useSelector } from "react-redux";
import { UserState } from "./app/features/userSlice";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpacebucksIcon from "./components/SpacebucksIcon/SpacebucksIcon";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Component to handle mobile detection inside Router context
function AppContent() {
    const { currentUser } = useSelector((state: UserState) => state.user);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Hide desktop header on mobile when in game
    const shouldHideHeader = isMobile && location.pathname === "/game";

    const renderUserHeader = () => {
        if (!currentUser.isLoggedIn) {
            return (
                <Link to="/">
                    <FontAwesomeIcon size="2x" icon={faUserSecret} />
                </Link>
            );
        }

        // const isDoubleRewards = currentUser.dailyStreak >= 3;
        // const rewardStatus = isDoubleRewards
        //     ? "Double Rewards"
        //     : "Regular Rewards";
        // const rewardIcon = isDoubleRewards ? "🚀" : "⭐";

        return (
            <div className="user-header">
                <div className="user-info">
                    <div className="spacebucks-info">
                        <SpacebucksIcon />
                        <span className="spacebucks-count">
                            {currentUser.spacebucks || 0}
                        </span>
                    </div>
                </div>
                <Link to="/game">
                    <FontAwesomeIcon size="2x" icon={faUserAstronaut} />
                </Link>
            </div>
        );
    };

    return (
        <>
            {!shouldHideHeader && <header>{renderUserHeader()}</header>}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/game"
                    element={
                        currentUser.isLoggedIn ? (
                            <Game4 level="1" />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Routes>
            <footer>
                <span className="copyright">&copy; Mathlab.fun</span>
            </footer>
        </>
    );
}

function App() {
    return (
        <div className="App stars">
            <Router>
                <AppContent />
            </Router>
        </div>
    );
}

export default App;
