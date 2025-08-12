import { useState, useEffect, useCallback } from "react";
import { useFocus } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import {
    setCurrentQuestion,
    setRealAnswer,
    setCurrentAnswer,
    setDecision,
    setShowHint,
    setHelpCount,
    setCorrect,
    setWinningStreak,
} from "../../app/features/game4Slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleQuestion,
    faFireFlameCurved,
} from "@fortawesome/free-solid-svg-icons";

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
    const dispatch = useDispatch();
    const resetFocus = useFocus("answer"); // resets cursor focus to input with id "answer"

    const {
        currentQuestion,
        realAnswer,
        currentAnswer,
        correct,
        helpCount,
        showHint,
        decision,
        superStreak,
        winningStreak,
    } = useSelector((state: any) => state.game);

    const { currentUser } = useSelector((state: any) => state.user);

    const generateQuestion = useCallback(() => {
        let newQuestion: any;
        let attempts = 0;
        const maxAttempts = 50; // Prevent infinite loops

        do {
            const input1 = Math.floor(Math.random() * 11);
            const input2 = Math.floor(Math.random() * 11);
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

        return newQuestion;
    }, [lastQuestion, decision, dispatch]);

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

    useEffect(() => {
        if (!questionReset) {
            resetFocus();
            dispatch(setCorrect(false));
            currentQuestion.input1 === undefined && generateQuestion();
            setQuestionReset(true);
        }
    }, [
        currentQuestion,
        dispatch,
        generateQuestion,
        questionReset,
        resetFocus,
    ]);
    useEffect(() => {
        dispatch(
            setCorrect(currentAnswer !== "" && currentAnswer === realAnswer)
        );
    }, [currentAnswer, dispatch, realAnswer]);

    // Track winning streak when answer is correct
    useEffect(() => {
        if (correct && currentAnswer === realAnswer) {
            dispatch(setWinningStreak((prevStreak: number) => prevStreak + 1));
        }
    }, [correct, currentAnswer, realAnswer, dispatch]);

    // Reset streak when answer is wrong
    useEffect(() => {
        if (
            currentAnswer !== "" &&
            currentAnswer !== realAnswer &&
            currentAnswer !== ""
        ) {
            dispatch(setWinningStreak(0));
        }
    }, [currentAnswer, realAnswer, dispatch]);

    // Render winning streak display
    const renderWinningStreak = () => {
        if (winningStreak === 0) return null;

        return (
            <div className="winning-streak-container">
                <div className="streak-fire">
                    <FontAwesomeIcon icon={faFireFlameCurved} />
                </div>
                <div className="streak-info">
                    <span className="streak-label">🔥 Streak!</span>
                    <span className="streak-count">{winningStreak}</span>
                </div>
                <div className="streak-answers">
                    {(() => {
                        const safeStreak = Math.min(
                            Math.max(Number(winningStreak) || 0, 0),
                            5
                        );
                        return Array.from({ length: safeStreak }, (_, i) => (
                            <div key={i} className="correct-answer-badge">
                                ✓
                            </div>
                        ));
                    })()}
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
            <div>{renderWinningStreak()}</div>
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
