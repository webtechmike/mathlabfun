import { useEffect, useState } from "react";
import {
    addition,
    subtraction,
    multiplication,
    division,
} from "../../services/challenges";

type Challenge = {
    question: string;
    answer: string;
};

type GameProps = {
    level: string;
};
function Game(props: GameProps) {
    const [challenges, setChallenges] = useState<Challenge[]>(addition);
    const [currentQuestion, setCurrentQuestion] = useState<string>("");
    const [currentAnswer, setCurrentAnswer] = useState<string>("");
    const [realAnswer, setRealAnswer] = useState<string>("");
    const [correct, setCorrect] = useState<boolean>(false);

    useEffect(() => {
        document.getElementById("answer")?.focus();
        setCorrect(false);
    }, []);
    useEffect(() => {
        setCorrect(currentAnswer === realAnswer && currentAnswer !== "");

        document.getElementById("answer")?.focus();
    }, [currentAnswer]);
    useEffect(() => {
        switch (props.level) {
            case "1":
                setChallenges(addition);
                break;
            case "2":
                setChallenges(subtraction);
                break;
            case "3":
                setChallenges(multiplication);
                break;
            case "4":
                setChallenges(division);
                break;
            default:
                setChallenges(addition);
        }
        setCurrentQuestion(challenges[0].question);
        setRealAnswer(challenges[0].answer);
    }, [props.level, challenges]);
    return (
        <div>
            {challenges.map((challenge, index) => {
                const next = challenges.length === index + 1 ? 0 : index + 1;

                return (
                    currentQuestion === challenge.question && (
                        <div key={index} className="challenge">
                            <div
                                style={{ fontSize: "4em", minHeight: "120px" }}
                            >
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
                                        console.log(
                                            "DEBUG",
                                            next,
                                            typeof challenges[next],
                                            challenges[next]
                                        );
                                        setCurrentQuestion(
                                            challenges[next].question
                                        );
                                        setRealAnswer(challenges[next].answer);
                                        setCurrentAnswer("");
                                    }}
                                >
                                    NEXT
                                </button>
                            </div>
                        </div>
                    )
                );
            })}
        </div>
    );
}

export default Game;
