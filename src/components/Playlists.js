import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { fetchPlaylists, fetchReleases } from '../actions/playlistActions';
import { getNode } from '../lib';
import CreatePlaylist from './CreatePlaylist';

class Playlists extends Component {
  componentWillMount() {
    this.props.fetchPlaylists();
    this.props.fetchReleases();
  }

  render() {
    const playlistitems = this.props.playlists.map((playlist, ind) => (
      <Link  className="playlistlink" key={ind} to={`/playlists/${playlist.id}`}>
        <div className="playlistdiv">
          <h3>{getNode(playlist,"name")}</h3>
          <p>{getNode(playlist,"description")}</p>
          <p><b>Owner: </b>{getNode(getNode(playlist,"owner"),"display_name")}</p>
          <p><b>Tracks: </b>{getNode(getNode(playlist,"tracks"),"total")}</p>
          <hr />
        </div>
      </Link>
    ));
    return (
      <div>
        <h1>My Playlists</h1>
        {playlistitems}
        <CreatePlaylist />
      </div>
    );
  }
}

Playlists.propTypes = {
  fetchPlaylists: PropTypes.func.isRequired,
  playlists: PropTypes.array.isRequired,
  user: PropTypes.object,
  newPlaylist: PropTypes.object,
  token: PropTypes.string
};

const mapStateToProps = state => ({
  playlists: state.playlists.items,
  user: state.playlists.user,
  token: state.playlists.token,
  newPlaylist: state.playlists.item
});

const actions = {fetchReleases, fetchPlaylists};
export default connect(mapStateToProps, actions)(Playlists);
