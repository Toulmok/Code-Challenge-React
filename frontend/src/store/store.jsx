import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import authentication from '../middleware/arcgis-authentication'
import portal from '../middleware/arcgis-portal'
import reducer from '../reducer/app'
import { getIdentity } from '../reducer/credentials/actions'

const store = configureStore({
  reducer: reducer,
  middleware: [thunk, authentication, portal],
})

store.dispatch(getIdentity())

if (module.hot) {
  module.hot.accept('../reducer/app', () => {
    // Quite ugly: this piece of code must use AMD because it will be run in the built
    // environment.
    // eslint-disable-next-line
    require(["../reducer/app"], function (nextReducer) {
      store.replaceReducer(nextReducer.default);
    });
  });
}

export default store