import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { fetchReleases, addRelease } from '../actions/playlistActions';

class ReleasePicker extends Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
  }

  componentDidMount() {
    this.props.fetchReleases()
  }

  addTrack(id) {
    this.props.addRelease(id, this.props.tracks);
  }

  render() {
    let playlist = this.props.playlists.filter(playlist => {return playlist.id===this.props.match.params.id})[0]
    const releasecells = this.props.releases.map((release, ind) => (
        <tr key={ind}>
            <td>
                <Link to={`/playlists/${playlist.id}`} onClick={() => this.addTrack(release.albumid)}>
                    {release.releasename}
                </Link>
            </td>
            <td>
                {release.releasedate}
            </td>
            <td>
                {release.artist}
            </td>
        </tr>
      ));
    return (
      <div>
        <h1>Add new single to {playlist.name}</h1>
        <br />
        <table className="addreleasetable">
            <tbody>
                <tr>
                    <th>Track name</th>
                    <th>Release Date</th>
                    <th>Artist</th>
                </tr>
                {releasecells}
            </tbody>
        </table>
      </div>
    );
  }
}

ReleasePicker.propTypes = {
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
const actions = {fetchReleases, addRelease};
export default connect(mapStateToProps, actions )(ReleasePicker);
