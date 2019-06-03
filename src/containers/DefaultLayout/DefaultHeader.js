import React, { Component } from 'react';
import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
      <img className="img-fluid custom-brand-logo" src="/assets/img/logo_correapp.png" />
      <AppSidebarToggler className="d-md-down-none" display="lg" />
      </React.Fragment>
    );
  }
}

DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
