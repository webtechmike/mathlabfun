import { faMeteor } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./spacebucksicon.scss";

function SpacebucksIcon() {
    return (
        <div className="spacebucks-icon">
            <FontAwesomeIcon size="2x" icon={faMeteor} />
        </div>
    );
}

export default SpacebucksIcon;
