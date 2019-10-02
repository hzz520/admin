import React,{ Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
//

import Header from '../common/header'
import { authenticate } from '../../redux/actions/index.actions'


class Enter extends Component {
    constructor (props) {
        super(props)
        this.state = {
            first: true
        }
    }
   
    componentWillMount () {
        this.props.actions.authenticate()
        this.setState({
            first: false
        })
    }

    componentWillUpdate () {
        if(!this.state.first)
            this.props.actions.authenticate()
    }


    render () {
        return (
            <div>
                <Header/>
                { this.props.children }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    
})

const mapDispatchToProps = dispatch => ({
    actions:bindActionCreators({authenticate}, dispatch)
})

export default connect( mapStateToProps,mapDispatchToProps )( Enter )
