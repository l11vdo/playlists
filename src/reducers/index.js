import { combineReducers } from 'redux';
import playlistReducer from './playlistReducer';

export default combineReducers({
  playlists: playlistReducer
});
