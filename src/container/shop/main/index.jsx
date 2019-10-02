import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, hashHistory } from 'react-router'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'

// import { Tag } from 'antd'
import menuData from '../../../constant/menuData.constant'
import Header from '../../common/header'
import { authenticate, navigation, breadcrumb, checkProject } from '../../../redux/actions/index.actions'
import $ from '../../../utils/cookie'

import './index.scss'

const { Content, Sider } = Layout
const { Item, SubMenu } = Menu

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            first: true,
            collapsed: false
        }
    }

    componentWillMount() {
        const { actions, location } = this.props
        const { state } = location
        const { authenticate, navigation, breadcrumb, checkProject } = actions
        const nav = !(state && state.navKey) ? !menuData[0].children ? [menuData[0].key] : [menuData[0].key, menuData[0].children[0].key] : state.navPrevKey ? [state.navPrevKey, state.navKey] : [state.navKey]
        const bre = !(state && state.navKey) ? !menuData[0].children ? [menuData[0].text] : [menuData[0].text, menuData[0].children[0].text] : state.navPrevText ? [state.navPrevText, state.navText] : [state.navText]
        this.setState({
            first: false,
            nav
        })
        authenticate()
        checkProject()
        if (location.pathname.indexOf('edit') === -1) {
            navigation(nav)
            breadcrumb(bre)
        }
    }

    componentWillUpdate() {
        const { authenticate, checkProject } = this.props.actions
        if (!this.state.first) {
            authenticate()
            checkProject()
        }
    }

    onCollapse(collapsed) {
        this.setState({ collapsed })
    }

    renderMenu(navigationArr) {
        const { breadcrumb, navigation } = this.props.actions
        return (
          <Menu
              mode="inline"
              defaultOpenKeys={[this.state.nav[0]]}
              selectedKeys={[this.props.navigationArr[1]]}
              className="menu"
            >
              {
                    menuData.map((d)=>{
                        if(d.children) {
                            return (
                                <SubMenu
                                    key={d.key}
                                    title={<span><Icon type={d.icon}/><span>{d.text}</span></span>}
                                >
                                    {d.children.map(data=>{
                                        return (
                                            <Item key={data.key}>
                                                <span><Icon type={data.icon}/><span>{data.text}</span></span>
                                                <Link onClick={()=>{
                                                    breadcrumb([d.text, data.text])
                                                    navigation([d.key, data.key])
                                                    let pathname = data.link !== 'goods_edit' ? `/project_${$.get('project_id')}/${data.link}` : `/project_${$.get('project_id')}/${data.link}/add`
                                                    hashHistory.push({pathname: pathname, state: {navPrevKey: d.key, navKey: data.key, navPrevText: d.text, navText: data.text}})
                                                }}/>
                                            </Item>
                                        )
                                    })}
                                </SubMenu>
                            )
                        } 
                            return (
                                <Item key={d.key}>
                                    <span><Icon type={d.icon}/><span>{d.text}</span></span>
                                    <Link onClick={()=>{
                                        breadcrumb([d.text])
                                        navigation([d.key])
                                        hashHistory.push({pathname: `/project_${$.get('project_id')}/${d.link}`, state:{navKey: d.key,navText: d.text}})
                                    }}/>
                                </Item>
                            )
                        
                    })
                }
            </Menu>
        )
    }

    render() {
        const tag = $.get('project_id') ? <span>欢迎来到<i>{this.props.project.project_name || $.get('project_name')}</i>管理系统</span> : ''
        const { navigationArr, breadcrumbArr } = this.props
        return (
          <div className="shop_main">
              <Header tag={tag} />
              <Layout>
                  <Sider
                      className="sider"
                      collapsible
                      collapsed={this.state.collapsed}
                      onCollapse={this.onCollapse.bind(this)}
                    >
                      {this.renderMenu(navigationArr)}
                    </Sider>
                  <Layout className="panel">
                      <Breadcrumb className="breadcrum">
                          {
                                breadcrumbArr.length > 0 && breadcrumbArr.map((d, i) => (
                                        <Breadcrumb.Item key={i}>{d}</Breadcrumb.Item>
                                    ))
                            }
                        </Breadcrumb>
                      <Content className="content">
                          {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    navigationArr: state.navigationArr,
    breadcrumbArr: state.breadcrumbArr,
    project: state.projectList[0]
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
 authenticate, navigation, breadcrumb, checkProject 
}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)
