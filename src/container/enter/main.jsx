import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'

import { Card } from 'antd'
import $ from '../../utils/cookie'
import menuData from '../../constant/menuData.constant'

import { getProjectList } from '../../redux/actions/index.actions'
import './main.scss'



class Main extends Component {
    componentWillMount () {
        let { getProjectList } = this.props.actions
        getProjectList()
    }
    render () {
        let { projectList } = this.props
        return (
            <div className="main_wrapper">
                <div>
                    {
                        projectList.map((d,i)=>{
                            return <Card
                                className='card'
                                key = {i}
                                onClick ={() => {
                                    $.set('project_id',d.project_id,{maxAge:24*3600*1000,path:'/'})
                                    $.set('project_name',d.project_name,{maxAge:24*3600*1000,path:'/'})
                                    hashHistory.push({pathname: `/project_${d.project_id}/goods_list`})
                                }}
                            >
                                <img src={d.project_cover}/>
                            </Card>
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    projectList: state.projectList
})

const mapDispatchToProps = dispatch => ({
    actions:bindActionCreators({ getProjectList }, dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(Main)
