// to show details about the campaign
import React, { Component } from 'react';
import Layout from '../../Component/Layout'
import Campaign from '../../ethereum/campaign';
import {Card,Grid,Button} from 'semantic-ui-react'
import ContributeForm from '../../Component/ContributeForm';
import web3 from '../../ethereum/web3';
import {Link} from '../../routes';
// here imported Campaign is a function

class CampaignShow extends Component{
    static async getInitialProps(props){
        const campaign = Campaign(props.query.address);
        const summary=await campaign.methods.getSummary().call();
        
            return {
                address: props.query.address,
                minimumContribution: summary[0],
                balance: summary[1],
                requestsCount: summary[2],
                approversCount: summary[3],
                manager: summary[4]
            };
    }

    renderCards(){
        const {balance,manager,minimumContribution,requestsCount,approversCount}=this.props;
        const items = [
            {
              header: manager,
              meta: 'Address of manager',
              description:'The Manager created this campaign and can create request to withdraw money',
              style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description:'You must contributr at least this much wei to become an approver.'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description:'A request to withdraw money from the contract.Request must be approved by approvers'
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description:'Number of people who have already donated to this campaign.'
            },
            {
                header: web3.utils.fromWei(balance,'ether'),
                meta: 'Campaign Balance(ether)',
                description:'The balance is how much this campaign has left to spend.'
            }
          ]
          
          return <Card.Group items={items} />;
    }
    render(){
        return (
            <Layout>
            <h3>Campaign Show</h3>
            <Grid>
            <Grid.Column width={10}>
            <Grid.Row>
                
                {this.renderCards()}
                {/* Request for Project */}
            </Grid.Row>
            <Grid.Row style={{marginTop:'20px'}}>
                <Link route={`/campaigns/${this.props.address}/requests`}>

                <a>
                    <Button primary >View Requests</Button>
                </a>
                </Link>
            </Grid.Row>
            </Grid.Column>

            <Grid.Column width={6}>
            <Grid.Row> 
                <ContributeForm address={this.props.address}></ContributeForm>
                {/* sending address to contribute form */}
            </Grid.Row>
            </Grid.Column>

            </Grid>
            
            
            </Layout>
        )
    }
}
export default CampaignShow;