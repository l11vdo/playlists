import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPlaylist } from '../actions/playlistActions';
import { getNode } from '../lib';

class CreatePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: ''
    };

    this.onChange = this.onChange.bind(this);
    this.create = this.create.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  create() {
    const playlist = {
      name: this.state.name,
      description: this.state.description
    };
    this.props.createPlaylist(playlist);
    this.setState( {name: '', description: '' }, () => { window.location.reload() });
  }

  render() {
    return (
      <div>
        <h1>Add Playlist</h1>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>Name: </label>
            <br />
            <input
              size="60"
              type="text"
              name="name"
              onChange={this.onChange}
              value={this.state.name}
            />
          </div>
          <br />
          <div>
            <label>Description: </label>
            <br />
            <textarea
              rows="4"
              cols="100"
              maxLength="300"
              name="description"
              onChange={this.onChange}
              value={this.state.description}
            />
          </div>
          <div>
          <br />
            <label>Owner: </label>
            {getNode(this.props.user,"display_name")}
          </div>
          <br />
          <button 
            disabled={(this.state.name==="" || this.state.description==="")}
            onClick={() => this.create()}>
            <h3>Create Playlist</h3>
          </button>
          <br />
        </form>
        <br />
      </div>
    );
  }
}

CreatePlaylist.propTypes = {
  user: PropTypes.object,
  playlists: PropTypes.array,
  tracks: PropTypes.array,
  token: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.playlists.user,
  playlists: state.playlists.items,
  tracks: state.playlists.tracks,
  token: state.playlists.token
});

export default connect(mapStateToProps, { createPlaylist })(CreatePlaylist);
