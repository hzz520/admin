import React,{ Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Button } from 'antd'

import { getPermissionList } from '../../redux/actions/permissionList.action'

class System extends Component {
    
    componentWillMount () {
        this.props.actions.getPermissionList()
    }
    render () {
        const { permissionList } = this.props

        const columns = [{
            title: '邮箱账号',
            dataIndex: 'username'
        }, {
            title: '角色',
            dataIndex: 'role',
            render: (text) => (
                <div>{ !text ? '管理员' : '用户'}</div>
            )
        }, {
            title: '项目权限',
            dataIndex: 'permission'
        }, {
            title: '操作',
            render: (text) => {
                return text.permission_id !== '' ? <div className='hover'>编辑项目权限</div> : <div>无权限操作</div>
            }
        }];
    
        return (
            <div className='pd30'>
                <Button className='mb25' type='primary' icon='plus'>新建</Button>
                <Table
                    className='center-table'
                    columns={columns}
                    dataSource={permissionList}
                    bordered
                    pagination= {{
                        pageSize: 10,
                        showQuickJumper: true,
                    }}
                />
            </div> 
        )
    }
}

const mapStateToProps = (state) => ({
    permissionList: state.permissionList
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ getPermissionList }, dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(System)