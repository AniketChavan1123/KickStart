import React,{Component} from 'react';
import { render } from 'react-dom';
import factory from '../ethereum/factory';
import {Button,Card,Menu} from 'semantic-ui-react';
import Layout from '../Component/Layout'
import {Link} from '../routes';


class CampaignIndex extends Component{

    // here static has same meaning like in c++
                                //our getInitialProps is not tied to instance of CampaignIndex
                                // we can directly call it using class name
    static async getInitialProps(){    
        const campaigns=await factory.methods.getDeployedCampaigns().call();
        return {campaigns};
    }

    // async componentDidMount(){  // doing our fetching in our coponentDidMount...
                                //   unfortunately nextjs doesn't execute componentDidMount function on server side
                                // for that we have to use getInitial props
                            //  it is a lifecycle method that is defined exclusively and used exclusively by nextJS
    //     const campaigns=await factory.methods.getDeployedCampaigns().call();
    //     console.log(campaigns);
    // }

    renderCampaigns()
    {
        const items = this.props.campaigns.map(address=>{       // it will loop through
            return{
                header:address,
                description:    
                <Link route={`/campaigns/${address}`}>
                {/* dynamic route-addressing route */}
                    <a>View Campaign</a>
                </Link>,
                fluid: true,
                style: {overflowWrap: 'break-word'}
            }
        });
        return <Card.Group items={items}/>
    }
render(){
    return (
        <Layout>
        <div>
        <h3>Open Campaigns</h3>
        <Link route="/campaigns/new">
            <a>
                <Button floated="right"
                content="Create Campaign"
                primary>+ Create Campaign</Button>
            </a>
        </Link>

        {this.renderCampaigns()}
        {/* first we will place button to the right and then render the page */}

        </div>
        </Layout>
        // all things between Layout tags gets passed as children...and can be accessed as props.children
    );
}
}
 
export default CampaignIndex;