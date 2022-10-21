import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./features/game4Slice";

export default configureStore({
    reducer: {
        game: gameReducer,
    },
});
