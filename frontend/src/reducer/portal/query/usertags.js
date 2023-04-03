import { SET_USER_TAGS } from '../../../constants/action-types'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_TAGS:
      return action.userTags || initialState
    default:
      return state
  }
}