import { useEffect } from "react";
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
} from "../../app/features/game4Slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

import "./game4.scss";

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

    const resetFocus = useFocus("answer"); // resets cursor focus to input with id "answer"
    const dispatch = useDispatch();

    const {
        currentQuestion,
        realAnswer,
        currentAnswer,
        correct,
        helpCount,
        winningStreak,
        superStreak,
        showHint,
        decision,
    } = useSelector((state: any) => state.game);

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

    const generateQuestion = () => {
        const input1 = Math.floor(Math.random() * 11);
        const input2 = Math.floor(Math.random() * 11);
        const decider = Math.floor(Math.random() * 101);

        decide(decider);
        if (decision === "addition") {
            dispatch(setRealAnswer((input1 + input2).toString()));
            dispatch(
                setCurrentQuestion({
                    input1,
                    input2,
                    operator: { symbol: "+", label: "addition" },
                    hint: generateHint((input1 + input2).toString()),
                })
            );
        } else if (decision === "subtraction") {
            dispatch(setRealAnswer((input1 - input2).toString()));
            dispatch(
                setCurrentQuestion({
                    input1,
                    input2,
                    operator: { symbol: "-", label: "subtraction" },
                    hint: generateHint((input1 - input2).toString()),
                })
            );
        } else if (decider >= 67 && decider < 101) {
            dispatch(setRealAnswer((input1 * input2).toString()));
            dispatch(
                setCurrentQuestion({
                    input1,
                    input2,
                    operator: { symbol: "x", label: "multiplication" },
                    hint: generateHint((input1 * input2).toString()),
                })
            );
        } else {
            return `${decider} is not between 1 and 100`;
        }
        return currentQuestion;
    };

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
        resetFocus();
        dispatch(setCorrect(false));
        generateQuestion();
    }, []);
    useEffect(() => {
        dispatch(
            setCorrect(currentAnswer !== "" && currentAnswer === realAnswer)
        );
    }, [currentAnswer, dispatch, realAnswer]);

    return (
        <div>
            {currentQuestion && (
                <div className="challenge">
                    <div className="current-question">
                        <h1>{`${currentQuestion.input1} ${currentQuestion.operator.symbol} ${currentQuestion.input2}`}</h1>
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
