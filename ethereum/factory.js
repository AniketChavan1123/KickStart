// instance of campaign factory from which all campaign are produced
import web3 from './web3';          // importing web3 provided by metamask into web3.js folder

import CampaignFactory from './build/CampaignFactory.json';

const instance=new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x6aBB48791703B96fBf3547bDaA8e4210FA337842'
);
export default instance;