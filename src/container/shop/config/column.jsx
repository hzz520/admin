import React,{ Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Input, Button, Modal, Table, message } from 'antd'
import { getColumnList, addColumn, editColumn, removeColumn } from '../../../redux/actions/columList.action'
import { selectEditData } from '../../../redux/actions/selectEditData.action'

const { confirm } = Modal
const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
    labelCol: { span: 4, offset:2 },
    wrapperCol: { span: 16 }
}

class columnConfig extends Component {
    constructor (props) {
        super(props)
        this.state = {
            type: '新建专栏',
            visible: false
        }
        this.columns = [
            {
                title: '专栏ID',
                dataIndex: 'column_id'
            },
            {
                title: '专栏类型名称',
                dataIndex: 'column_name'
            },
            {
                title: '备注',
                dataIndex: 'column_desc'
            },
            {
                title: '操作',
                render: (text) => {
                    return (
                        <div>
                            <a className='mr5' onClick={ this.modalEditShow.bind(this,text) }>编辑</a>
                            <a onClick={ this.removeItem.bind(this,text) }>删除</a>
                        </div>
                    )
                }
            }
        ]
    }

    removeItem (text) {
        const { current, total } = this.props.columnList
        confirm({
            title: '提示',
            content: '确认要删除吗？',
            onOk:() => {
                this.props.actions.removeColumn({...text,current,total}) 
            }
        })
    }

    modalNewShow () {
        this.setState({
            visible: true,
            type: '新建专栏'
        })
    }

    modalEditShow  (text) {
        const { selectEditData } = this.props.actions
        this.setState({
            visible: true,
            type: '编辑专栏'
        },()=>{
            selectEditData(text)
        })
    }

    modalOnOk () {
        const { actions, columnList, form, selectEditData } = this.props
        const { total, current } = columnList
        const { addColumn, editColumn } = actions
        const { type } = this.state

        form.validateFields({
            first: true,
            force: true
        },(err,vals) => {
            if(!err) {
                if (type === '新建专栏') { 
                    addColumn({...vals,total,current},(res)=>{
                            this.setState({
                                visible: false
                            },()=>{
                                form.resetFields()
                                actions.selectEditData({})
                            })
                    })
                } else {
                    if(vals.column_name === selectEditData.column_name && vals.column_desc === selectEditData.column_desc) {
                        message.warning('您还未作任何修改！')
                        return
                    }
                    editColumn({...vals,total,current,column_id:selectEditData.column_id},(res) => {
                        this.setState({
                            visible: false
                        },()=>{
                            form.resetFields()
                            actions.selectEditData({})
                        })
                    })
                }
            }
        })  
    }

    modalOnCancel () {
        const {form, actions} = this.props
        this.setState({
            visible: false
        },()=>{
            actions.selectEditData({})
            form.resetFields()
        })
    }

    componentWillMount () {
        const { getColumnList } = this.props.actions
        getColumnList()
    }
    
    render () {
        const { actions, columnList, form, selectEditData } = this.props
        const { getFieldDecorator } = form
        const { type, visible } = this.state
        return (
            <div>
                <Modal
                    title={type}
                    visible={visible}
                    onOk={this.modalOnOk.bind(this)}
                    onCancel={this.modalOnCancel.bind(this)}
                    okText='确认'
                    cancelText='取消'
                >
                    <FormItem
                        label='专栏名称'
                        {...formItemLayout}
                        hasFeedback
                    >
                        {
                            getFieldDecorator('column_name',{
                                initialValue: selectEditData.column_name || '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入专栏名称'
                                    }
                                ]
                            })(
                                <Input
                                    placeholder='请输入专栏名称'
                                />
                            )
                        }
                    </FormItem>
                    <FormItem
                        label='备注'
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('column_desc',{
                                initialValue: selectEditData.column_desc || ''
                            })(
                                <TextArea rows={6}/>
                            )
                        }
                    </FormItem>
                </Modal>
                <Button 
                    type='primary' 
                    className='mb25'
                    icon='plus'
                    onClick={ this.modalNewShow.bind(this) }>新建</Button>
                <Table
                    columns={this.columns}
                    dataSource={columnList.data}
                    bordered
                    pagination={{
                        pageSize: 10,
                        current:columnList.current,
                        showQuickJumper: true,
                        total:columnList.total,
                        onChange:(page)=>{
                            actions.getColumnList({current:page.current})
                        }
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    columnList: state.columnList,
    selectEditData: state.selectEditData
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ getColumnList,addColumn, editColumn, removeColumn, selectEditData },dispatch)
})


export default  connect(mapStateToProps, mapDispatchToProps)(Form.create()(columnConfig))