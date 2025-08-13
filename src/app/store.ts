import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./features/game4Slice";
import userReducer from "./features/userSlice";

export const store = configureStore({
    reducer: {
        game: gameReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
