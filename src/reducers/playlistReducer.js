import { 
  FETCH_PLAYLISTS,
  FETCH_USER,
  NEW_PLAYLIST,
  FETCH_PLAYLIST,
  FETCH_TRACKS,
  FETCH_TOKEN,
  FETCH_RELEASES,
  ADD_RELEASE,
  REMOVE_TRACK } from '../actions/types';

const initialState = {
  items: [],
  tracks: [],
  user: {},
  item: {},
  releases: [],
  token: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYLISTS:
      return {
        ...state,
        items: action.payload
      };
    case FETCH_USER:
      return {
        ...state,
        user: action.payload
      };
    case FETCH_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case NEW_PLAYLIST:
    return {
      ...state,
      item: action.payload
    };
    case FETCH_PLAYLIST:
      return {
        ...state,
        item: action.payload
      };
    case FETCH_TRACKS:
      return {
        ...state,
        tracks: action.payload
      };
    case FETCH_RELEASES:
      return {
        ...state,
        releases: action.payload
      };
    case ADD_RELEASE:
      return {
        ...state,
        tracks: [...state.tracks, action.payload]
      };
    case REMOVE_TRACK:
      return {
        ...state,
        tracks: state.tracks.filter(track => track.id !== action.payload)
      }
    default:
      return state;
  }
}