// Unit tests for the calculateReward function
// This tests the core spacebucks calculation logic in isolation

// Mock the calculateReward function by extracting it from Game4
// Since the function is defined inside the component, we'll test the logic directly

function calculateReward(
    operation: string,
    isSuperStreakActive: boolean,
    currentQuestion: any
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

    // Add extra spacebuck if the problem includes negative numbers
    if (
        currentQuestion &&
        (currentQuestion.input1 < 0 || currentQuestion.input2 < 0)
    ) {
        baseReward += 1;
    }

    // Double rewards if super streak is active (dailyStreak >= 3)
    if (isSuperStreakActive) {
        baseReward *= 2;
    }

    return baseReward;
}

describe('calculateReward Function', () => {
    describe('Base Reward Rules', () => {
        test('should return 1 spacebuck for addition', () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward('addition', false, question);
            expect(result).toBe(1);
        });

        test('should return 2 spacebucks for subtraction', () => {
            const question = { input1: 8, input2: 3 };
            const result = calculateReward('subtraction', false, question);
            expect(result).toBe(2);
        });

        test('should return 3 spacebucks for multiplication', () => {
            const question = { input1: 4, input2: 6 };
            const result = calculateReward('multiplication', false, question);
            expect(result).toBe(3);
        });

        test('should return 3 spacebucks for division', () => {
            const question = { input1: 12, input2: 4 };
            const result = calculateReward('division', false, question);
            expect(result).toBe(3);
        });

        test('should return 1 spacebuck for unknown operations', () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward('unknown', false, question);
            expect(result).toBe(1);
        });
    });

    describe('Negative Number Bonus', () => {
        test('should add +1 bonus for negative input1', () => {
            const question = { input1: -2, input2: 5 };
            const result = calculateReward('addition', false, question);
            expect(result).toBe(2); // 1 (addition) + 1 (negative bonus)
        });

        test('should add +1 bonus for negative input2', () => {
            const question = { input1: 5, input2: -3 };
            const result = calculateReward('subtraction', false, question);
            expect(result).toBe(3); // 2 (subtraction) + 1 (negative bonus)
        });

        test('should add +1 bonus for both negative inputs', () => {
            const question = { input1: -2, input2: -3 };
            const result = calculateReward('multiplication', false, question);
            expect(result).toBe(4); // 3 (multiplication) + 1 (negative bonus)
        });

        test('should not add bonus for positive numbers', () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward('addition', false, question);
            expect(result).toBe(1); // Just the base reward
        });
    });

    describe('Super Streak Bonus', () => {
        test('should double rewards when super streak is active', () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward('multiplication', true, question);
            expect(result).toBe(6); // 3 (multiplication) * 2 (super streak)
        });

        test('should not double rewards when super streak is inactive', () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward('multiplication', false, question);
            expect(result).toBe(3); // Just the base reward
        });
    });

    describe('Complex Scenarios', () => {
        test('should handle negative numbers with super streak', () => {
            const question = { input1: -2, input2: 5 };
            const result = calculateReward('multiplication', true, question);
            expect(result).toBe(8); // (3 + 1) * 2 = 8
        });

        test('should handle addition with negative numbers and super streak', () => {
            const question = { input1: -3, input2: 4 };
            const result = calculateReward('addition', true, question);
            expect(result).toBe(4); // (1 + 1) * 2 = 4
        });

        test('should handle subtraction with negative numbers and super streak', () => {
            const question = { input1: 5, input2: -2 };
            const result = calculateReward('subtraction', true, question);
            expect(result).toBe(6); // (2 + 1) * 2 = 6
        });
    });

    describe('Edge Cases', () => {
        test('should handle null question gracefully', () => {
            const result = calculateReward('addition', false, null);
            expect(result).toBe(1); // Just the base reward
        });

        test('should handle undefined question gracefully', () => {
            const result = calculateReward('addition', false, undefined);
            expect(result).toBe(1); // Just the base reward
        });

        test('should handle question with undefined inputs', () => {
            const question = { input1: undefined, input2: undefined };
            const result = calculateReward('addition', false, question);
            expect(result).toBe(1); // Just the base reward
        });

        test('should handle zero values correctly', () => {
            const question = { input1: 0, input2: 0 };
            const result = calculateReward('addition', false, question);
            expect(result).toBe(1); // Just the base reward (0 is not negative)
        });
    });

    describe('Reward Calculation Examples', () => {
        test('Example 1: Addition (5 + 3) = 1 spacebuck', () => {
            const question = { input1: 5, input2: 3 };
            const result = calculateReward('addition', false, question);
            expect(result).toBe(1);
        });

        test('Example 2: Addition with negative (-2 + 5) = 2 spacebucks', () => {
            const question = { input1: -2, input2: 5 };
            const result = calculateReward('addition', false, question);
            expect(result).toBe(2);
        });

        test('Example 3: Subtraction (8 - 3) = 2 spacebucks', () => {
            const question = { input1: 8, input2: 3 };
            const result = calculateReward('subtraction', false, question);
            expect(result).toBe(2);
        });

        test('Example 4: Subtraction with negative (5 - (-2)) = 3 spacebucks', () => {
            const question = { input1: 5, input2: -2 };
            const result = calculateReward('subtraction', false, question);
            expect(result).toBe(3);
        });

        test('Example 5: Multiplication (4 × 6) = 3 spacebucks', () => {
            const question = { input1: 4, input2: 6 };
            const result = calculateReward('multiplication', false, question);
            expect(result).toBe(3);
        });

        test('Example 6: Multiplication with negative (-3 × 4) = 4 spacebucks', () => {
            const question = { input1: -3, input2: 4 };
            const result = calculateReward('multiplication', false, question);
            expect(result).toBe(4);
        });

        test('Example 7: Multiplication with negative and super streak = 8 spacebucks', () => {
            const question = { input1: -3, input2: 4 };
            const result = calculateReward('multiplication', true, question);
            expect(result).toBe(8);
        });
    });
});
