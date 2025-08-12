import Login from "../../containers/Login";
import SpacebucksIcon from "../SpacebucksIcon/SpacebucksIcon";

import "./home.scss";

function Home() {
    return (
        <div>
            <div className="welcome-heading">
                <SpacebucksIcon /> <h2>Earn Spacebucks</h2>
            </div>
            <p>Complete challenges</p>
            <p>Solve 100 problems per day</p>
            <p>Start earning double rewards by playing 3 days in a row.</p>

            <Login />
        </div>
    );
}

export default Home;
