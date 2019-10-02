import React,{ Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'

import { Form, Input, Radio, Select, Button, Table, Modal, Carousel, Icon, Row, Col, message } from 'antd'
import menuData from '../../../constant/menuData.constant'
import { getGoodsList, editGoodsStatus, removeGoods } from '../../../redux/actions/goodsList.action'
import { getColumnList } from '../../../redux/actions/columList.action'
import { breadcrumb, navigation } from '../../../redux/actions/index.actions'
import $ from '../../../utils/cookie'

const Option = Select.Option
const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const SamplePrevArrow = (props) => {
    const {className, style, onClick} = props
    return (
        <div
            className={className}
            onClick={onClick}
        >
            <Icon type='left' style={{ fontSize: 16, color: '#08c' }}/>
        </div>
  );
}

const SampleNextArrow = (props) => {
    const {className, style, onClick} = props
    return (
        <div
            className={className}
            onClick={onClick}
        >
            <Icon type='right' style={{ fontSize: 16, color: '#08c' }}/>
        </div> 
  );
}

class goodsList extends Component {
    constructor (props) {
        super(props)
        let { breadcrumb, navigation, editGoodsStatus } = this.props.actions
        let { current, total } = this.props.goodsList
        let { form } = this.props
        this.state = {
            selectedRowKeys: [],
            selectImgs:[],
            visible: false,
            swiper: null
        }
        this.columns= [
            {
                title: '商品ID',
                dataIndex: 'good_id'
            },
            {
                title: '商品名称',
                dataIndex: 'good_name'
            },
            {
                title: '商品图片',
                dataIndex:'good_imgs',
                render: (text) => {
                    return <a onClick={()=>{
                        this.setState({
                            visible:true,
                            selectImgs:text
                        },()=>{
                            this.setState({
                                swiper: new Swiper('.swiper-container',{
                                    initialSlide: 0,
                                    autoHeight: true,
                                    prevButton:'.swiper-button-prev',
                                    nextButton:'.swiper-button-next',
                                    observer:true,
                                    observeParents:true,
                                })
                            }) 
                        })
                    }}>查看图片</a>
                }
            },
            {
                title: '商品活动ID',
                dataIndex: 'good_activite_ids',
                render: (text) => {
                    return text.map((d, i) => {
                        return (
                            <div key={i}>{d.activite_name}{i < text.length -1 ? ',': ''}</div>
                        )
                    })
                }
            },
            {
                title: '商品专栏',
                dataIndex: 'good_column_ids',
                render: (text) => {
                    return  text.map((d, i) => {
                        return (
                            <div key={i}>{d.column_name}{i < text.length -1 ? ',': ''}</div>
                        )
                    })
                }
            },
            {
                title: '售价/原价',
                render: (text) => {
                    return (
                        <div className='good-price'>
                            <span>{text.good_sprice}</span>/
                            <span>{text.good_oprice}</span>
                        </div>
                    )
                }
            },
            {
                title: '商品状态',
                dataIndex: 'good_status',
                render: (text) => {
                    let status = ''
                    switch (text) {
                        case '1':
                            status = <span className="saleing">出售中</span>
                            break
                        case '2':
                            status = '已下架'
                        default:
                            break;
                    }
                    return status
                }
            },
            {
                title: '实际销量',
                dataIndex: 'good_oSaleCount'
            },
            {
                title: '显示销量',
                render: (text) => {
                    return parseInt(text.good_oSaleCount) + parseInt(text.good_dSaleCount)
                }
            },
            {
                title: '操作',
                render: (text) => {
                    return (
                        <div>
                            <a
                                className='mr5'
                                onClick={()=>{
                                    this.toEditPage(this.props.goodsList.current,text)
                                }}
                            >编辑</a>
                            <a 
                                className='mr5'
                                onClick={()=>{
                                    let type = text.good_status === '1' ? '2' : '1'
                                    editGoodsStatus({
                                        good_ids:[text.good_id],
                                        current:current,
                                        total:total,
                                        type: type,
                                        ...form.getFieldsValue(['good_status'])
                                    })
                                }}
                            >{text.good_status === '1' ? ' 商品下架' : '重新上架'}</a>
                            <a 
                                onClick={()=>{
                                    removeGoods({
                                        good_ids:[text.good_id],
                                        current:current,
                                        total:total,
                                        ...form.getFieldsValue(['good_status'])
                                    })
                                }}
                            >删除</a>
                        </div>
                    )
                }
            }
        ]
    }

    componentWillMount () {
        const { state } = this.props.location
        let cur = state && state.current ? state.current : 1
        const { getGoodsList, getColumnList } = this.props.actions
        getGoodsList({current:cur,...this.props.form.getFieldsValue()})
        getColumnList({pageSize:-1})
    }

    handleStatusSelect (val) {
        this.props.actions.getGoodsList({good_status:val})
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }

    toEditPage (current,text) {
        let sta = {
            navPerKey: menuData[0].key,
            navKey: menuData[0].children[1].key,
            navPerText: menuData[0].text,
            navText: menuData[0].children[1].text,
        }
        let obj = text ? 
            {pathname:`/project_${$.get('project_id')}/goods_edit/edit_${text.good_id}`,state:{...{
                current:current,
                text:text
            },...sta}}
            : {pathname:`/project_${$.get('project_id')}/goods_edit/add`,state:{...{
                current:current
            },...sta}}
        hashHistory.push(obj)
    }
    
    render () {
        let {goodsList,columnList,actions, form } = this.props
        const { getFieldDecorator } = this.props.form
        const { visible, selectImgs, selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: (selectedRowKeys)=>{this.onSelectChange(selectedRowKeys)},
            hideDefaultSelections: true,
            selections: [{
                key: 'all-data',
                text: '选择当前页所有数据',
                onSelect: () => {
                    this.setState({
                        selectedRowKeys: [...goodsList.data.map((d, i) => {
                            return d.key
                        })]
                    })
                },
            }, {
                key: 'odd',
                text: '选择当前页奇数条数据',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                        if (index % 2 !== 0) {
                            return false
                        }
                        return true
                    })
                    this.setState({ selectedRowKeys: newSelectedRowKeys });
                },
            }, {
                key: 'even',
                text: '选择当前页偶数条数据',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                        if (index % 2 !== 0) {
                            return true
                        }
                        return false
                    })
                    this.setState({ selectedRowKeys: newSelectedRowKeys })
                },
            }],
            onSelection: this.onSelection,
        }
        let selectImgsArr = selectImgs.map((d, i) => {
            return (
                <img className='swiper-slide' src={d} key={i} />
            )
        })

        return (
            <div>
                <Modal
                    footer={null}
                    visible={visible}
                    className='good_list'
                    onCancel={()=>{
                        this.setState({
                            visible:false,
                            selectImgs: []
                        },()=>{
                            this.state.swiper.setWrapperTranslate(0)
                            this.state.swiper.destroy()
                            this.setState({
                                swiper:null
                            })
                        })
                    }}
                >
                    <Col span={20} offset={2} className='ovflwY'>
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                {selectImgsArr}
                            </div>
                            <div className="swiper-button-prev"></div>
                            <div className="swiper-button-next"></div>
                        </div>
                    </Col>
                </Modal>
                <FormItem>
                    {
                        getFieldDecorator('good_status', {
                            initialValue: ''
                        })(
                            <RadioGroup size='large' onChange={(e)=>{this.handleStatusSelect(e.target.value)}}>
                                <RadioButton value=''>全部商品</RadioButton>
                                <RadioButton value='1'>出售中</RadioButton>
                                <RadioButton value='2'>已下架</RadioButton>
                            </RadioGroup>
                        )
                    }
                </FormItem>
                <Form
                    layout='inline'
                    className='mb40'
                >
                    <FormItem label='商品专栏'>
                        {
                            getFieldDecorator('good_column_id',{
                                initialValue: ''
                            })(
                                <Select
                                    showSearch
                                    className='mw100'
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=''>请选择专栏</Option>
                                    {
                                        columnList.data.map((d, i)=>{
                                            return (
                                                <Option key={i} value={d.column_id}>{d.column_name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem>                  
                        {
                            getFieldDecorator('good_name',{
                                initialValue: ''
                            })(
                                <Input placeholder='请输入商品名称' type='text'/>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        <Button type='primary' icon='search' onClick={()=>{
                            let { good_name, good_column_id } = form.getFieldsValue()
                            if (good_name === '' && good_column_id === '') {
                                message.warning('请选择专栏或输入关键词')
                                return
                            }
                            actions.getGoodsList({
                                ...form.getFieldsValue()
                            })
                        }}>搜索</Button>
                    </FormItem>
                    <FormItem className='fr'>
                        <Button type='primary' className='ml10' icon='plus'  onClick={this.toEditPage.bind(this, goodsList.current,null)}>新增商品</Button>
                        <Button type='default' className='ml10' icon='delete' 
                            onClick={()=>{
                                actions.removeGoods({
                                    good_ids:selectedRowKeys,
                                    current:goodsList.current,
                                    total:goodsList.total,
                                    ...form.getFieldsValue(['good_status'])
                                })
                            }} 
                            disabled={selectedRowKeys.length === 0}
                        >删除</Button>
                        <Button type='default' className='ml10' icon='arrow-down' 
                            onClick={()=>{
                                actions.editGoodsStatus({
                                    good_ids:selectedRowKeys,
                                    current:goodsList.current,
                                    total:goodsList.total,
                                    type: '2',
                                    ...form.getFieldsValue(['good_status'])
                                })
                            }} 
                            disabled={selectedRowKeys.length === 0}
                            >下架</Button>
                    </FormItem>
                </Form>
                <Table
                    columns={this.columns}
                    dataSource={goodsList.data}
                    rowSelection={rowSelection}
                    bordered
                    expandedRowRender={record => <p style={{ margin: 0 }}>{record.good_desc}</p>}
                    pagination={{
                        current:goodsList.current,
                        pageSize: 10,
                        total:goodsList.total,
                        showQuickJumper: true
                    }}
                    onChange={(page)=>{     
                        actions.getGoodsList({
                            ...form.getFieldsValue(),
                            current:page.current
                        })
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    goodsList: state.goodsList,
    columnList: state.columnList
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ getGoodsList, navigation, breadcrumb, getColumnList, removeGoods, editGoodsStatus },dispatch)
})

export default  connect(mapStateToProps, mapDispatchToProps)(Form.create()(goodsList))