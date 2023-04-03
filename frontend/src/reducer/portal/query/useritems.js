import { SET_USER_ITEMS } from '../../../constants/action-types'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ITEMS:
      return action.userItems.map(item => ({ 
        id: item.id, 
        title: item.title, 
        created: item.created, 
        tags: item.tags 
      }))
    default:
      return state
  }
}