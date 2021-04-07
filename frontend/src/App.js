//Import React Elements
import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import 'react-notifications-component/dist/theme.css'
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';

//Import css
import './css/App.css';

//Import components
import Header from './components/Header'
import Settings from './components/Settings';
import Info from './components/Info';
import CharacterList from './components/CharacterList'
import Main from './components/Main'
import HitboxDetail from './components/HitBoxDetail'

//Set hostname to query depending on dev vs PROD
const environment = process.env.NODE_ENV === "development" ? "localhost" : "ultimate-hitboxes.com";

//Import all the character Data
//import characterData from './data/CharacterData.json'

class App extends React.Component {
  constructor() {

    super();

    //State
    this.state = {

      characterData: undefined,

      //Contains data for a specific hitbox, for use when displaying all data about a hitbox
      hitboxData: undefined,

      //Values for sorting/filtering the character list
      search: "",

      //All settings
      settings: {
        showAllHitboxData: true,
        damageMultiplier: false,
        showExtraInfo: false,
        dark_light: 0,
        defaultPlaySpeed: 2,
        loopMove: true,
        scrollTable: true,
        sortBy: "number"
      }
    }

    //Bind functions so they are usable within components
    this.changeDefaultSpeed = this.changeDefaultSpeed.bind(this)
    this.updateHitboxData = this.updateHitboxData.bind(this)
    this.changeSortBy = this.changeSortBy.bind(this)
    this.changeSearchValue = this.changeSearchValue.bind(this)
    this.setInitialSettings = this.setInitialSettings.bind(this)
    this.changeSettings = this.changeSettings.bind(this)
    this.changeMove = this.changeMove.bind(this)
    this.urlNotification = this.urlNotification.bind(this)
    this.setCharacterData = this.setCharacterData.bind(this)

  }

  setCharacterData(data) {
    this.setState({
      characterData: data
    })
  }
  changeDefaultSpeed(event) {
    //Update the play speed variable in the state
    this.setState({
      defaultPlaySpeed: event.target.value
    })
  }

  //Save data for a particular hitbox for use in the "More Data button"
  updateHitboxData(hitbox) {
    this.setState({
      hitboxData: hitbox
    })
  }

  //Update the value to sort by in the character select
  changeSortBy(value) {
    this.setState({
      sortBy: value.target.id
    })
  }

  //Update the search value to filter by in the character select
  changeSearchValue(value) {
    this.setState({
      search: value.target.value
    })
  }

  //Set initial settings on a page load
  setInitialSettings() {
    console.log(document.cookie)
    //Attempt to parse the cookie and use the values acquired to change the settings
    try {
      let settings = JSON.parse(document.cookie.split('=')[1])
      
      if (settings.loopMove === undefined) {
        settings.loopMove = true
      }
      this.setState({
        settings: settings,
        playSpeed: settings.defaultPlaySpeed
      })
      
    }
    //No cookie available or cookie is unreadable, use the default settings and reset cookie
    catch {
    }
  }

  changeSettings(settings) {
    if (this.state.settings !== settings) {
      this.setState({
        settings: settings
      })
    }
    document.cookie = "settings=" + JSON.stringify(settings) + "; Expires=Fri, 1 Jan 2025 00:00:00 EST;" + "path=/";
    console.log(document.cookie)
  }

  //When the site initially loads, always get all character data
  componentDidMount() {
    console.log("mount")
    this.setInitialSettings()

    fetch(`http://${environment}:5000/characterData`)
      .then(response => response.json())
      .then(data => {

        //Set state to loading and save the data for the move
        this.setCharacterData(data)
      })
      .catch(err => {
        console.log("Failure")
      })
  }


  changeMove(event) {
    this.setState({
      redirectMove: event.target.value
    })
  }

  urlNotification() {
    console.log("url")
    store.addNotification({
      message: "URL saved to clipboard",
      type: "success",
      container: "top-center",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: true
      }
    });
  }


  //Call components to render the page
  render() {

    let pageStyle = {}

    //Dark Mode Style
    if (this.state.settings.dark_light === 0) {
      pageStyle.backgroundColor = "1B1B1B"
      pageStyle.color = "white"
    }
    //Light Mode Style
    else {
      pageStyle.backgroundColor = "#F2F3F4"
      pageStyle.color = "black"
    }

    ////This extends the background color to the whole screen
    document.body.style.backgroundColor = pageStyle.backgroundColor;

    if (this.state.characterData === undefined) {
      return null;
    }
    return (
      <div className="App" style={pageStyle}>
        <ReactNotification />
        <Router>
          <Header
            showInfo={this.showInfo}
            showSettings={this.showSettings}
            dark_light={this.state.settings.dark_light}
          />
                
          <Switch>

            <Route path='/info' render={() => (
              <Info
                dark_light={this.state.settings.dark_light}
              />
            )} />

            <Route path='/settings' render={() => (
              <Settings
                settings={this.state.settings}
                setInitialSettings={this.setInitialSettings}
                changeSettings={this.changeSettings}
              />
            )} />

            <Route path={['/']} exact render={() => (
              <div>
                <div className="info">Check out hundreds of moves from Smash Ultimate at various speeds and view in depth details on every hitbox related to each move! </div>
                <CharacterList
                  characterListData={this.state.characterData}
                  updateCurrentCharacter={this.updateCurrentCharacter}
                  getCharacterData={this.getCharacterData}
                  search={this.state.search}
                  changeSearchValue={this.changeSearchValue}
                  setInitialSettings={this.setInitialSettings}
                  settings={this.state.settings}
                  changeSettings={this.changeSettings}
                  />
              </div>
            )} />

            <Route path={['/characters']} exact render={() => (
              <CharacterList
                characterListData={this.state.characterData}
                updateCurrentCharacter={this.updateCurrentCharacter}
                getCharacterData={this.getCharacterData}
                search={this.state.search}
                changeSearchValue={this.changeSearchValue}
                setInitialSettings={this.setInitialSettings}
                settings={this.state.settings}
                changeSettings={this.changeSettings}
              />
            )} />

            <Route path={['/:character', '/:character/:move', '/:character/:move/:frame']} exact render={() => (
              <div id="main">
                <Main
                  characterListData={this.state.characterData}
                  settings={this.state.settings}
                  updateHitboxData={this.updateHitboxData}
                  urlNotification={this.urlNotification}
                />
                <HitboxDetail
                  updateHitboxData={this.updateHitboxData}
                  hitboxData={this.state.hitboxData}
                  settings={this.state.settings}
                />

              </div>
            )} />

            <Route path='*' exact render={() => (
              <h2> This page is not available! </h2>
            )} />

          </Switch>
        </Router>
      </div>
    )
  }
  
}

export default App;
