import React, { useEffect, useState } from "react";
import { useFocus } from "../../hooks/useFocus";
import "./game3.scss";

type GameProps = {
    level: string;
};
function Game3(props: GameProps) {
    // TODOS:
    // 0. Store currentQuestion as an object
    // export type CurrentQuestion = {
    //    input1: number; // left side of the equation
    //    input2: number; // right side of the equation
    //    operator: {
    //      symbol: string;
    //      label: string;
    //    },
    //    hint: string;
    // }
    // 1. Convert app to use redux
    // 2. Create themes (i.e. outerspace, floral, mountain)
    // 3. Add user accounts
    // 4. Track usage
    // 5. Reward usage
    //    a. Earn regular credits for answering problems correctly { addition: 'pennies', subtraction: 'nickels', multiplication: 'dimes' }
    //    b. Earn bonus credits for winning streak ??? 10 correct answers in a row
    //    c. Earn bonus credits for every correct answer after winning streak activated
    //    d. Tournaments can earn parents a new dyson vaccuum ... much planning needed here.lol

    const resetFocus = useFocus("answer"); // resets cursor focus to input with id "answer"
    const [currentQuestion, setCurrentQuestion] = useState<string>("");
    const [realAnswer, setRealAnswer] = useState<string>("");

    const [currentAnswer, setCurrentAnswer] = useState<string>("");
    const [correct, setCorrect] = useState<boolean>(false);
    const [helpCount, setHelpCount] = useState<number>(0);
    const [showHint, setShowHint] = useState<boolean>(false);

    const [decision, setDecision] = useState("addition");
    const [hint, setHint] = useState<any>();

    const getDecision = (decidedBy: number): string => {
        if (decidedBy <= 33) {
            setDecision("addition");
            return "addition";
        } else if (decidedBy >= 34 && decidedBy < 66) {
            setDecision("subtraction");
            return "subtraction";
        } else if (decidedBy >= 67 && decidedBy < 101) {
            setDecision("multiplication");
            return "multiplication";
        } else {
            setDecision("addition");
            return "addition";
        }
    };

    const generateQuestion = () => {
        const input1 = Math.floor(Math.random() * 11);
        const input2 = Math.floor(Math.random() * 11);
        const decider = Math.floor(Math.random() * 101);

        getDecision(decider);
        if (decision === "addition") {
            setRealAnswer((input1 + input2).toString());
            setCurrentQuestion(`${input1} + ${input2}`);
        } else if (decision === "subtraction") {
            setRealAnswer((input1 - input2).toString());
            setCurrentQuestion(`${input1} - ${input2}`);
        } else if (decider >= 67 && decider < 101) {
            setRealAnswer((input1 * input2).toString());
            setCurrentQuestion(`${input1} x ${input2}`);
        } else {
            return `${decider} is not between 1 and 100`;
        }
        setHint(generateHint(input1, input2, decision));
        return currentQuestion;
    };

    const generateHint = (input1: number, input2: number, decision: string) => {
        const hintReference = {
            input1,
            input2,
            operator: decision,
        };
        const decisionSymbol = {
            addition: "+",
            subtraction: "-",
            multiplication: "x",
        };

        const decisionLabel = {
            addition: "Plus",
            subtraction: "Minus",
            multiplication: "Times",
        };
        const generateIcons = (n: number): string => {
            // const icon = "🚀";
            // const icon = "🌙";
            const icon = "🌕";
            let hint = "";
            if (n === 0) {
                return "0";
            }
            for (let i = 0; i < n; i++) {
                hint += icon;
                if (i < n) {
                    hint += "\n";
                }
            }
            return hint;
        };
        const generateRows = (multiplier: number, multicand: number): any => {
            const rows = [];
            if (multiplier === 0 || multicand === 0) {
                return <span>0</span>;
            }
            for (let i = 0; i < multicand; i++) {
                rows.push(generateIcons(multiplier));
            }
            return (
                <div>
                    {rows.map((row, index) => (
                        <p key={index}>{row}</p>
                    ))}
                </div>
            );
        };

        return (
            <div className="hint">
                <div className="title">Hint:</div>
                <div className="icons-row">{generateIcons(input1)}</div>
                <div className="decision-symbol">
                    <span>
                        {
                            decisionSymbol[
                                decision as keyof typeof decisionSymbol
                            ]
                        }{" "}
                    </span>
                    <span>
                        {`(${
                            decisionLabel[
                                decision as keyof typeof decisionLabel
                            ]
                        })`}
                    </span>
                </div>
                <div className="icons-row">{generateIcons(input2)}</div>
                <div className="equals">equals</div>
                <div className="icons-row">
                    {decision === "addition"
                        ? generateIcons(input1 + input2)
                        : decision === "subtraction"
                        ? generateIcons(input1 - input2)
                        : generateRows(input1, input2)}
                </div>
            </div>
        );
    };

    const revealHint = () => {
        setShowHint(true);
        resetFocus();
    };

    const handleHelpButtonClick = () => {
        if (helpCount === 0) {
            revealHint();
            setHelpCount(helpCount + 1);
        } else if (helpCount === 1) {
            revealAnswer();
            resetHelpCount();
        }
    };

    const revealAnswer = () => {
        setCurrentAnswer(realAnswer);
        resetFocus();
    };

    const resetHelpCount = () => {
        setHelpCount(0);
    };

    useEffect(() => {
        resetFocus();
        setCorrect(false);
        generateQuestion();
    }, []);
    useEffect(() => {
        setCorrect(currentAnswer === realAnswer && currentAnswer !== "");
        resetFocus();
    }, [currentAnswer]);

    return (
        <div>
            {currentQuestion && (
                <div className="challenge">
                    <div className="current-question">
                        <h1>{currentQuestion}</h1>
                        <button
                            className="help-icon"
                            onClick={handleHelpButtonClick}
                        >
                            ?
                        </button>
                    </div>
                    <div className="real-answer">{showHint && hint}</div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            generateQuestion();
                            setCurrentAnswer("");
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
                                    setCurrentAnswer(e.target.value);
                                }}
                                className="answer-input"
                            />
                            <button
                                className="answer-button"
                                disabled={!correct}
                                onClick={() => {
                                    generateQuestion();

                                    // reset
                                    setCurrentAnswer("");
                                    setShowHint(false);
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

export default Game3;
