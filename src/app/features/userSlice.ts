import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: {
            uid: "",
            name: "",
            email: "",
            scoreStreak: 0, // Current consecutive correct answers
            bestScoreStreak: 0, // Best streak ever achieved
            superStreak: 0,
            dailyStreak: 0,
            lastLoginDate: null,
            totalCorrectAnswers: 0,
            totalQuestionsAnswered: 0,
            spacebucks: 0, // New field for tracking earnings
            isLoggedIn: false,
            isNewSignUp: false,
        },
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = { ...state.currentUser, ...action.payload };
        },
        setIsNewSignUp: (state, action) => {
            state.currentUser.isNewSignUp = !!action.payload;
        },
        setIsLoggedIn: (state, action) => {
            state.currentUser.isLoggedIn = !!action.payload;
        },
        updateDailyStreak: (state, action) => {
            state.currentUser.dailyStreak = action.payload;
        },
        updateLastLoginDate: (state, action) => {
            state.currentUser.lastLoginDate = action.payload;
        },
        updateSuperStreak: (state, action) => {
            state.currentUser.superStreak = action.payload;
        },
        updateScoreStreak: (state, action) => {
            state.currentUser.scoreStreak = action.payload;
            // Update best streak if current streak is higher
            if (action.payload > state.currentUser.bestScoreStreak) {
                state.currentUser.bestScoreStreak = action.payload;
            }
        },
        updateBestScoreStreak: (state, action) => {
            state.currentUser.bestScoreStreak = action.payload;
        },
        updateSpacebucks: (state, action) => {
            state.currentUser.spacebucks = action.payload;
        },
        addSpacebucks: (state, action) => {
            state.currentUser.spacebucks += action.payload;
        },
        updateTotalCorrectAnswers: (state, action) => {
            state.currentUser.totalCorrectAnswers = action.payload;
        },
        updateTotalQuestionsAnswered: (state, action) => {
            state.currentUser.totalQuestionsAnswered = action.payload;
        },
    },
});

export const {
    setCurrentUser,
    setIsNewSignUp,
    setIsLoggedIn,
    updateDailyStreak,
    updateLastLoginDate,
    updateSuperStreak,
    updateScoreStreak,
    updateBestScoreStreak,
    updateSpacebucks,
    addSpacebucks,
    updateTotalCorrectAnswers,
    updateTotalQuestionsAnswered,
} = userSlice.actions;

export default userSlice.reducer;

export interface User {
    uid: string;
    name: string;
    email: string;
    scoreStreak: number;
    bestScoreStreak: number;
    superStreak: number;
    dailyStreak: number;
    lastLoginDate: Date | null;
    totalCorrectAnswers: number;
    totalQuestionsAnswered: number;
    spacebucks: number;
    isLoggedIn: boolean;
    isNewSignUp: boolean;
}

export interface UserState {
    user: {
        currentUser: User;
    };
}
