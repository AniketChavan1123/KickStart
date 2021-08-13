import React,{Component} from 'react';
import Layout from '../../Component/Layout'
import {Form,Button,Input,Message} from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import {Router} from '../../routes';
// to navigate in our application
// all above are objects

class CampaignNew extends Component{
    state={
        minimumContribution: '',
        errorMsg: '',
        loading: false,
        disabled:false
    }
    onSubmit = async (event)=>{
        event.preventDefault();

        this.setState({loading:true, errorMsg:'',disabled:true});
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.minimumContribution)
            .send({
                from: accounts[0]    
            });
            // no need to specify gas....metamask will automically calculate it for US

            // after creating campaign send user to home page
            Router.pushRoute('/');
        }
        catch(err){
            this.setState({errorMsg: err.message});
        }
        this.setState({loading:false, disabled: false});
        // after creating campaign send user to home page

    }
    render(){
        return  (
            <Layout>
            <h3>Create a Campaign</h3>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
            {/* we don't want to show error box initially...only show when there is error so add err property to form */}
            {/* empty string is considered as false....so initailly red box is not shown...as error={this.state.errmsg} */}
            {/* !! turns anything to true of false */}
                <Form.Field>
                    <label>Minimum contribution</label>
                    {/* we do want to store the minimum contribution */}
                    <Input 
                    label="wei" 
                    labelPosition="right"
                    value={this.state.minimumContribution}
                    onChange={(event)=>{this.setState({minimumContribution: event.target.value})}}
                    
                    ></Input>
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMsg}/>
                <Button disabled={this.state.disabled} loading={this.state.loading} primary style={{marginTop:'10px'}}>Create</Button>
            </Form>
            
            </Layout>
        )
    }
}
export default CampaignNew;