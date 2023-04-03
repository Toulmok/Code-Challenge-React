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

import React from 'react'
import { connect } from 'react-redux'

import * as cActions from '../../reducer/credentials/actions'

interface IdentityProps {
  username: string
  fullname: string
  thumbnailurl: string
  signIn: Function
  signOut: Function
}

export class IdentityNav extends React.Component<IdentityProps, { open: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = {
      open: false,
    }
  }

  public static defaultProps = {
    username: '',
    fullname: '',
    thumbnailurl: '',
  }

  toggleMenu() { this.setState({ open: !this.state.open }) }
  collapseMenu() { this.setState({ open: false }) }

  render() { console.log("component: identity-nav")
    return (
      <div className="identity">
        <div
          className={`dropdown ${this.props.username ? '' : ' hidden'} ${this.state.open ? ' is-active' : ''}`}
          onBlur={() => this.collapseMenu()}
        >
          <button className="top-nav-link dropdown-btn" onMouseDown={() => this.toggleMenu()}>
            <span className="shortname">{this.props.fullname && this.props.fullname.split(' ')[0]}</span>
            <i className="icon-ui-down-arrow" />
          </button>
          <nav className="dropdown-menu dropdown-right modifier-class">
            <span className="dropdown-title">{this.props.username}</span>
            <a
              href="#sign-out"
              id="sign-out"
              className="dropdown-link"
              onMouseDown={this.props.signOut()}
            >
              Sign Out
            </a>
          </nav>
        </div>
        <button id="sign-in" className={this.props.username ? 'hidden' : 'top-nav-link'} onClick={this.props.signIn()}>
          <i className="icon-ui-user" />
          Sign In
        </button>
      </div>
    )
  }
}

const mapStateToProps = ({ user: { username, fullname, thumbnailurl } }:any) => ({
  username,
  fullname,
  thumbnailurl,
})

const mapDispatchToProps = (dispatch: any) => ({
  signIn() {
    return () => {
      dispatch(cActions.signIn())
    }
  },
  signOut() {
    return () => {
      dispatch(cActions.signOut())
    }
  },
})

export default connect<any,Function,any>(mapStateToProps, mapDispatchToProps)(IdentityNav)