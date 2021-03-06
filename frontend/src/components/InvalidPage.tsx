//React Imports
import * as React from "react"
import { useParams, Link } from 'react-router-dom';

function InvalidPage(props) {
    return(
        <div id="characterChoiceBar">
      <Link to="/characters">

            <button
              id="chooseCharacterButton"
              className={props.settings.dark_light === 0 ? "chooseCharacter_dark" : "chooseCharacter_light"}
            >
              <b>Choose a Character</b>
            </button>

      </Link>
        <h2> This page is not available! </h2>
      </div>
    )
    
}

export default InvalidPage