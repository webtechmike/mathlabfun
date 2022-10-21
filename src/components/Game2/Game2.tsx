import { useEffect, useState } from "react";

type GameProps = {
    level: string;
};
function Game2(props: GameProps) {
    const [currentQuestion, setCurrentQuestion] = useState<string>("");
    const [realAnswer, setRealAnswer] = useState<string>("");

    const [currentAnswer, setCurrentAnswer] = useState<string>("");
    const [correct, setCorrect] = useState<boolean>(false);

    const generateQuestion = () => {
        const input1 = Math.floor(Math.random() * 50);
        const input2 = Math.floor(Math.random() * 50);
        const decider = Math.floor(Math.random() * 101);

        if (decider > 0 && decider <= 25) {
            setRealAnswer((input1 + input2).toString());
            setCurrentQuestion(`${input1} + ${input2}`);
        } else if (decider >= 26 && decider < 50) {
            setRealAnswer((input1 - input2).toString());
            setCurrentQuestion(`${input1} - ${input2}`);
        } else if (decider >= 50 && decider < 75) {
            setRealAnswer((input1 * input2).toString());
            setCurrentQuestion(`${input1} * ${input2}`);
        } else if (decider >= 75 && decider < 101) {
            setRealAnswer((input1 / input2).toString());
            setCurrentQuestion(`${input1} / ${input2}`);
        } else {
            return `${decider} is not between 1 and 100`;
        }
        return currentQuestion;
    };

    useEffect(() => {
        document.getElementById("answer")?.focus();
        setCorrect(false);
        generateQuestion();
    }, []);
    useEffect(() => {
        setCorrect(currentAnswer === realAnswer && currentAnswer !== "");

        document.getElementById("answer")?.focus();
    }, [currentAnswer]);

    return (
        <div>
            {currentQuestion && (
                <div className="challenge">
                    <div style={{ fontSize: "4em", minHeight: "120px" }}>
                        {correct && <span>✅</span>} {currentQuestion}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            flexWrap: "wrap",
                            textAlign: "left",
                            margin: "0 auto",
                            width: "110px",
                        }}
                    >
                        <label htmlFor="answer">Answer</label>
                        <input
                            id="answer"
                            value={currentAnswer}
                            type="number"
                            onChange={(e) => {
                                setCurrentAnswer(e.target.value);
                            }}
                            style={{ fontSize: "2em", width: "50px" }}
                        />
                        <button
                            disabled={!correct}
                            onClick={() => {
                                console.log("DEBUG");
                                setCurrentQuestion(generateQuestion());

                                // reset
                                setCurrentAnswer("");
                            }}
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game2;
