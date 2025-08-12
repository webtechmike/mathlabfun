import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: {
            uid: "",
            name: "",
            winningStreak: 0,
            superStreak: 0,
            dailyStreak: 0,
            lastLoginDate: null,
            totalCorrectAnswers: 0,
            totalQuestionsAnswered: 0,
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
    },
});

export const { 
    setCurrentUser, 
    setIsNewSignUp, 
    setIsLoggedIn, 
    updateDailyStreak, 
    updateLastLoginDate, 
    updateSuperStreak 
} = userSlice.actions;

export default userSlice.reducer;

export type UserState = any;
