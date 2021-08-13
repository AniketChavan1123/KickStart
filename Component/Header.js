import React from 'react';
import {Menu} from 'semantic-ui-react';
import {Link} from '../routes'

const Header = () => {
    return ( 
        <Menu style={{marginTop:'20px'}}>
            <Link route='/'>
            
                    <a className='item'>CrownCoin</a>
                
                {/* Link does n't refresh full page but just refreshes the component */}
            </Link>
            <Menu.Menu position='right'>
            <Link route='/'>
                    <a className='item'>Campaign</a>
            </Link><Link route="/campaigns/new">
                    <a className='item'>+</a>
            </Link>
            </Menu.Menu>
        </Menu>
     );
}
 
export default Header;