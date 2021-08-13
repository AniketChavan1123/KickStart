import Web3 from 'web3';

let web3;

if(typeof window!=='undefined' && window.web3!=='undefined'){
    // if we are running on browser window is defined and is an object
                                // checking whether we have injected web3 or not   
                                // we are in the browser
       
    web3=new Web3(window.web3.currentProvider);     
                           
}else{
        // if we are running on server then window is undefined
        // we are on server or user is not running metamask

        const provider=new Web3.providers.HttpProvider(
            'https://rinkeby.infura.io/v3/5db396ea7bd048fd93ed09cb1928d1a1'
        );

        web3 =new Web3(provider);

}

// window is global object only available in browser....but not present in react
export default web3;