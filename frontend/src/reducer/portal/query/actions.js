import * as types from '../../../constants/action-types'

export function getUserItems() {
  return {
    type: types.GET_USER_ITEMS,
  }
}

export function setUserItems(userItems) {
  return {
    type: types.SET_USER_ITEMS,
    userItems,
  }
}

export function getUserTags() {
  return {
    type: types.GET_USER_TAGS,
  }
}

export function setUserTags(userTags) {
  return {
    type: types.SET_USER_TAGS,
    userTags,
  }
}

export function updateItemTags() {
  return {
    type: types.UPDATE_ITEM_TAGS,
  }
}