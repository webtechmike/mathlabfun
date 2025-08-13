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

// type ProtectedRouteProps = ReactFragment & {
//     isLoggedIn: boolean;
//     children: ReactNode;
// };
// const ProtectedRoute = ({ isLoggedIn, children }: ProtectedRouteProps) => {
//     if (!isLoggedIn) {
//         return <Navigate to="/" replace />;
//     }
//     return <div>{children}</div>;
// };

function App() {
    const { currentUser } = useSelector((state: UserState) => state.user);

    const renderUserHeader = () => {
        if (!currentUser.isLoggedIn) {
            return (
                <Link to="/">
                    <FontAwesomeIcon size="2x" icon={faUserSecret} />
                </Link>
            );
        }

        const isDoubleRewards = currentUser.dailyStreak >= 3;
        const rewardStatus = isDoubleRewards
            ? "Double Rewards"
            : "Regular Rewards";
        const rewardIcon = isDoubleRewards ? "🚀" : "⭐";

        return (
            <div className="user-header">
                <div className="user-info">
                    <div className="spacebucks-info">
                        <SpacebucksIcon />
                        <span className="spacebucks-count">
                            {currentUser.spacebucks || 0}
                        </span>
                    </div>
                    <div className="streak-info">
                        <span className="streak-label">🔥 SuperStreak</span>
                        <span className="streak-count">
                            {currentUser.superStreak || 0}
                        </span>
                    </div>
                    <div className="reward-status">
                        <span className="reward-icon">{rewardIcon}</span>
                        <span className="reward-text">{rewardStatus}</span>
                    </div>
                </div>
                <Link to="/game">
                    <FontAwesomeIcon size="2x" icon={faUserAstronaut} />
                </Link>
            </div>
        );
    };

    return (
        <div className="App stars">
            <Router>
                <header>{renderUserHeader()}</header>
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
            </Router>
        </div>
    );
}

export default App;
