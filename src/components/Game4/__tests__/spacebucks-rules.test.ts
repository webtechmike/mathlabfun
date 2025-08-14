// Focused tests for spacebucks calculation rules
// This tests the core business logic without complex integration

// Import the actual calculateReward function logic
// Since it's defined inside the component, we'll recreate it here for testing

function calculateReward(
    operation: string,
    isSuperStreakActive: boolean,
    currentQuestion: any,
    level: number = 1
): number {
    let baseReward: number;

    switch (operation) {
        case "addition":
            baseReward = 1; // 1 spacebuck for addition
            break;
        case "subtraction":
            baseReward = 2; // 2 spacebucks for subtraction
            break;
        case "multiplication":
            baseReward = 3; // 3 spacebucks for multiplication
            break;
        case "division":
            baseReward = 3; // 3 spacebucks for division
            break;
        default:
            baseReward = 1;
    }

    // Add extra spacebuck if the result is negative (higher levels only)
    if (currentQuestion && currentQuestion.operator) {
        let result: number;
        const input1 = currentQuestion.input1;
        const input2 = currentQuestion.input2;

        switch (currentQuestion.operator.label) {
            case "addition":
                result = input1 + input2;
                break;
            case "subtraction":
                result = input1 - input2;
                break;
            case "multiplication":
                result = input1 * input2;
                break;
            case "division":
                result = input1 / input2;
                break;
            default:
                result = 0;
        }

        if (result < 0) {
            baseReward += 1;
        }
    }

    // Level-based bonus: Higher levels earn more spacebucks
    const levelBonus = Math.floor(level / 2); // Every 2 levels adds +1 spacebuck
    if (levelBonus > 0) {
        baseReward += levelBonus;
    }

    // Double rewards if super streak is active (dailyStreak >= 3)
    if (isSuperStreakActive) {
        baseReward *= 2;
    }

    return baseReward;
}

