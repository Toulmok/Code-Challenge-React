/* Copyright 2017 Esri
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/*eslint-disable */
import esriConfig from '@arcgis/core/config';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';
import IdentityManager from '@arcgis/core/identity/IdentityManager';
/* eslint-enable */

import { APP_ID, APP_PORTAL_URL } from '../constants/app-constants'

import {
  GET_IDENTITY,
  LOAD_PORTAL,
  SIGN_IN,
  SIGN_OUT,
} from '../constants/action-types'


esriConfig.portalUrl = APP_PORTAL_URL;
const info = new OAuthInfo({ appId: APP_ID, popup: false, portalUrl: APP_PORTAL_URL })

IdentityManager.registerOAuthInfos([info])

/**
 * Middleware function with the signature
 *
 * storeInstance =>
 * functionToCallWithAnActionThatWillSendItToTheNextMiddleware =>
 * actionThatDispatchWasCalledWith =>
 * valueToUseAsTheReturnValueOfTheDispatchCall
 *
 * Typically written as
 *
 * store => next => action => result
 */
const arcgisMiddleWare = store => next => (action) => {
  switch (action.type) {
    case GET_IDENTITY:
      next(action)
      return IdentityManager.checkSignInStatus(`${info.portalUrl}/sharing`)
        .then((result) => { //console.log(result)
          store.dispatch({ type: LOAD_PORTAL })
        })

    case SIGN_IN:
      IdentityManager.getCredential(`${info.portalUrl}/sharing`)
      return next(action)

    case SIGN_OUT:
      IdentityManager.destroyCredentials()
      window.location.reload()
      return next(action)

    default:
      return next(action)
  }
}

export default arcgisMiddleWare