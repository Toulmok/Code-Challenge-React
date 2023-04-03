import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as qActions from '../../reducer/portal/query/actions'

interface Item {
  id: string,
  title?: string,
  created?: Date,
  tags?: string[],
}

interface ItemProps {
  userItems: Item[],
  userTags: string[],
  updateItemTags: Function,
}

export class QueryTable extends React.Component <ItemProps, any> {
  public static defaultProps = { userItems: [{id:'',}], userTags: ['',]}
  
  addTags() { console.log("'add tag(s)' button clicked")
    this.props.updateItemTags()
  }

  render() { console.log("component: query-table")

    return (
        <table className="center">
          <thead>
            <tr>
              <th>title</th><th>created</th><th>tags</th>
              <th><button className="addTagButton" onClick={() => this.addTags()}>add tag(s)</button></th>
            </tr>
          </thead>
          <tbody>
            {this.props.userItems.map((userItems,index) => (
            <tr key={index} id={userItems.id}>
              <td>{userItems.title}</td>
              <td>{userItems.created!.toDateString()}, Unix:{userItems.created!.getTime().toString()}</td> 
              <td> 
                {userItems.tags!.map((tag,index) => (
                  <span key={index}>
                    <span className="tagButton">{tag}
                      <button className="xButton" onClick={() => {}} disabled>x</button>
                    </span>
                    <span>   </span>
                  </span>
                ))}
              </td>
              <td>
                <select className="selectTags" name={'select'+userItems.id} id={'select'+userItems.id} >
                  <option></option>
                  {(this.props.userTags!
                    .filter(e => !userItems.tags!.includes(e)))
                    .map((tag) => (
                      <option key={tag} value={tag} id={tag+userItems.id}>{tag}</option>  
                    )
                  )}
                </select>
                <input type="text" className="inputTags" name={'input'+userItems.id} id={'input'+userItems.id} placeholder="Custom Tag"/>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
    )
  }
}

const mapStateToProps = ({ query: { userItems, userTags }}:any) => ({
  userItems,
  userTags,
})
function mapDispatchToProps(dispatch:any) {
  return {
    updateItemTags: bindActionCreators(qActions.updateItemTags, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryTable)