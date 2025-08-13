import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocus } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import {
    setCurrentQuestion,
    setRealAnswer,
    setCurrentAnswer,
    setDecision,
    setCorrect,
    setScoreStreak,
    setShowHint,
    setHelpCount,
} from "../../app/features/game4Slice";
import {
    updateBestScoreStreak,
    addSpacebucks,
    updateTotalCorrectAnswers,
    updateTotalQuestionsAnswered,
} from "../../app/features/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleQuestion,
    faFireFlameCurved,
    faClock,
} from "@fortawesome/free-solid-svg-icons";
import {
    updateUserScoreStreak,
    addSpacebucksToUser,
    updateUserStats,
} from "../../services/firebase";
import "./game4.scss";
import Spaceship from "../Spaceship";

type GameProps = {
    level: string;
};

function Game4(props: GameProps) {
    // TODOS:
    // 2. PINNING THIS -> Create themes (i.e. outerspace, floral, mountain)
    // 3. Add user accounts
    // 4. Track usage
    // 5. Reward usage
    //    a. Earn regular credits for answering problems correctly { addition: 'pennies', subtraction: 'nickels', multiplication: 'dimes' }
    //    b. Earn bonus credits for winning streak ??? 10 correct answers in a row
    //    c. Earn bonus credits for every correct answer after winning streak activated
    //    d. Tournaments can earn parents a new dyson vaccuum ... much planning needed here.lol

    const [questionReset, setQuestionReset] = useState<boolean>(false);
    const [lastQuestion, setLastQuestion] = useState<string>("");
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const dispatch = useDispatch();
    const resetFocus = useFocus("answer"); // resets cursor focus to input with id "answer"

    // Use ref to store current user data to avoid dependency issues
    const currentUserRef = useRef<any>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const answeredQuestionRef = useRef<any>(null);

    const {
        currentQuestion,
        realAnswer,
        currentAnswer,
        correct,
        helpCount,
        showHint,
        scoreStreak,
        decision,
    } = useSelector((state: any) => state.game);

    const { currentUser } = useSelector((state: any) => state.user);

    // Timer effect
    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            // Time's up! Reset score streak but preserve best score
            setIsTimerRunning(false);
            if (currentUserRef.current?.isLoggedIn) {
                dispatch(setScoreStreak(0));
                // Update Firebase to reset score streak
                updateUserScoreStreak(
                    currentUserRef.current.uid,
                    0,
                    currentUserRef.current.bestScoreStreak || 0
                );
            }
            // Set a flag to generate new question on next render
            setQuestionReset(false);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isTimerRunning, timeLeft, dispatch]);

    // Start timer when new question is generated
    const startTimer = useCallback(() => {
        setTimeLeft(30);
        setIsTimerRunning(true);
    }, []);

    // Stop timer when answer is submitted
    const stopTimer = useCallback(() => {
        setIsTimerRunning(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    // Debug: Log current user data
    useEffect(() => {
        // Removed debugging logs for performance
    }, [currentUser]);

    // Update ref when currentUser changes
    useEffect(() => {
        currentUserRef.current = currentUser;
    }, [currentUser]);

    const generateQuestion = useCallback(() => {
        let newQuestion: any;
        let attempts = 0;
        const maxAttempts = 50; // Prevent infinite loops

        do {
            // Generate numbers from -10 to 10 to include negative numbers
            const input1 = Math.floor(Math.random() * 21) - 10;
            const input2 = Math.floor(Math.random() * 21) - 10;
            const decider = Math.floor(Math.random() * 101);

            const decide = (decidedBy: number): string => {
                if (decidedBy <= 33) {
                    dispatch(setDecision("addition"));
                    return "addition";
                } else if (decidedBy >= 34 && decidedBy < 66) {
                    dispatch(setDecision("subtraction"));
                    return "subtraction";
                } else if (decidedBy >= 67 && decidedBy < 101) {
                    dispatch(setDecision("multiplication"));
                    return "multiplication";
                } else {
                    dispatch(setDecision("addition"));
                    return "addition";
                }
            };

            const operation = decide(decider);

            if (operation === "addition") {
                newQuestion = {
                    input1,
                    input2,
                    operator: { symbol: "+", label: "addition" },
                    hint: generateHint((input1 + input2).toString()),
                };
                dispatch(setRealAnswer((input1 + input2).toString()));
            } else if (operation === "subtraction") {
                newQuestion = {
                    input1,
                    input2,
                    operator: { symbol: "-", label: "subtraction" },
                    hint: generateHint((input1 - input2).toString()),
                };
                dispatch(setRealAnswer((input1 - input2).toString()));
            } else if (decider >= 67 && decider < 101) {
                newQuestion = {
                    input1,
                    input2,
                    operator: { symbol: "x", label: "multiplication" },
                    hint: generateHint((input1 * input2).toString()),
                };
                dispatch(setRealAnswer((input1 * input2).toString()));
            } else {
                return `${decider} is not between 1 and 100`;
            }

            attempts++;
        } while (
            attempts < maxAttempts &&
            `${newQuestion.input1}${newQuestion.operator.symbol}${newQuestion.input2}` ===
                lastQuestion
        );

        // Update the last question and dispatch the new question
        const questionString = `${newQuestion.input1}${newQuestion.operator.symbol}${newQuestion.input2}`;
        setLastQuestion(questionString);
        dispatch(setCurrentQuestion(newQuestion));

        // Explicitly restart timer for new question
        startTimer();

        return newQuestion;
    }, [lastQuestion, dispatch, startTimer]);

    const generateHint = (answer: string) => {
        const theAnswer = parseInt(answer);
        const lowerRange = Math.floor(theAnswer / 10) * 10;
        const upperRange = Math.ceil(theAnswer / 10) * 10;
        if (answer.slice(-1) === "0") {
            return `A number between ${theAnswer - 5} and ${theAnswer + 5}`;
        } else {
            return `A number between ${lowerRange} and ${upperRange}`;
        }
    };

    const revealHint = () => {
        dispatch(setShowHint(true));
        resetFocus();
    };

    const handleHelpButtonClick = () => {
        if (helpCount === 0) {
            revealHint();
            dispatch(setHelpCount(helpCount + 1));
        } else if (helpCount === 1) {
            revealAnswer();
            resetHelpCount();
        }
    };

    const revealAnswer = () => {
        dispatch(setCurrentAnswer(realAnswer));
        resetFocus();
    };

    const resetHelpCount = () => {
        dispatch(setHelpCount(0));
    };

    // Calculate spacebucks reward based on operation type and streak status
    const calculateReward = (
        operation: string,
        isSuperStreakActive: boolean,
        currentQuestion: any
    ): number => {
        let baseReward: number;

        console.log("🔍 Spacebucks Calculation Debug:");
        console.log("Operation:", operation);
        console.log("Super Streak Active:", isSuperStreakActive);
        console.log("Question:", currentQuestion);

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

        console.log("Base reward:", baseReward);

        // Add extra spacebuck if the problem includes negative numbers
        if (
            currentQuestion &&
            (currentQuestion.input1 < 0 || currentQuestion.input2 < 0)
        ) {
            baseReward += 1;
            console.log(
                "Negative number bonus applied! New total:",
                baseReward
            );
        }

        // Double rewards if super streak is active (dailyStreak >= 3)
        if (isSuperStreakActive) {
            baseReward *= 2;
            console.log("Super streak bonus applied! Final total:", baseReward);
        }

        console.log("Final spacebucks reward:", baseReward);
        return baseReward;
    };

    // Handle correct answer and rewards
    const handleCorrectAnswer = useCallback(
        async (currentDecision: string, answeredQuestion: any) => {
            if (!currentUserRef.current.isLoggedIn) return;

            // Stop timer when answer is submitted
            stopTimer();

            const newScoreStreak = scoreStreak + 1;
            const currentBestStreak =
                currentUserRef.current.bestScoreStreak || 0;
            const newBestStreak = Math.max(currentBestStreak, newScoreStreak);
            const isSuperStreakActive = currentUserRef.current.dailyStreak >= 3;
            console.log("🎯 Answer Debug:");
            console.log("Current Decision:", currentDecision);
            console.log("Super Streak Active:", isSuperStreakActive);
            console.log("Daily Streak:", currentUserRef.current.dailyStreak);
            console.log("Answered Question:", answeredQuestion);

            const reward = calculateReward(
                currentDecision,
                isSuperStreakActive,
                answeredQuestion
            );

            // Batch state updates to prevent cascading re-renders
            const updates = {
                scoreStreak: newScoreStreak,
                bestScoreStreak: newBestStreak,
                spacebucks: (currentUserRef.current.spacebucks || 0) + reward,
                totalCorrectAnswers:
                    (currentUserRef.current.totalCorrectAnswers || 0) + 1,
                totalQuestionsAnswered:
                    (currentUserRef.current.totalQuestionsAnswered || 0) + 1,
            };

            // Update local state in batch
            dispatch(setScoreStreak(updates.scoreStreak));
            dispatch(updateBestScoreStreak(updates.bestScoreStreak));
            dispatch(addSpacebucks(reward));
            dispatch(updateTotalCorrectAnswers(updates.totalCorrectAnswers));
            dispatch(
                updateTotalQuestionsAnswered(updates.totalQuestionsAnswered)
            );

            // Update Firebase
            await updateUserScoreStreak(
                currentUserRef.current.uid,
                updates.scoreStreak,
                updates.bestScoreStreak
            );
            await addSpacebucksToUser(currentUserRef.current.uid, reward);
            await updateUserStats(currentUserRef.current.uid, {
                totalCorrectAnswers: updates.totalCorrectAnswers,
                totalQuestionsAnswered: updates.totalQuestionsAnswered,
            });

            // Restart timer for the score streak continuation
            startTimer();
        },
        [scoreStreak, dispatch, stopTimer, startTimer]
    );

    // Handle wrong answer
    const handleWrongAnswer = useCallback(async () => {
        if (!currentUserRef.current.isLoggedIn) return;

        // Stop timer when answer is submitted
        stopTimer();

        const newTotalQuestions =
            (currentUserRef.current.totalQuestionsAnswered || 0) + 1;
        const currentBestStreak = currentUserRef.current.bestScoreStreak || 0;

        // Reset only the current score streak, keep the best streak
        dispatch(setScoreStreak(0));
        dispatch(updateTotalQuestionsAnswered(newTotalQuestions));

        // Update Firebase - only reset current streak, preserve best streak
        await updateUserScoreStreak(
            currentUserRef.current.uid,
            0,
            currentBestStreak
        );
        await updateUserStats(currentUserRef.current.uid, {
            totalQuestionsAnswered: newTotalQuestions,
        });
    }, [dispatch, stopTimer]);

    // Create a simple question generator without dependencies
    const createInitialQuestion = useCallback(() => {
        const input1 = Math.floor(Math.random() * 11);
        const input2 = Math.floor(Math.random() * 11);
        const decider = Math.floor(Math.random() * 101);

        let newQuestion: any;
        let operation: string;

        if (decider <= 33) {
            operation = "addition";
            newQuestion = {
                input1,
                input2,
                operator: { symbol: "+", label: "addition" },
                hint: generateHint((input1 + input2).toString()),
            };
            dispatch(setRealAnswer((input1 + input2).toString()));
        } else if (decider >= 34 && decider < 66) {
            operation = "subtraction";
            newQuestion = {
                input1,
                input2,
                operator: { symbol: "-", label: "subtraction" },
                hint: generateHint((input1 - input2).toString()),
            };
            dispatch(setRealAnswer((input1 - input2).toString()));
        } else {
            operation = "multiplication";
            newQuestion = {
                input1,
                input2,
                operator: { symbol: "x", label: "multiplication" },
                hint: generateHint((input1 * input2).toString()),
            };
            dispatch(setRealAnswer((input1 * input2).toString()));
        }

        dispatch(setDecision(operation));
        dispatch(setCurrentQuestion(newQuestion));
        return newQuestion;
    }, [dispatch]);

    useEffect(() => {
        if (!questionReset) {
            resetFocus();
            dispatch(setCorrect(false));
            if (currentQuestion.input1 === undefined) {
                createInitialQuestion();
            }
            setQuestionReset(true);
            // Start timer for initial question
            startTimer();
        }
    }, [
        currentQuestion,
        dispatch,
        questionReset,
        resetFocus,
        createInitialQuestion,
        startTimer,
    ]);

    // Start timer when a new question is generated
    useEffect(() => {
        if (
            currentQuestion &&
            currentQuestion.input1 !== undefined &&
            questionReset
        ) {
            startTimer();
        }
    }, [currentQuestion, questionReset, startTimer]);

    useEffect(() => {
        dispatch(
            setCorrect(currentAnswer !== "" && currentAnswer === realAnswer)
        );
    }, [currentAnswer, dispatch, realAnswer]);

    // Handle answer submission (both correct and wrong)
    useEffect(() => {
        if (!hasSubmitted) return;

        if (correct) {
            handleCorrectAnswer(decision, answeredQuestionRef.current);
        } else if (currentAnswer !== "") {
            handleWrongAnswer();
        }

        setHasSubmitted(false);
    }, [
        hasSubmitted,
        correct,
        currentAnswer,
        decision,
        handleCorrectAnswer,
        handleWrongAnswer,
    ]);

    // Render score streak display
    const renderScoreStreak = () => {
        return (
            <div className="score-streak-container">
                <div className="streak-header">
                    <FontAwesomeIcon icon={faFireFlameCurved} />
                    <span className="streak-label">Score Streak!</span>
                </div>
                <div className="streak-count">{scoreStreak}</div>
                <div className="best-streak-info">
                    <span className="best-streak-label">
                        🏆 Best: {currentUser.bestScoreStreak || 0}
                    </span>
                </div>
                {/* Timer Component */}
                <div className="timer-section">
                    <FontAwesomeIcon icon={faClock} className="timer-icon" />
                    <span className="timer-text">Time:</span>
                    <span
                        className={`timer-countdown ${
                            timeLeft <= 10
                                ? "critical"
                                : timeLeft <= 15
                                ? "warning"
                                : ""
                        }`}
                    >
                        {timeLeft}s
                    </span>
                </div>
            </div>
        );
    };

    // Render super streak progress bar
    const renderSuperStreak = () => {
        if (!currentUser.isLoggedIn || currentUser.dailyStreak < 3) {
            return null;
        }

        const streakProgress = Math.min(currentUser.dailyStreak / 10, 1); // Cap at 10 days for visual effect
        const isOverflowing = currentUser.dailyStreak >= 3;

        return (
            <div className="super-streak-container">
                <div className="streak-info">
                    <span className="streak-label">🔥 Super Streak!</span>
                    <span className="streak-count">
                        {currentUser.dailyStreak} days
                    </span>
                </div>
                <div className="progress-bar-container">
                    <div
                        className={`progress-bar ${
                            isOverflowing ? "overflowing" : ""
                        }`}
                        style={{ width: `${streakProgress * 100}%` }}
                    >
                        {isOverflowing && (
                            <div className="energy-particles">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="particle" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div>{renderSuperStreak()}</div>
            <div>{renderScoreStreak()}</div>
            <Spaceship />
            {currentQuestion && (
                <div className="challenge">
                    <div className="current-question">
                        <h1>
                            {currentQuestion &&
                                `${currentQuestion.input1} ${currentQuestion.operator.symbol} ${currentQuestion.input2}`}
                        </h1>
                        <button
                            className="help-icon"
                            onClick={handleHelpButtonClick}
                        >
                            <FontAwesomeIcon icon={faCircleQuestion} />
                        </button>
                    </div>
                    <div className="real-answer">
                        {showHint && (
                            <div className="hint">
                                <div className="title">Hint:</div>
                                <div>{currentQuestion.hint}</div>
                            </div>
                        )}
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setHasSubmitted(true);
                            // Store the current question before generating a new one
                            answeredQuestionRef.current = currentQuestion;
                            generateQuestion();
                            dispatch(setCurrentAnswer(""));
                        }}
                    >
                        <div
                            className={`answer-input-box ${
                                correct && "correct"
                            }`}
                        >
                            <label htmlFor="answer">Answer</label>
                            <input
                                id="answer"
                                value={currentAnswer}
                                type="number"
                                autoComplete="off"
                                onChange={(e) => {
                                    dispatch(setCurrentAnswer(e.target.value));
                                }}
                                className="answer-input"
                            />
                            <button
                                className="answer-button"
                                disabled={!correct}
                                onClick={() => {
                                    setHasSubmitted(true);
                                    generateQuestion();

                                    // reset
                                    dispatch(setCurrentAnswer(""));
                                    dispatch(setShowHint(false));
                                    resetHelpCount();
                                }}
                            >
                                NEXT
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Game4;
