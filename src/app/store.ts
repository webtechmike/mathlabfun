import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import gameReducer from "./features/game4Slice";
import userReducer from "./features/userSlice";

// Configure persistence for user state
const userPersistConfig = {
    key: "user",
    storage,
    whitelist: [
        "currentUser"
    ], // Only persist the currentUser object
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
    reducer: {
        game: gameReducer,
        user: persistedUserReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
