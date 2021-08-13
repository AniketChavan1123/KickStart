const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
// last time in lottery we only pulled out abi interface and bytecode

const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;       // accounts that exist in local ganache network
let factory;        // factory contract
let campaignAddress;        // where campaigns are deployed
let campaign;          // campaign contract

beforeEach(async()=>{
    accounts=await web3.eth.getAccounts();

    factory= await new web3.eth.Contract(JSON.parse(compiledFactory.interface))//.Contract expects js object not json
    .deploy({data: compiledFactory.bytecode})
    .send({from: accounts[0],gas:'1000000'});

    //use factory to make instance of campaign
    await factory.methods.createCampaign('100')         // why value as string ...will study later
    .send({from: accounts[0],
            gas:'1000000'});

    const addresses=await factory.methods.getDeployedCampaigns().call();    // view means not changing any data
    campaignAddress=addresses[0];
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface),
    campaignAddress);                   // accessing .. already deployed contract
});

describe('Campaigns',()=>{
    it('deploys a factory and a campaign',()=>{         // to check whether contract has been deployed or not

        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);

    });

    it('marks caller as the campaign manager',async ()=>{
        const manager = await campaign.methods.manager().call();//forEvery public varibale we have get function of it.
        assert.strictEqual(accounts[0],manager);
    });

    it('allows people to contribute money and marks them as approvers',async()=>{
        await campaign.methods.contribute().send({
            value:'200',
            from: accounts[1]// ganache provide us 10 accounts
        });
        // to check whether participant has been marked as contribiutor
        const isContributor = await campaign.methods.approvers(accounts[1]);
        assert(isContributor);      // if false test will fail
        
    });

    it('require a minimum contribution',async()=>{
        try{
            await campaign.methods.contribute().send({
                value:'5',
                from: accounts[1]
            });
            assert(false);
        }
        catch(err){
            assert(err);
        }
    });

    it('allows a manager to make a payment request',async()=>{

        await campaign.methods.createRequest('Buy batteries','100',accounts[1])
        .send({from:accounts[0],
        gas: '1000000'});

        const request=await campaign.methods.requests(0).call();       // request is saved at requests[0]

        assert.strictEqual('Buy batteries', request.description);// to check if correct address is being created or not
    });

    it('processes request',async()=>{
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10','ether')
        });

        await campaign.methods.createRequest('A',web3.utils.toWei('5','ether'),accounts[1])
        .send({from: accounts[0],gas: '1000000'});

        await campaign.methods.approveRequest(0)           //approving request from one approver
        .send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);       
        balance = web3.utils.fromWei(balance,'ether');              // balance is still a string
        balance = parseFloat(balance);

        // ganache network resets between every test but account balance remains doesn't resets
        console.log(balance);
        assert(balance>103);

    });
});
