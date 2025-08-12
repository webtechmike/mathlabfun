import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInwWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    setDoc,
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
                lastLoginDate: null,
                totalCorrectAnswers: 0,
                totalQuestionsAnswered: 0,
            });
        } else {
            // Update existing user's streak data
            const userDoc = docs.docs[0];
            const streakData = await checkAndUpdateDailyStreak(user.uid);
            await updateDoc(userDoc.ref, {
                dailyStreak: streakData.dailyStreak,
                superStreak: streakData.superStreak,
                lastLoginDate: new Date().toISOString(),
            });
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
        } else {
            // First time login
            newDailyStreak = 1;
        }

        // Check if super streak should be activated (3+ days)
        if (newDailyStreak >= 3) {
            newSuperStreak = Math.max(newSuperStreak, newDailyStreak);
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
};
