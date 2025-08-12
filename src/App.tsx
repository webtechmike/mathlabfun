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
    return (
        <div className="App stars">
            <Router>
                <header>
                    <Link to={`${currentUser.isLoggedIn ? "/game" : "/"}`}>
                        <FontAwesomeIcon
                            size="2x"
                            icon={
                                currentUser.isLoggedIn
                                    ? faUserAstronaut
                                    : faUserSecret
                            }
                        />
                    </Link>
                </header>
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
