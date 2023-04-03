import React from 'react'
import { connect } from 'react-redux'
import Query from './query'
import QueryTable from './query-table'

interface IdentityProps {
  username: string
}

export class Main extends React.Component<IdentityProps>{
  public static defaultProps = {
    username: '',
  }

  render() { console.log("component: main")
    if (this.props.username ) {
      return (
        <>
          <div className="">
            <Query />
          </div>
          <div>
            <QueryTable />
          </div>
        </>
      )
    } else {
      return (
        <div>
          <p>You are not logged in.</p>
        </div>
      )
    }
  }
    
}

const mapStateToProps = ({ user: { username }}:any) => ({
  username,
})

export default connect<any>(mapStateToProps,)(Main)