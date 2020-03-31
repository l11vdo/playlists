import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";


import Playlists from './components/Playlists';
import PlaylistDetail from './components/PlaylistDetail';
import ReleasePicker from './components/ReleasePicker';
import TrackRemove from './components/TrackRemove';

import store from './store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <nav className="navbar">
            <NavLink exact to="/callback">
              Home
            </NavLink>
          </nav>
          <main className="App">
            <div>
              <Switch>
              <Route path="/callback" component={Playlists} />
              <Route exact path="/playlists/:id" component={PlaylistDetail} />
              <Route exact path="/releasepicker/:id" component={ReleasePicker} />
              <Route exact path="/trackremove/:id/:playlistid" component={TrackRemove} />
              </Switch>
            </div>
          </main>
        </Router>
      </Provider>
    );
  }
}

export default App;
