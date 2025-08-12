import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App";

test("renders Math Attack text", () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
    );
    const mathAttackText = screen.getByText(/Math Attack/i);
    expect(mathAttackText).toBeDefined();
});
