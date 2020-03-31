import { FETCH_PLAYLISTS, FETCH_USER, FETCH_TOKEN, FETCH_TRACKS, FETCH_RELEASES, ADD_RELEASE, REMOVE_TRACK } from './types';
import { AUTHENDPOINT, CLIENTID, REDIRECTURI, SCOPES } from './constants';

import store from '../store';
import { getNode } from '../lib';

export const fetchPlaylists = () => dispatch => {

  let state = store.getState();
  let  authToken = state.playlists.token;
  if (!authToken) {
    // Get the hash of the url
    const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
    window.location.hash = '';

    // Set token
    authToken = hash.access_token;

    // If there is no token, redirect to Spotify authorization
    if (!authToken) {
      window.location = `${AUTHENDPOINT}?client_id=${CLIENTID}&redirect_uri=${REDIRECTURI}&scope=${SCOPES.join('%20')}&response_type=token&show_dialog=false`;
    }
  }

  if (authToken) {
    dispatch({
      type: FETCH_TOKEN,
      payload: authToken
    })
    fetch('https://api.spotify.com/v1/me', {
      method: 'get',
      headers: new Headers({'Authorization': 'Bearer ' + authToken})
    })
    .then(res => res.json())
    .then((user) => {
      dispatch({
        type: FETCH_USER,
        payload: user
      })
      fetch( `https://api.spotify.com/v1/users/${user.id}/playlists`, {
        method: 'get',
        headers: new Headers({'Authorization': 'Bearer ' + authToken})
      })
      .then(res => res.json())
      .then((playlists) => {
        dispatch({
          type: FETCH_PLAYLISTS,
          payload: playlists.items
        })
        dispatch({
          type: FETCH_TRACKS,
          payload: []
        })
      })    
    });
  }
}
export const fetchTracks = (playlist_id) => dispatch => {
  let state = store.getState();
  if (state.playlists.tracks.length === 0) {
    let  authToken = state.playlists.token;
    if (authToken) {
      fetch( `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        method: 'get',
        headers: new Headers({'Authorization': 'Bearer ' + authToken})
      })
      .then(res => res.json())
      .then((trackData) => {
        let tracks = trackData.items.map((track, ind) => {
          return {
            "trackname": getNode(getNode(track,"track"),"name"),
            "artist": getNode(getNode(getNode(track,"track"),"artists")[0],"name"), 
            "album": getNode(getNode(getNode(track,"track"),"album"),"name"),
            "id":  getNode(getNode(track,"track"),"id"),
            "uri":  getNode(getNode(track,"track"),"uri")}
        })
        dispatch({
          type: FETCH_TRACKS, 
          payload: tracks
        })
      })
    }
  }
}
export const fetchReleases = () => dispatch => {
  var newrel = [];
  let state = store.getState();
  if (state.playlists.releases.length === 0) {
    let  authToken = state.playlists.token;
    if (authToken) {
      fetch( `https://api.spotify.com/v1/browse/new-releases?country=gb&limit=50`, {
        method: 'get',
        headers: new Headers({'Authorization': 'Bearer ' + authToken})
      })
      .then(res => res.json())
      .then((releasesData) => {
        let albums = getNode(releasesData,"albums");
        let singles = albums.items.filter(release => {return release.album_type === "single" })
        for (var i=0;i<singles.length;i++) {
          const release = singles[i];
          
          fetch( `https://api.spotify.com/v1/albums/${release.id}/tracks`, {
            method: 'get',
            headers: new Headers({'Authorization': 'Bearer ' + authToken})
          })
          .then(res => res.json())
          .then((tracks) => {
            const track = tracks.items[0];
            var obj = {
            "albumid": getNode(release, "id"),
            "releasename": track.name,
            "releasedate": getNode(release,"release_date"),
            "artist": getNode(getNode(release,"artists")[0],"name"), 
            "uri":  getNode(release,"uri")}
            newrel.push(obj);
            dispatch({
              type: FETCH_RELEASES, 
              payload: newrel
            })
          })
        }
      })
    }
  }
}

export const addRelease = (albumId, tracks) => dispatch => {
  let state = store.getState();
  let  authToken = state.playlists.token;
  if (authToken) {
    fetch( `https://api.spotify.com/v1/albums/${albumId}/tracks`, {
      method: 'get',
      headers: new Headers({'Authorization': 'Bearer ' + authToken})
    })
    .then(res => res.json())
    .then((albumData) => {
      let trackId = getNode(getNode(albumData,"items")[0],"id");
      fetch( `https://api.spotify.com/v1/tracks/${trackId}`, {
        method: 'get',
        headers: new Headers({'Authorization': 'Bearer ' + authToken})
      })
      .then(res => res.json())
      .then((track) => {
        if ( tracks.filter(trk => trk.id===track.id).length===0) {
          let myTrack = {
            "trackname": getNode(track,"name"),
            "artist": getNode(getNode(track,"artists")[0],"name"),
            "album": getNode(getNode(track,"album"),"name"),
            "id": getNode(track,"id"),
            "uri": getNode(track,"uri")}
          dispatch({ type: ADD_RELEASE, payload: myTrack});
          alert(`${myTrack.trackname} has been added to your playlist`)
        }
        else { alert(`Track is already in the playlist - operation cancelled`) }
      })
    })
  }
}
export const removeTrack = (trackId) => dispatch => {
  dispatch({
    type: REMOVE_TRACK, 
    payload: trackId
  })
}
export const createPlaylist = playlistData => dispatch => {
  let state = store.getState();
  let  authToken = state.playlists.token;
  let user_id = state.playlists.user.id;
  if (authToken) {
    fetch( `https://api.spotify.com/v1/users/${user_id}/playlists`, {
      method: 'post',
      body: JSON.stringify(playlistData),
      headers: new Headers({'Authorization': 'Bearer ' + authToken})
    })
  }
}
export const replaceTracks = (playlist, trackData) => dispatch => {
  let state = store.getState();
  let  authToken = state.playlists.token;
  
  let uriData = { "uris": trackData.map(track => { return track["uri"] } )}
  if (authToken) {
    fetch( `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: 'put',
      body: JSON.stringify(uriData),
      headers: new Headers({'Authorization': 'Bearer ' + authToken})
    })
  }
}
