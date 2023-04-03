import Portal from '@arcgis/core/portal/Portal'
import PortalItem from '@arcgis/core/portal/PortalItem'
import{unwrapOrThrow} from "@arcgis/core/core/maybe";
import arcgisError from "@arcgis/core/core/Error";

import {
  LOAD_PORTAL,
  SET_IDENTITY,
  GET_USER_ITEMS,
  SET_USER_ITEMS,
  GET_USER_TAGS,
  SET_USER_TAGS,
  UPDATE_ITEM_TAGS,
} from '../constants/action-types'

const portal = new Portal({ authMode: 'immediate' })
const qParamArray = ['title','type','created','tag']

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
    case LOAD_PORTAL:
      portal.load()
      .then(() => {
        store.dispatch({
          type: SET_IDENTITY,
          username: portal.user.username,
          fullname: portal.user.fullName,
          email: portal.user.email,
          thumbnailurl: portal.user.thumbnailUrl,
        })
        store.dispatch({ type: GET_USER_ITEMS })
      }).then(() => {
        store.dispatch({ type: GET_USER_TAGS })
      })
      break

    case GET_USER_ITEMS:
      //Does this sanitize?
      let myUrlGet = new URL(window.location.href); //console.log(myUrlGet.toString())
      let myUrlHas = new URLSearchParams(myUrlGet.search)
      let qString = ''

      if(myUrlHas.has("dcreated")) {
        let qDCreated = myUrlHas.get("dcreated"); //console.log(qDCreated)
        if((qDCreated !== '')){
          let created = new Date(qDCreated)
          let createdUnix = created.getTime().toString()
          if(myUrlHas.get("rcreated")==="before") {
            createdUnix = '[0 TO ' + createdUnix + ']'
          } else if (myUrlHas.get("rcreated")==="after") {
            createdUnix = '[' + createdUnix + ' TO 99999999999999]'
          }; //console.log(createdUnix)
          myUrlHas.set("created",createdUnix)
        }
      }

      myUrlGet.search = myUrlHas.toString()
      //const new_url = myUrlGet.toString(); console.log(new_url)
      window.history.replaceState('','',myUrlGet.search)

      for (const field of qParamArray) {
        if(myUrlHas.has(field)) {
          if((myUrlGet.searchParams.get(field) !== '')){
            qString += ' AND ' + field + ':' + myUrlGet.searchParams.get(field)
          }
        }
      }
      
      if (portal.user != null) { //console.log("query string is " + qString)
        try { 
          return portal.queryItems({ //portal.user.fetchItems() might be better
            query: `owner:${portal.user.username}` + qString,
            sortField: 'modified',
            sortOrder: 'desc',
            num: 20, //max is 100, default is 10
            start: 1,
          })
          .then(({ results }) => { //console.log(results)
            store.dispatch({ 
              type: SET_USER_ITEMS, userItems: results,
            })
          })
        }
        catch(err) { console.log(err.message) }
        finally { console.log(portal.user.username + ' is getting items') }
      }
      break

    case GET_USER_TAGS:
      if (portal.user != null) {
        try { 
          return portal.user.fetchTags()
          .then((result) => { //console.log(result.map(({tag}) => tag))
            store.dispatch({ 
              type: SET_USER_TAGS, userTags: result.map(({tag}) => tag)
            })
          })
        }
        catch(err) { console.log(err.message) }
        finally { console.log(portal.user.username + ' is fetching tags') }
      }
      break

    case UPDATE_ITEM_TAGS:
      const tagsCsv = [] //: { id: string, tag: string, }[] = []
      document.querySelectorAll("input.inputTags").forEach(input => {
        if (input.value !== '') {
          tagsCsv.push({
            id: input.id.replace('input',''), //(option as HTMLInputElement)
            tag: input.value,
          })
        }
      }); //console.log(tagsCsv)
      document.querySelectorAll("select.selectTags option:checked").forEach(option => {
        if (option.id !== '') {
          tagsCsv.push({
            id: option.id.replace((option.value),''), //(option as HTMLInputElement)
            tag: option.value,
          })
        }
      }); //console.log(tagsCsv)

      tagsCsv.forEach((item) => { //__esri.PortalItemUpdateParams
        const portalItem = new PortalItem({id: item.id})
        const tag = {data: {tag:item.tag}} //{data: {tags:'tag'}}
        
        try{
          portalItem.id?
            portalItem.load()
              .then((()=>unwrapOrThrow(portalItem.portal).signIn()))
                .then(()=>{
                    const t = tag&&tag.data,
                          i = {method:"post"},
                          itemJSON = portalItem.toJSON()
                    i.query = itemJSON
                    
                    if(itemJSON["tags"]) {
                      itemJSON["tags"].sort()
                      itemJSON["tags"]=itemJSON["tags"].join(", ")
                    } //console.log(itemJSON["tags"])
                
                    return (itemJSON.clearEmptyFields)=!0, //'true'
                      null!=t&&(
                        "object"==typeof t&&(itemJSON.tags=(itemJSON["tags"] + ", " + t.tag))
                      ),
                      portalItem.portal.request(`${portalItem.userItemUrl}/update`,i)
                        .then((()=>portalItem.reload()))
                })
                  .then(() => window.location.reload())
          :Promise.reject(
            new arcgisError("portal:item-does-not-exist",
              "The item does not exist yet and cannot be updated"
            )
          )
        }
        catch(err) { console.log(err) }
        finally {console.log(portal.user.username + ' is updating tags')} 
      })
      return(next(action))

    default:
      return next(action)
  }
}

export default arcgisMiddleWare