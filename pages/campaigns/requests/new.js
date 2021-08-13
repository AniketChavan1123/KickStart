// this file is used to create new Request

import React, { Component } from 'react';
import {Form,Button,Message,Input} from 'semantic-ui-react';
import Layout from '../../../Component/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Link,Router} from '../../../routes';

class RequestNew extends Component{

    state={
        value:'',
        description:'',
        recipient:'',
        errorMsg: '',
        loading: false,
        disabled:false
    }

    static async getInitialProps(props){
        const address=props.query.address;
        return {address};       // send address as props property to RequestNew Component
    }
    onSubmit =async (event)=>{
        event.preventDefault();
        this.setState({loading:true, errorMsg:'',disabled:true});
        const campaign=Campaign(this.props.address);
        const {description,value,recipient}=this.state;
        // you only get access to this page if you have created this campaign
        try{
            const accounts=await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value,'ether'),
                recipient
            ).send({from: accounts[0]});
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        }
        catch(err){
            this.setState({errorMsg: err.message});
        }
        this.setState({loading:false, disabled: false});
    }
    render(){
        return(
            <Layout>
            <Link route={`/campaigns/${this.props.address}/requests`}>
                <a><Button secondary> Back</Button></a>
            </Link>
            <h3>Create a Request for your Campaign</h3>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={this.state.description}
                        onChange={(event)=>this.setState({description:event.target.value})}
                    ></Input>
                </Form.Field>

                <Form.Field>
                    <label>Value in ether</label>
                    <Input
                        value={this.state.value}
                        label="ether"
                        labelPosition="right"
                        onChange={(event)=>this.setState({value:event.target.value})}
                    ></Input>
                </Form.Field>

                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={this.state.recipient}
                        onChange={(event)=>this.setState({recipient:event.target.value})}
                    ></Input>
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMsg}/>
                <Button disabled={this.state.disabled} loading={this.state.loading} primary>Create</Button>
            </Form>
            </Layout>
        )
    }
}
export default RequestNew;