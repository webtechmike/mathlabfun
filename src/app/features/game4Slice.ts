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
        scoreStreak: 0, // Renamed from winningStreak
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
        setScoreStreak: (state, action) => {
            state.scoreStreak = action.payload;
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
    setScoreStreak,
    setSuperStreak,
} = game4Slice.actions;

export default game4Slice.reducer;
