import React,{ Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Input, Button, Modal, Table, Select, message } from 'antd'
import { selectEditData } from '../../../redux/actions/selectEditData.action'
import { getActiviteList, addActivite, editActivite, removeActivite } from '../../../redux/actions/activiteList.action'

const { confirm } = Modal
const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select
const formItemLayout = {
    labelCol: { span: 4, offset:2 },
    wrapperCol: { span: 16 }
}

class activiteConfig extends Component {
    constructor (props) {
        super(props)
        const { actions } = this.props
        this.state = {
            type: '新建商品活动',
            visible: false
        }
        this.columns = [
            {
                title: '商品活动ID',
                dataIndex: 'activite_id'
            },
            {
                title: '商品活动名称',
                dataIndex: 'activite_name'
            },
            {
                title: '商品活动优先级',
                dataIndex: 'activite_rank'
            },
            {
                title: '商品活动介绍',
                dataIndex: 'activite_desc'
            },
            {
                title: '操作',
                render: (text) => {
                    return (
                        <div>
                            <a className='mr5' onClick={this.modalEditShow.bind(this,text)}>编辑</a>
                            <a onClick={this.removeItem.bind(this,text)}>删除</a>
                        </div>
                    )
                }
            }
            
        ]
    }

    removeItem (text) {
        const { current, total } = this.props.activiteList
        confirm({
            title: '提示',
            content: '确认要删除吗？',
            onOk:() => {
                this.props.actions.removeActivite({...text,current,total}) 
            }
        })
    }

    modalNewShow () {
        this.setState({
            visible: true,
            type: '新建商品活动'
        })
    }

    modalEditShow (text) {
        const { selectEditData } = this.props.actions
        this.setState({
            visible: true,
            type: '编辑商品活动'
        },()=>{
            selectEditData(text)
        })
    }

    modalOnOk () {
        const { actions, activiteList, form, selectEditData } = this.props
        const { total, current } = activiteList
        const { addActivite, editActivite } = actions
        const { type } = this.state

        form.validateFields({
            first: true,
            force: true
        },(err,vals)=>{
            if(type === '新建商品活动') {
                addActivite({...vals,total,current},(res)=>{
                    this.setState({
                        visible: false
                    },()=>{
                        form.resetFields()
                        actions.selectEditData({})
                    })
                })
            } else {
                if(vals.activite_name === selectEditData.activite_name && vals.activite_desc === selectEditData.activite_desc && vals.activite_rank === selectEditData.activite_rank) {
                    message.warning('您还未作任何修改！')
                    return
                }
                editActivite({...vals,total,current,activite_id:selectEditData.activite_id},(res) => {
                        this.setState({
                            visible: false
                        },()=>{
                            form.resetFields()
                            actions.selectEditData({})
                        })
                    })
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
        const { getActiviteList } = this.props.actions
        getActiviteList()
    }
    
    render () {
        const { actions, activiteList, form, selectEditData } = this.props
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
                        label='商品活动名称'
                        {...formItemLayout}
                        hasFeedback
                    >
                        {
                            getFieldDecorator('activite_name',{
                                initialValue: selectEditData.activite_name || '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入商品活动名称'
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
                        label='商品活动优先级'
                        {...formItemLayout}
                        hasFeedback
                    >
                        {
                            getFieldDecorator('activite_rank',{
                                initialValue: selectEditData.activite_rank || '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择商品活动优先级'
                                    }
                                ]
                            })(
                                <Select className='mw100'>
                                    <Option value=''>请选择商品活动优先级</Option>
                                    <Option value='1'>1</Option>
                                    <Option value='2'>2</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem
                        label='商品活动描述'
                        {...formItemLayout}
                        hasFeedback
                    >
                        {
                            getFieldDecorator('activite_desc',{
                                initialValue: selectEditData.activite_desc || '',
                                rules: [
                                    {
                                       required: true,
                                        message: '请输入商品活动描述' 
                                    }
                                ]
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
                    dataSource={activiteList.data}
                    bordered
                    pagination={{
                        pageSize: 10,
                        current:activiteList.current,
                        showQuickJumper: true,
                        total: activiteList.total,
                        onChange: (page) => {
                            actions.getActiviteList({current:page.current})
                        }
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    activiteList: state.activiteList,
    selectEditData: state.selectEditData
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ selectEditData, getActiviteList, addActivite, editActivite, removeActivite },dispatch)
})


export default  connect(mapStateToProps, mapDispatchToProps)(Form.create()(activiteConfig))