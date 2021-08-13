import { Router } from '../routes';
import React, { Component } from 'react';
import { render } from 'react-dom';
import {Form,Input,Message,Button} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';



class ContributeForm extends Component{

    state={
        value:'',
        errorMsg: '',
        loading: false,
        disabled:false
        
    }
    onSubmit=async (event)=>{
        event.preventDefault();
        // to prevent from submitting itself
        this.setState({loading:true, errorMsg:'',disabled:true});
        const campaign=Campaign(this.props.address);    // sending address to get partcular campaing and to donate.
        
        try{
            const accounts=await web3.eth.getAccounts();    // this will ask meta mask to give list of accounts
            await campaign.methods.contribute()
            .send({
                from: accounts[0],       // from list of account send ether from account[0]
                value: web3.utils.toWei(this.state.value, 'ether')
            });
        Router.replaceRoute(`/campaigns/${this.props.address}`);
        // reload component after transaction successs
        // we didn't use Router.pushRoute because it stores the history so when user click back button
        // he will land on same page he is currently in

        }
        catch(err){
            this.setState({errorMsg: err.message});
        }
        this.setState({loading:false, disabled: false});

    }
    render(){
        return(
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                <Form.Field>
                    <label>Amount to Contibute</label>
                    <Input
                        value={this.state.value}
                        // initally value is empty
                        label="ether"
                        labelPosition="right"
                        onChange={event=>this.setState({value: event.target.value})}
                      />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMsg}/>
                <Button disabled={this.state.disabled} loading={this.state.loading} primary>
                    Contribute!
                </Button>
            </Form>
        )
    }
}
export default ContributeForm;