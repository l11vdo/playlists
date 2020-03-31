import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import 'font-awesome/css/font-awesome.min.css';

import { fetchTracks, replaceTracks } from '../actions/playlistActions';
import { getNode } from '../lib';

class PlaylistDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: ''
    };
    this.replace = this.replace.bind(this);
  }

  componentWillMount() {
    this.props.fetchTracks(this.props.match.params.id);
  }

  replace(playlist, tracks) {
    this.props.replaceTracks(playlist, tracks);
  }

  render() {
    let playlist = this.props.playlists.filter(playlist => {return playlist.id===this.props.match.params.id})[0];
    let canUpdate = (getNode(getNode(playlist,"owner"),"id")===this.props.user.id);
    const trackcells = this.props.tracks.map((track, ind) => (
      <tr key={ind}>
          <td>
              {ind+1}
          </td>
          <td>
              {track.trackname}
          </td>
          <td>
              {track.artist}
          </td>
          <td>
              {track.album}
          </td>
          {canUpdate &&
          <td>
              <Link to={`/trackremove/${track.id}/${playlist.id}`}>
                <i className="fa fa-trash" aria-hidden="true"></i>
              </Link>
          </td>}
        </tr>
    ));

    return (
      <div>
        <h1>Playlist {playlist.name} - {canUpdate?"Add/remove":"View"} tracks</h1>
        <p>{playlist.description}</p>
        <br />
        <hr />
        <table className="addreleasetable">
          <tbody>
              <tr>
                  <th>#</th>
                  <th>Track Name</th>
                  <th>Artist Name</th>
                  <th>Album</th>
                  {canUpdate && <th> </th>}
              </tr>
              <tr><td colSpan="5"><hr /></td></tr>
              {trackcells}
          </tbody>
        </table>
        <br />
        {canUpdate &&
        <Link  className="addreleaselink" to={`/releasepicker/${this.props.match.params.id}`}>
          <div className="addreleasediv">
            <p><b>Add new track</b></p>
          </div>
        </Link>}
        <hr />
        <div>
          <br />
          <label>Owner: </label>
          {getNode(getNode(playlist,"owner"),"display_name")}
          <br />
        </div>
        <br />
        {canUpdate &&
        <Link to={"/callback"} onClick={() => this.replace(playlist, this.props.tracks)}> 
          <button>
            <h3>Save Playlist</h3>
          </button>
        </Link>}
      <br /><br />
      </div>
    );
  }
}

PlaylistDetail.propTypes = {
  user: PropTypes.object,
  playlists: PropTypes.array,
  tracks: PropTypes.array,
  token: PropTypes.string
};

const mapStateToProps = state => ({
  playlists: state.playlists.items,
  user: state.playlists.user,
  tracks: state.playlists.tracks,
  token: state.playlists.token
});
const actions = {fetchTracks, replaceTracks};
export default connect(mapStateToProps, actions )(PlaylistDetail);
