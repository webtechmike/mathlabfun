import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./features/game4Slice";
import userReducer from "./features/userSlice";

export default configureStore({
    reducer: {
        game: gameReducer,
        user: userReducer,
    },
});
