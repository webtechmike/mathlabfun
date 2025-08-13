import { faMeteor } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import "./spacebucksicon.scss";

function SpacebucksIcon() {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className="spacebucks-icon-container"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="spacebucks-icon">
                <FontAwesomeIcon size="2x" icon={faMeteor} />
            </div>
            {showTooltip && (
                <div className="spacebucks-tooltip">
                    <h3>💫 Spacebucks Rewards</h3>
                    <div className="reward-rules">
                        <div className="rule">
                            <span className="operation">➕ Addition:</span>
                            <span className="reward">1 spacebuck</span>
                        </div>
                        <div className="rule">
                            <span className="operation">➖ Subtraction:</span>
                            <span className="reward">2 spacebucks</span>
                        </div>
                        <div className="rule">
                            <span className="operation">
                                ✖️ Multiplication:
                            </span>
                            <span className="reward">3 spacebucks</span>
                        </div>
                        <div className="rule">
                            <span className="operation">
                                🔢 Negative Numbers:
                            </span>
                            <span className="reward">+1 bonus spacebuck</span>
                        </div>
                    </div>
                    <div className="super-streak-info">
                        <h4>🚀 SuperStreak Bonus</h4>
                        <p>
                            Login for 3+ consecutive days to earn{" "}
                            <strong>DOUBLE</strong> spacebucks!
                        </p>
                    </div>
                    <div className="score-streak-info">
                        <h4>🔥 Score Streak</h4>
                        <p>
                            Track your consecutive correct answers in the upper
                            left corner.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SpacebucksIcon;
