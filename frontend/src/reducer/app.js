import { combineReducers } from '@reduxjs/toolkit'

import query from './portal/query/index'
import user from './portal/user/index'

export default combineReducers({
  query,
  user
})