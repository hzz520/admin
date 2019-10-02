import React,{ Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { Form, Icon, Input, Button } from 'antd'
import $ from '../../utils/cookie'

import { login, authenticate } from '../../redux/actions/index.actions'
import './index.scss'

class Login extends Component {
    componentWillMount () {
       const {  authenticate } = this.props.actions
       authenticate()
    //    console.log(1)
    }
    
    handleSubmit = (e) => {
        const { form, actions } = this.props
        e.preventDefault()
        form.validateFields((err,value)=>{
            if(!err) {
                // const form = this.props.form.getFieldsValue()
                let {username,password} = this.props.form.getFieldsValue()
                // console.log(username,password)
                actions.login({username:username,password:password})
            }
        })
    }
    render () {
        const { getFieldDecorator } = this.props.form
        return (
            <div className='login-wrap'>
                <div className='login-content'>
                    <div className='login-main'>
                        <Form onSubmit={this.handleSubmit} className='login-form'>
                            <Form.Item>
                                {
                                    getFieldDecorator('username',{
                                        rules: [{required:true,message:'请输入账号'}]  
                                    })(
                                        <Input prefix={
                                            <Icon type='user'/>
                                        } type='text' placeholder='请输入账号'/>
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                {
                                    getFieldDecorator('password',{
                                        rules: [{required:true,message:'请输入密码'}]  
                                    })(
                                        <Input prefix={
                                            <Icon type='lock'/>
                                        } type='password' placeholder='请输入密码'/>
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                <a className="login-form-forgot" href="">忘记密码</a>
                                <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loginInfo: state.loginInfo
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({login,authenticate}, dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(Login))