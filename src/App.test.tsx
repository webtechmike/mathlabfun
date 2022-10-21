import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Math Attack text", () => {
    render(<App />);
    const mathAttackText = screen.getByText(/Math Attack/i);
    expect(mathAttackText).toBeInTheDocument();
});
