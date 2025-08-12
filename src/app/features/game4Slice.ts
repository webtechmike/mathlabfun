import { createSlice } from "@reduxjs/toolkit";

export const game4Slice = createSlice({
    name: "game",
    initialState: {
        currentQuestion: {
            input1: undefined,
            input2: undefined,
            operator: {
                symbol: "",
                label: "",
            },
            hint: "",
        },
        realAnswer: "",
        currentAnswer: "",
        correct: false,
        helpCount: 0,
        winningStreak: 0,
        superStreak: 0,
        showHint: false,
        decision: "",
    },
    reducers: {
        setCurrentQuestion: (state, action) => {
            state.currentQuestion = action.payload;
        },
        setRealAnswer: (state, action) => {
            state.realAnswer = action.payload;
        },
        setCurrentAnswer: (state, action) => {
            state.currentAnswer = action.payload;
        },
        setDecision: (state, action) => {
            state.decision = action.payload;
        },
        setShowHint: (state, action) => {
            state.showHint = action.payload;
        },
        setHelpCount: (state, action) => {
            state.helpCount = action.payload;
        },
        setCorrect: (state, action) => {
            state.correct = action.payload;
        },
        setSuperStreak: (state, action) => {
            state.superStreak = action.payload;
        },
        setWinningStreak: (state, action) => {
            state.winningStreak = action.payload;
        },
    },
});

export const {
    setCurrentQuestion,
    setRealAnswer,
    setCurrentAnswer,
    setDecision,
    setShowHint,
    setHelpCount,
    setCorrect,
    setWinningStreak,
} = game4Slice.actions;

export default game4Slice.reducer;