describe("Spacebucks Calculation Rules", () => {
    describe("Base Operation Rewards", () => {
        test("addition should award 1 spacebuck", () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward("addition", false, question);
            expect(result).toBe(1);
        });

        test("subtraction should award 2 spacebucks", () => {
            const question = { input1: 8, input2: 3 };
            const result = calculateReward("subtraction", false, question);
            expect(result).toBe(2);
        });

        test("multiplication should award 3 spacebucks", () => {
            const question = { input1: 4, input2: 6 };
            const result = calculateReward("multiplication", false, question);
            expect(result).toBe(3);
        });

        test("division should award 3 spacebucks", () => {
            const question = { input1: 12, input2: 4 };
            const result = calculateReward("division", false, question);
            expect(result).toBe(3);
        });
    });

    describe("Negative Result Bonus", () => {
        test("should add +1 bonus for negative result in subtraction", () => {
            const question = {
                input1: 7,
                input2: 8,
                operator: { label: "subtraction" },
            };
            const result = calculateReward("subtraction", false, question);
            expect(result).toBe(3); // 2 (subtraction) + 1 (negative result bonus)
        });

        test("should add +1 bonus for negative result in addition", () => {
            const question = {
                input1: -5,
                input2: 2,
                operator: { label: "addition" },
            };
            const result = calculateReward("addition", false, question);
            expect(result).toBe(2); // 1 (addition) + 1 (negative result bonus)
        });

        test("should add +1 bonus for negative result in multiplication", () => {
            const question = {
                input1: -2,
                input2: 3,
                operator: { label: "multiplication" },
            };
            const result = calculateReward("multiplication", false, question);
            expect(result).toBe(4); // 3 (multiplication) + 1 (negative result bonus)
        });

        test("should not add bonus for positive result", () => {
            const question = {
                input1: 5,
                input2: 3,
                operator: { label: "addition" },
            };
            const result = calculateReward("addition", false, question);
            expect(result).toBe(1); // Just the base reward
        });

        test("should not add bonus for zero result", () => {
            const question = {
                input1: 5,
                input2: 5,
                operator: { label: "subtraction" },
            };
            const result = calculateReward("subtraction", false, question);
            expect(result).toBe(2); // Just the base reward (subtraction)
        });
    });

    describe("Super Streak Bonus", () => {
        test("should double rewards when super streak is active", () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward("multiplication", true, question);
            expect(result).toBe(6); // 3 (multiplication) * 2 (super streak)
        });

        test("should not double rewards when super streak is inactive", () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward("multiplication", false, question);
            expect(result).toBe(3); // Just the base reward
        });
    });

    describe("Level-Based Bonus", () => {
        test("level 2 should add +1 bonus spacebuck", () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward("addition", false, question, 2);
            expect(result).toBe(2); // 1 (addition) + 1 (level 2 bonus)
        });

        test("level 4 should add +2 bonus spacebucks", () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward("addition", false, question, 4);
            expect(result).toBe(3); // 1 (addition) + 2 (level 4 bonus)
        });

        test("level 6 should add +3 bonus spacebucks", () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward("addition", false, question, 6);
            expect(result).toBe(4); // 1 (addition) + 3 (level 6 bonus)
        });

        test("level 1 should not add bonus", () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward("addition", false, question, 1);
            expect(result).toBe(1); // Just the base reward
        });
    });

    describe("Complex Scenarios", () => {
        test("multiplication with negative result and super streak = 8 spacebucks", () => {
            const question = {
                input1: -2,
                input2: 5,
                operator: { label: "multiplication" },
            };
            const result = calculateReward("multiplication", true, question);
            expect(result).toBe(8); // (3 + 1) * 2 = 8
        });

        test("addition with negative result and super streak = 4 spacebucks", () => {
            const question = {
                input1: -5,
                input2: 2,
                operator: { label: "addition" },
            };
            const result = calculateReward("addition", true, question);
            expect(result).toBe(4); // (1 + 1) * 2 = 4
        });

        test("subtraction with negative result and super streak = 6 spacebucks", () => {
            const question = {
                input1: 5,
                input2: 8,
                operator: { label: "subtraction" },
            };
            const result = calculateReward("subtraction", true, question);
            expect(result).toBe(6); // (2 + 1) * 2 = 6
        });

        test("level 4 with super streak = 10 spacebucks", () => {
            const question = {
                input1: 5,
                input2: 3,
                operator: { label: "multiplication" },
            };
            const result = calculateReward("multiplication", true, question, 4);
            expect(result).toBe(10); // (3 + 2) * 2 = 10
        });

        test("level 6 with negative result and super streak = 14 spacebucks", () => {
            const question = {
                input1: -2,
                input2: 5,
                operator: { label: "multiplication" },
            };
            const result = calculateReward("multiplication", true, question, 6);
            expect(result).toBe(14); // (3 + 1 + 3) * 2 = 14
        });
    });

    describe("Real-World Examples", () => {
        test("Example: Addition (5 + 3) = 1 spacebuck", () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward("addition", false, question);
            expect(result).toBe(1);
        });

        test("Example: Addition with negative result (-5 + 2) = 2 spacebucks", () => {
            const question = { input1: -5, input2: 2, operator: { label: "addition" } };
            const result = calculateReward("addition", false, question);
            expect(result).toBe(2);
        });

        test("Example: Subtraction (8 - 3) = 2 spacebucks", () => {
            const question = { input1: 8, input2: 3 };
            const result = calculateReward("subtraction", false, question);
            expect(result).toBe(2);
        });

        test("Example: Subtraction with negative result (2 - 5) = 3 spacebucks", () => {
            const question = { input1: 2, input2: 5, operator: { label: "subtraction" } };
            const result = calculateReward("subtraction", false, question);
            expect(result).toBe(3);
        });

        test("Example: Multiplication (4 × 6) = 3 spacebucks", () => {
            const question = { input1: 4, input2: 6 };
            const result = calculateReward("multiplication", false, question);
            expect(result).toBe(3);
        });

        test("Example: Multiplication with negative (-3 × 4) = 4 spacebucks", () => {
            const question = { input1: -3, input2: 4, operator: { label: "multiplication" } };
            const result = calculateReward("multiplication", false, question);
            expect(result).toBe(4);
        });

        test("Example: Multiplication with negative and super streak = 8 spacebucks", () => {
            const question = { input1: -3, input2: 4, operator: { label: "multiplication" } };
            const result = calculateReward("multiplication", true, question);
            expect(result).toBe(8);
        });
    });

    describe("Edge Cases and Error Handling", () => {
        test("should handle null question gracefully", () => {
            const result = calculateReward("addition", false, null);
            expect(result).toBe(1); // Just the base reward
        });

        test("should handle undefined question gracefully", () => {
            const result = calculateReward("addition", false, undefined);
            expect(result).toBe(1); // Just the base reward
        });

        test("should handle question with undefined inputs", () => {
            const question = { input1: undefined, input2: undefined };
            const result = calculateReward("addition", false, question);
            expect(result).toBe(1); // Just the base reward
        });

        test("should handle unknown operations gracefully", () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward("unknown", false, question);
            expect(result).toBe(1); // Default to 1 spacebuck
        });
    });
});
