import React from 'react';

import {
    EuiHeader,
    EuiHeaderSectionItem,
    EuiHeaderLogo,
    EuiHeaderLink,
  } from '@elastic/eui';
  

const Header = () => {


    return (
        <EuiHeader>
          <EuiHeaderSectionItem border="right">
            <EuiHeaderLogo  iconType="mapMarker" color="red" >Event's-Near-Me!</EuiHeaderLogo>
          </EuiHeaderSectionItem>
          <EuiHeaderSectionItem>
            <EuiHeaderLink href="#" style={{fontSize:'1.2rem'}}>
              <i className="fab fa-github-square"></i> GitHub
              </EuiHeaderLink>
          </EuiHeaderSectionItem>
        </EuiHeader>
    )
}

export default Header