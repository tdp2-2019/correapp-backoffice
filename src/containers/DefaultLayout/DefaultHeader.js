import React, { Component } from 'react';

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
      </React.Fragment>
    );
  }
}

DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
