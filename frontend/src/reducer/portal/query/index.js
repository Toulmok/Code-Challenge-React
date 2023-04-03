import { combineReducers } from '@reduxjs/toolkit'
import userItems from './useritems'
import userTags from './usertags'


export default combineReducers({
  userItems,
  userTags,
})