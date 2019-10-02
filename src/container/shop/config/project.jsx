import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Input, Button, message, Upload, Icon, Modal, Col } from 'antd'

import { getProjectList, projectEdit } from '../../../redux/actions/index.actions'
import { removeImg } from '../../../redux/actions/handleImg.action'
import $ from '../../../utils/cookie'

const FormItem = Form.Item
const formItemLayOut = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 }
}
let flag = false

class projectConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            removeUrl: ''
        }
    }

    componentWillMount() {
        this.props.actions.getProjectList({
            project_id: $.get('project_id')
        }, (res) => {
            this.setState({
                fileList: [{
                    uid: 0,
                    url: res.data[0].project_cover,
                    status: 'done'
                }],
                removeUrl: res.data[0].project_cover
            })
        })
    }

    render() {
        const { previewVisible, previewImage, fileList, removeUrl } = this.state
        const { form, project } = this.props
        const { project_id, project_name, project_cover } = this.props.project
        const { getFieldDecorator } = this.props.form
        const { removeImg, projectEdit } = this.props.actions
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        return (
            <div>
                <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible: false,previewImage:''})}}>
                    <img style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <FormItem label='项目名称' {...formItemLayOut} hasFeedback>
                    {
                        getFieldDecorator('project_name',{
                            initialValue: project_name || '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入项目名称'
                                }
                            ]
                        })(
                            <Input placeholder='请输入项目名称' type='text'/>
                        )
                    }
                </FormItem>
                <FormItem label='项目图片' {...formItemLayOut} hasFeedback>
                    {
                        getFieldDecorator('project_cover',{
                            initialValue: {fileList:this.state.fileList},
                            rules: [
                                {
                                    required: true,
                                    message: '请选择图片'
                                }
                            ]
                        })(
                            <Upload
                                action='/api/chat/uploadImgs'
                                listType="picture-card"
                                fileList={fileList}
                                showUploadList={{
                                    showRemoveIcon: false
                                }}
                                onPreview={(file)=>{
                                    this.setState({
                                        previewImage: file.url || file.thumbUrl,
                                        previewVisible: true
                                    })
                                }}
                                onChange={({fileList})=>{
                                    fileList = fileList.slice(-1)
                                    this.setState({fileList:fileList})                    
                                }}
                            >
                                 {uploadButton}
                            </Upload>
                        )
                    }
                </FormItem>
                <Col offset={2}>
                    <Button type='primary' onClick={() => {
                        if (!flag) {
                            message.warning('您未做任何修改')
                            return
                        }
                        projectEdit({
                            files: fileList,
                            field: {
                                project_name: form.getFieldsValue().project_name,
                                project_id: $.get('project_id'),
                                removeUrl: removeUrl
                            }
                        })
                    }}>提交</Button>
                </Col> 
            </div> 
        )
    }
}


const mapStateToProps = (state) => ({
    project: state.projectList[0]
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ getProjectList, removeImg, projectEdit },dispatch)
})


export default  connect(mapStateToProps, mapDispatchToProps)(Form.create({
    onValuesChange:() =>{
        if (!flag) 
            flag = true
    }
})(projectConfig))