import React, { Component } from 'react';
import {Table,Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import {Router} from '../routes';

class RequestRow extends Component{

    state={
        loading: false,
        disabled:false,
        loadingF:false,
        disabledF:false
    }

    onApprove=async ()=>{
        this.setState({loading:true, disabled:true});
        try{
        const campaign=Campaign(this.props.address);
        const accounts=await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({from:accounts[0]});
        Router.replaceRoute(`/campaigns/${this.props.address}`);
        }
        catch(err){
            console.log(err);
        }
        this.setState({loading:false, disabled: false});
    };
    onFinalize=async ()=>{
        this.setState({loadingF:true,disabledF:true});
        try{
        const campaign=Campaign(this.props.address);
        const accounts=await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({from:accounts[0]});
        Router.replaceRoute(`/campaigns/${this.props.address}`);
        }
        catch(err){
            console.log(err);
        }
        this.setState({loadingF:false, disabledF: false});

    }
   render(){
       const {Row,Cell}=Table;
       const readyToFinalize=this.props.request.approvalCount>(this.props.approversCount/2);
       return(
           <Row disabled={this.props.request.complete} active={readyToFinalize && !this.props.request.complete}>
           {/* if request is finalized grey out the row */}
           {/* if request is reafy to finalize and has not yet been complete...then highlight it */}
             <Cell>{this.props.id}</Cell>  
             <Cell>{this.props.request.description}</Cell>
             <Cell>{web3.utils.fromWei(this.props.request.value)}</Cell>
             <Cell>{this.props.request.recipient}</Cell>
             <Cell>{this.props.request.approvalCount}/{this.props.approversCount}</Cell>
             <Cell>
             {  this.props.request.complete? null : (
                 <Button disabled={this.state.disabled} loading={this.state.loading} onClick={this.onApprove} color="green" basic>Approve</Button>
             )}
             {/* if request is completed then grey ou the whole row and hide both buttons */}
             </Cell>
             
             <Cell>
             {  this.props.request.complete? null : (
             <Button disabled={this.state.disabledF} loading={this.state.loadingF} onClick={this.onFinalize} color="red" basic>Finalize</Button>
             )}
             </Cell>

           </Row>
       )
   }
}
export default RequestRow;