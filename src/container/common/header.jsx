import React,{ Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory, Link } from 'react-router'
import { Layout, Menu, Icon, Button, Avatar, Popover, Tag, Row, Col } from 'antd'

import { loginOut, getUserInfo } from '../../redux/actions/index.actions'

import './header.scss'

const { Header } = Layout

class header extends Component {
    componentWillMount () {
        this.props.actions.getUserInfo()
    }

    render () {
        const { loginInfo, tag, actions } = this.props
        const title = (
            <div className='header-popTitle'>
                <Avatar className='popAvatar' src={ loginInfo.avatar }/>
                <span className='username'>{ loginInfo.username }</span>
            </div>
        )
        const content = (
            <div className='header-popContent'>
                <Link to='/profile' className='profile'><Icon type='user' className='userIcon'/>个人资料</Link>
                <Button className='loginOut' icon='poweroff' type='danger' onClick={()=>{ actions.loginOut() }}>LoginOut</Button>
            </div>
        )
        return (
            <Header>
                <div className='header-left'>
                    <img  src={require('../../img/logo.svg')} onClick={()=>{hashHistory.push('/')}}/>
                    {tag?tag:''}
                </div>
                <div className='header-right' >
                    { loginInfo.role == 0 ? <Button className='system' title="系统" type="primary" shape="circle" icon="setting" onClick={() => { hashHistory.push('/system') }}/> : null}
                    <Popover 
                        overlayClassName='header-pop-profile'
                        title={title} 
                        getPopupContainer={() => {
                            return this.refs['header-right']
                        }}
                        placement='bottomRight' 
                        arrowPointAtCenter='false'
                        content={content}
                        trigger='hover'
                    >
                        <span className='header-avatar' ref='header-right'>
                            <Avatar className='avatar'  src={ loginInfo.avatar }/>
                            <Icon  className='arrow' type="caret-down" />
                        </span>
                    </Popover>
                </div>
            </Header>
        )
    }
}

const mapStateToProps = (state) => ({
    loginInfo: state.loginInfo
})

const mapDispatchToProps = dispatch => ({
    actions:bindActionCreators({ loginOut, getUserInfo }, dispatch)
})


export default connect(mapStateToProps,mapDispatchToProps)(header)