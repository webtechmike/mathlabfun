import { firebaseConfig } from "../../.firebaseConfig";

import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";

import {
    useState,
    useRef,
    useEffect,
    useCallback,
    SyntheticEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    UserState,
    setCurrentUser,
    setIsNewSignUp,
    setIsLoggedIn,
    updateDailyStreak,
    updateSuperStreak,
    updateLastLoginDate,
} from "../../app/features/userSlice";
import {
    checkAndUpdateDailyStreak,
    signInWithGoogle,
} from "../../services/firebase";

import "./login.scss";

function Login() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: UserState) => state.user);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            const user = auth.currentUser;
            if (user) {
                const streakData = await checkAndUpdateDailyStreak(user.uid);
                dispatch(setCurrentUser(user));
                dispatch(setIsLoggedIn(true));
                dispatch(updateDailyStreak(streakData.dailyStreak));
                dispatch(updateSuperStreak(streakData.superStreak));
                dispatch(updateLastLoginDate(new Date().toISOString()));
                navigate("/game");
            }
        } catch (err: unknown) {
            console.error("Google sign-in error:", err);
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage(
                    "An unexpected error occurred during Google sign-in"
                );
            }
        }
    };

    const handleLogin = useCallback(
        (e: SyntheticEvent) => {
            e.preventDefault();
            setErrorMessage(""); // Clear any previous errors
            const emailInput = email.current!.value ?? "";
            const passwordInput = password.current!.value ?? "";

            const handleSignUp = async () => {
                try {
                    const res = await createUserWithEmailAndPassword(
                        auth,
                        emailInput,
                        passwordInput
                    );
                    console.log(
                        "🚀 ~ file: Login.tsx ~ line 52 ~ handleSignin ~ res",
                        res
                    );
                    const user = res.user;

                    // Check and update daily streak
                    const streakData = await checkAndUpdateDailyStreak(
                        user.uid
                    );

                    dispatch(setCurrentUser(user));
                    dispatch(setIsLoggedIn(true));
                    dispatch(updateDailyStreak(streakData.dailyStreak));
                    dispatch(updateSuperStreak(streakData.superStreak));
                    dispatch(updateLastLoginDate(new Date().toISOString()));

                    navigate("/game"); // Redirect to dashboard after successful signup
                } catch (err: unknown) {
                    console.error("SIGNUP ERROR BUDDaaY:", err);
                    if (err instanceof Error) {
                        setErrorMessage(err.message);
                    } else {
                        setErrorMessage(
                            "An unexpected error occurred during sign up"
                        );
                    }
                }
            };

            const handleSignin = async () => {
                try {
                    const res = await signInWithEmailAndPassword(
                        auth,
                        emailInput,
                        passwordInput
                    );
                    console.log(
                        "🚀 ~ file: Login.tsx ~ line 52 ~ handleSignin ~ res",
                        res
                    );
                    const user = res.user;

                    // Check and update daily streak
                    const streakData = await checkAndUpdateDailyStreak(
                        user.uid
                    );

                    dispatch(setCurrentUser(user));
                    dispatch(setIsLoggedIn(true));
                    dispatch(updateDailyStreak(streakData.dailyStreak));
                    dispatch(updateSuperStreak(streakData.superStreak));
                    dispatch(updateLastLoginDate(new Date().toISOString()));

                    navigate("/game"); // Redirect to dashboard after successful login
                } catch (err: unknown) {
                    console.error("SIGNUP ERROR BUDDaaY:", err);
                    if (err instanceof Error) {
                        setErrorMessage(err.message);
                    } else {
                        setErrorMessage(
                            "An unexpected error occurred during login"
                        );
                    }
                }
            };

            currentUser.isNewSignUp ? handleSignUp() : handleSignin();
        },
        [auth, currentUser.isNewSignUp, dispatch, navigate]
    );

    const toggleSignInType = useCallback(() => {
        dispatch(setIsNewSignUp(!currentUser.isNewSignUp));
        setErrorMessage(""); // Clear error when switching tabs
    }, [currentUser.isNewSignUp, dispatch]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log(
                "🚀 ~ file: App.tsx ~ line 68 ~ onAuthStateChanged ~ user",
                user,
                currentUser
            );
            // const userId = user && user.uid;
            // dispatch(setCurrentUser(user));
        });
    }, [auth, currentUser, dispatch]);

    return (
        <div className="login">
            <div className="signin-tabs" onChange={toggleSignInType}>
                <input id="signup" type="radio" name="signin-type" />
                <label
                    className={`signin-tab ${
                        currentUser.isNewSignUp && "checked"
                    }`}
                    htmlFor="signup"
                >
                    SIGN UP
                </label>
                <input
                    id="signin"
                    type="radio"
                    name="signin-type"
                    defaultChecked
                />
                <label
                    className={`signin-tab ${
                        !currentUser.isNewSignUp && "checked"
                    }`}
                    htmlFor="signin"
                >
                    LOGIN
                </label>
            </div>

            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}

            <form className="login-container" onSubmit={handleLogin}>
                <input type="email" ref={email} placeholder="Email" />
                <input type="password" ref={password} placeholder="Password" />

                <button type="submit">
                    {currentUser.isNewSignUp ? "SIGN UP" : "LOGIN"}
                </button>
            </form>

            <div className="divider">
                <span>OR</span>
            </div>

            <button className="google-signin-btn" onClick={handleGoogleSignIn}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </button>
        </div>
    );
}

export default Login;
