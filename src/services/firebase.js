import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    updateDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../.firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                dailyStreak: 0,
                superStreak: 0,
                scoreStreak: 0,
                bestScoreStreak: 0,
                lastLoginDate: null,
                totalCorrectAnswers: 0,
                totalQuestionsAnswered: 0,
                spacebucks: 0,
            });
        } else {
            // Update existing user's streak data
            const userDoc = docs.docs[0];
            const userData = userDoc.data();
            const today = new Date().toDateString();
            const lastLogin = userData.lastLoginDate
                ? new Date(userData.lastLoginDate).toDateString()
                : null;

            let newDailyStreak = userData.dailyStreak || 0;
            let newSuperStreak = userData.superStreak || 0;

            // Only update streak if user hasn't logged in today
            if (lastLogin !== today) {
                if (
                    lastLogin ===
                    new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
                ) {
                    // User logged in yesterday, increment streak
                    newDailyStreak += 1;
                } else if (lastLogin !== null) {
                    // User missed a day, reset streak
                    newDailyStreak = 1;
                    newSuperStreak = 0;
                } else {
                    // First time login
                    newDailyStreak = 1;
                }

                // Super streak is activated when daily streak reaches 3
                if (newDailyStreak >= 3) {
                    newSuperStreak = newDailyStreak;
                }

                await updateDoc(userDoc.ref, {
                    dailyStreak: newDailyStreak,
                    superStreak: newSuperStreak,
                    lastLoginDate: new Date().toISOString(),
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
    }
};

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
            dailyStreak: 0,
            superStreak: 0,
            lastLoginDate: null,
            totalCorrectAnswers: 0,
            totalQuestionsAnswered: 0,
        });
    } catch (err) {
        console.error(err);
    }
};

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("PASSWORD RESET SENT TO:", email);
    } catch (err) {
        console.error(err);
    }
};

const logout = () => {
    signOut(auth);
};

// Super Streak Functions
const checkAndUpdateDailyStreak = async (userId) => {
    try {
        // Query user by UID since we don't have the document ID
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("User document not found");
            return { dailyStreak: 0, superStreak: 0 };
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const today = new Date().toDateString();
        const lastLogin = userData.lastLoginDate
            ? new Date(userData.lastLoginDate).toDateString()
            : null;

        let newDailyStreak = userData.dailyStreak || 0;
        let newSuperStreak = userData.superStreak || 0;

        if (lastLogin === today) {
            // User already logged in today, no streak update needed
            return { dailyStreak: newDailyStreak, superStreak: newSuperStreak };
        }

        if (
            lastLogin ===
            new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
        ) {
            // User logged in yesterday, increment streak
            newDailyStreak += 1;
        } else if (lastLogin !== null) {
            // User missed a day, reset streak
            newDailyStreak = 1;
            newSuperStreak = 0; // Reset super streak when daily streak is broken
        } else {
            // First time login
            newDailyStreak = 1;
        }

        // Super streak is activated when daily streak reaches 3
        // and continues as long as daily streak is maintained
        if (newDailyStreak >= 3) {
            newSuperStreak = newDailyStreak;
        }

        // Update user document using the document ID
        await updateDoc(userDoc.ref, {
            dailyStreak: newDailyStreak,
            superStreak: newSuperStreak,
            lastLoginDate: new Date().toISOString(),
        });

        return { dailyStreak: newDailyStreak, superStreak: newSuperStreak };
    } catch (error) {
        console.error("Error updating daily streak:", error);
        return { dailyStreak: 0, superStreak: 0 };
    }
};

const getUserStreakData = async (userId) => {
    try {
        // Query user by UID
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { dailyStreak: 0, superStreak: 0 };
        }

        const userData = querySnapshot.docs[0].data();
        return {
            dailyStreak: userData.dailyStreak || 0,
            superStreak: userData.superStreak || 0,
        };
    } catch (error) {
        console.error("Error getting user streak data:", error);
        return { dailyStreak: 0, superStreak: 0 };
    }
};

// Spacebucks and Score Streak Functions
const updateUserScoreStreak = async (userId, scoreStreak, bestScoreStreak) => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("User document not found");
            return false;
        }

        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, {
            scoreStreak: scoreStreak,
            bestScoreStreak: bestScoreStreak,
        });

        return true;
    } catch (error) {
        console.error("Error updating score streak:", error);
        return false;
    }
};

const addSpacebucksToUser = async (userId, amount) => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("User document not found");
            return false;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const currentSpacebucks = userData.spacebucks || 0;
        const newSpacebucks = currentSpacebucks + amount;

        await updateDoc(userDoc.ref, {
            spacebucks: newSpacebucks,
        });

        return newSpacebucks;
    } catch (error) {
        console.error("Error adding spacebucks:", error);
        return false;
    }
};

const updateUserStats = async (userId, stats) => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("User document not found");
            return false;
        }

        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, stats);

        return true;
    } catch (error) {
        console.error("Error updating user stats:", error);
        return false;
    }
};

const getUserData = async (userId) => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const userData = querySnapshot.docs[0].data();
        console.log("Raw Firebase user data:", userData);
        console.log("bestScoreStreak in Firebase:", userData.bestScoreStreak);

        // Ensure bestScoreStreak exists, default to 0 if not present
        if (userData.bestScoreStreak === undefined) {
            userData.bestScoreStreak = 0;
            console.log("bestScoreStreak was undefined, set to 0");
        }

        return userData;
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
};

const migrateUserData = async (userId) => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No user document found for migration");
            return false;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        console.log("Migration check - user data:", userData);
        console.log(
            "bestScoreStreak exists:",
            userData.bestScoreStreak !== undefined
        );

        // If bestScoreStreak doesn't exist, we need to migrate this user
        if (userData.bestScoreStreak === undefined) {
            console.log("Migrating user data for:", userId);

            // For existing users, we'll set bestScoreStreak to their totalCorrectAnswers
            // as a reasonable starting point (they likely had some streak)
            const estimatedBestStreak = Math.max(
                1,
                Math.floor(userData.totalCorrectAnswers / 2)
            );

            console.log("Setting bestScoreStreak to:", estimatedBestStreak);

            await updateDoc(userDoc.ref, {
                bestScoreStreak: estimatedBestStreak,
                scoreStreak: 0, // Reset current streak
            });

            console.log(
                "Migration completed. Set bestScoreStreak to:",
                estimatedBestStreak
            );
            return true;
        } else {
            console.log(
                "User already has bestScoreStreak:",
                userData.bestScoreStreak
            );
        }

        return false;
    } catch (error) {
        console.error("Error migrating user data:", error);
        return false;
    }
};

export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    checkAndUpdateDailyStreak,
    getUserStreakData,
    updateUserScoreStreak,
    addSpacebucksToUser,
    updateUserStats,
    getUserData,
    migrateUserData,
};
