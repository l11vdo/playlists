import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { removeTrack } from '../actions/playlistActions';

class TrackRemove extends Component {
  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
  }

  remove(id) {
    this.props.removeTrack(id);
  }

  render() {
    let track = this.props.tracks.filter(track => {return track.id===this.props.match.params.id})[0]
    return (
      <div className="yesnodialog">
        <h1>Remove track {track.trackname}?</h1>
        <br /><br />
        <table>
            <tbody>
              <tr>
                <td>
                  <Link to={`/playlists/${this.props.match.params.playlistid}`} onClick={() => this.remove(this.props.match.params.id)}> 
                    <button>
                      <h3>Yes</h3>
                    </button>
                  </Link>
                </td>
                <td>
                  <Link to={`/playlists/${this.props.match.params.playlistid}`}> 
                    <button>
                      <h3>No</h3>
                    </button>
                  </Link>
                </td>
              </tr>
            </tbody>
        </table>
      </div>
    );
  }
}

TrackRemove.propTypes = {
  playlists: PropTypes.array,
  tracks: PropTypes.array,
  releases: PropTypes.array,
  token: PropTypes.string
};

const mapStateToProps = state => ({
  playlists: state.playlists.items,
  tracks: state.playlists.tracks,
  releases: state.playlists.releases,
  token: state.playlists.token
});
export default connect(mapStateToProps, { removeTrack } )(TrackRemove);
