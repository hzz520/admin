import React,{ Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'

import { Form, Input, Radio, Select, Button, Tabs, Modal, Upload, Icon, Col, message} from 'antd'
import { getGoodData, selectEditData } from '../../../redux/actions/selectEditData.action'
import { addGood, editGood } from '../../../redux/actions/goodsList.action'
import { getColumnList } from '../../../redux/actions/columList.action'
import { getActiviteList } from '../../../redux/actions/activiteList.action'
import { removeImg } from '../../../redux/actions/handleImg.action'
import { navigation, breadcrumb } from '../../../redux/actions/index.actions'

import $ from '../../../utils/cookie'
import menuData from '../../../constant/menuData.constant'

const Option = Select.Option
const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const { TextArea } = Input
const { TabPane } = Tabs
let flag = false

class goodsEdit extends Component {
    constructor (props) {
        super(props)
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList:[],
            activeIndex:'1'
        }
    }

    componentWillMount () {
        const { params, actions,form } = this.props
        const { getGoodData, getColumnList, getActiviteList, breadcrumb, navigation } = actions
        breadcrumb([menuData[0].text,menuData[0].children[1].text])
        navigation([menuData[0].key,menuData[0].children[1].key])
        getColumnList({pageSize:-1})
        getActiviteList({pageSize:-1})
        if (params.type.indexOf('add') === -1) {
            let goodId = params.type.slice(params.type.indexOf('_')+1)
            getGoodData(goodId,(imgs)=>{
                let imgsArr = []
                imgs.map((d, i)=> {
                    imgsArr.push({
                        uid: i,
                        url: d,
                        status: 'done'
                    })
                })
                this.setState({
                    fileList:imgsArr
                })
            })
        }
    }


    componentWillUnmount () {
        this.props.actions.selectEditData({})
    }

    nextStep () {
        this.props.form.validateFieldsAndScroll([
            'good_name',
            'good_column_ids',
            'good_imgs',
            'good_desc'
        ],{
            first:true,
            force: true
        },(err,vals)=>{
            if(!err) {
                this.setState({
                    activeIndex: '2',
                    done: true
                })
            }
        })
    }

    sendData () {
        let This = this
        const { form, location, actions, selectEditData } = this.props
        const { current } = location.state
        const { fileList } = this.state
        
        form.validateFieldsAndScroll([
            'good_name',
            'good_column_ids',
            'good_imgs',
            'good_desc'
        ],{
            first:true,
            force: true
        },(err)=>{ 
            let vals = form.getFieldsValue()      
            if(!err) {
                form.validateFieldsAndScroll([
                    'good_sprice',
                    'good_oprice',
                    'good_dSaleCount',
                    'good_status'
                ],{
                    first:true,
                    force: true
                },(err)=>{
                    if(!err) {
                        if(!flag){
                            message.warning('您还未作任何修改')
                            return
                        }
                            
                        let good_column_ids_temp = vals.good_column_ids.map((d, i)=>{
                            return d.slice(d.indexOf('_') + 1)
                        })
                        let good_activite_ids_temp = vals.good_activite_ids.map((d, i)=>{
                            return d.slice(d.indexOf('_') + 1)
                        })
                        vals.good_activite_ids = good_activite_ids_temp
                        vals.good_column_ids = good_column_ids_temp
        
                        if (location.pathname.indexOf('/add') > -1) {
                            actions.addGood({
                                field: {...vals,good_imgs:undefined},
                                files: fileList
                            },()=>{
                                This.onCancel()
                            })
                        } else {
                            actions.editGood({
                                field:{
                                    ...{...vals,good_imgs:undefined},
                                    good_id:selectEditData.good_id
                                },
                                files:fileList
                            },
                            undefined,
                            ()=>{
                                This.onCancel()
                            })
                        }
                    }
                })
            } else {
                this.setState({
                    activeIndex: '1'
                })
            }
        })
    }

    onCancel () {
        const { navigation, breadcrumb, location } = this.props.actions
        navigation([menuData[0].key,menuData[0].children[0].key])
        breadcrumb([menuData[0].text,menuData[0].children[0].text])
        hashHistory.push({pathname:`/project_${$.get('project_id')}/${menuData[0].children[0].key}`,state:{current:this.props.location.state.current}})
    }

    render () {
        const { form, columnList, activiteList, selectEditData, actions, location } = this.props
        const { activeIndex, previewVisible, previewImage, fileList } = this.state
        const { removeImg } = actions
        const { getFieldDecorator } = form
        const formItemLayOut = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 }
        }
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )

        let activites = activiteList.data.map((d, i) => {
            return (
                <Option key={d.key} value={`${d.activite_name}_${d.activite_id}`}>{d.activite_name}</Option>
            )
        })
        let columns = columnList.data.map((d, i) => {
            return (
                <Option key={d.key} value={`${d.column_name}_${d.column_id}`}>{d.column_name}</Option>
            )
        })
        let column_selected=[], activite_selected=[]
        selectEditData.good_activite_ids && selectEditData.good_activite_ids.map((d, i) => {
            activite_selected.push(`${d.activite_name}_${d._id}`)
        })

        selectEditData.good_column_ids && selectEditData.good_column_ids.map((d, i)=>{
            column_selected.push(`${d.column_name}_${d._id}`)
        })


        return (
            <div>
                <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible: false,previewImage:''})}}>
                    <img style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <Tabs
                    activeKey={activeIndex}
                    tabPosition='right'
                    onTabClick={(tab)=>{
                        this.setState({
                            activeIndex: tab
                        })
                    }}
                >
                    <TabPane tab='基本信息' key='1'>
                        <FormItem label='商品名称' {...formItemLayOut} hasFeedback>
                            {
                                getFieldDecorator('good_name',{
                                    initialValue: selectEditData.good_name || '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入商品名称'
                                        }
                                    ]
                                })(
                                    <Input placeholder='请输入商品名称' type='text'/>
                                )
                            }
                        </FormItem>
                        <FormItem label='商品活动ID' {...formItemLayOut}>
                            {
                                getFieldDecorator('good_activite_ids',{
                                    initialValue: activite_selected || []
                                })(
                                    <Select
                                        mode='multiple'
                                        className='mw100'
                                        placeholder='请选择商品活动ID'
                                    >
                                        {
                                            activites
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label='所属专栏' {...formItemLayOut} hasFeedback>
                            {
                                getFieldDecorator('good_column_ids',{
                                    initialValue: column_selected.length > 0  ? column_selected : undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择专栏'
                                        }
                                    ]
                                })(
                                    <Select 
                                        className='mw100'
                                        mode='multiple'
                                        placeholder='请选择专栏'
                                    >
                                        {
                                            columns
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label='商品图片' {...formItemLayOut} hasFeedback>
                            {
                                getFieldDecorator('good_imgs',{
                                    initialValue: location.pathname.indexOf('/add') === -1 ? {fileList:this.state.fileList} : '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择图片'
                                        },
                                        {
                                            validator: (rule, value, callback) => {
                                                if (this.state.fileList.length === 0) {
                                                    callback('请选择图片')
                                                } else {
                                                    callback()
                                                }
                                            }
                                        }
                                    ]
                                })(
                                    <Upload
                                        action='/api/chat/uploadImgs'
                                        listType="picture-card"
                                        data={{
                                            good_id: selectEditData.good_id || undefined
                                        }}
                                        fileList={fileList}
                                        onPreview={(file)=>{
                                            this.setState({
                                                previewImage: file.url || file.thumbUrl,
                                                previewVisible: true
                                            })
                                        }}
                                        onChange={({fileList})=>{
                                            this.setState({fileList})
                                        }}
                                        onRemove={(file,fileList)=>{ 
                                            let url = file.url ? file.url : undefined
                                            file.url ? removeImg(url,selectEditData.good_id) : null
                                        }}
                                    >
                                        {fileList.length >= 5 ? null : uploadButton}
                                    </Upload>
                                )
                            }
                        </FormItem>
                        <FormItem label='商品描述' {...formItemLayOut} hasFeedback>
                            {
                                getFieldDecorator('good_desc',{
                                    initialValue: selectEditData.good_desc || '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入商品描述'
                                        }
                                    ]
                                })(
                                    <TextArea rows={7}  placeholder='请输入商品描述'/>
                                )
                            }
                        </FormItem>
                        <Col offset={2}>
                            <Button 
                                type='primary' 
                                onClick={ this.nextStep.bind(this) }
                            >
                                下一步
                            </Button>
                            <Button type='default' className='ml10' onClick={ this.onCancel.bind(this) }>取消</Button>
                        </Col> 
                    </TabPane>
                    <TabPane tab='销售信息' key='2'>
                        <FormItem label='商品售价' {...formItemLayOut} hasFeedback>
                            {
                                getFieldDecorator('good_sprice',{
                                    initialValue: selectEditData.good_sprice || '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入商品售价'
                                        },
                                        {
                                            pattern:/^[0-9]{1,}$/,
                                            message: '请输入数字类型'
                                        }
                                    ]
                                })(
                                    <Input placeholder='请输入商品售价'/>
                                )
                            }
                        </FormItem>
                        <FormItem label='商品原价' {...formItemLayOut} hasFeedback>
                            {
                                getFieldDecorator('good_oprice',{
                                    initialValue: selectEditData.good_oprice || '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入商品原价'
                                        },
                                        {
                                            pattern:/^[0-9]{1,}$/,
                                            message: '请输入数字类型'
                                        }
                                    ]
                                })(
                                    <Input  placeholder='请输入商品原价'/>
                                )
                            }
                        </FormItem>
                        <FormItem label='实际销量' {...formItemLayOut}>
                            <Input disabled defaultValue={selectEditData.good_oSaleCount || 0}/>
                        </FormItem>
                        <FormItem label='显示销量增量' {...formItemLayOut} hasFeedback>
                            {
                                getFieldDecorator('good_dSaleCount',{
                                    initialValue: selectEditData.good_dSaleCount || '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入显示销量增量'
                                        },
                                        {
                                            pattern:/^[0-9]{1,}$/,
                                            message: '请输入数字类型'
                                        }
                                    ]
                                })(
                                    <Input  placeholder='请输入显示销量增量'/>
                                )
                            }
                        </FormItem>
                        <FormItem label='商品状态' {...formItemLayOut} hasFeedback>
                            {
                                getFieldDecorator('good_status',{
                                    initialValue: selectEditData.good_status || '1',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择商品状态'
                                        }
                                    ]
                                })(
                                   <RadioGroup>
                                       <RadioButton value='1'>销售中</RadioButton>
                                       <RadioButton value='2'>已下架</RadioButton>
                                   </RadioGroup>
                                )
                            }
                        </FormItem>
                        <Col offset={2}>
                            <Button type='primary' onClick={ this.sendData.bind(this) }>保存</Button>
                            <Button type='default' className='ml10'>取消</Button>
                        </Col>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    selectEditData: state.selectEditData,
    columnList: state.columnList,
    activiteList: state.activiteList
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ navigation, breadcrumb, getGoodData, getColumnList, getActiviteList, removeImg, addGood, editGood, selectEditData },dispatch)
})

export default  connect(mapStateToProps, mapDispatchToProps)(Form.create({
    onValuesChange:() =>{
        if (!flag) 
            flag = true
    }
})(goodsEdit))