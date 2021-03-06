import React, { Component } from 'react';

/** @name ResizeHandlingHoc
 *  @description Calculates width responsively and sets height according to ratioFactor
 *  @param {*} WrappedComponent 
 *  @param {*} ratioFactor  */
function withResizeHandling(WrappedComponent, ratioFactor) {

  return class ResizeHandlingHoc extends Component {
    constructor(props) {
      super(props);
      this.state = {
        chartHeight: null,
        chartWidth: null,
      }
      this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
      this.calculateWidth();
      addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
      removeEventListener('resize', this.handleResize);
      if (this.resizeTimeout !== null) {
        clearTimeout(this.resizeTimeout);
      }
    }    

    calculateWidth() {
      const containerComputedStyles = getComputedStyle(this.container);
      const containerDimensions = {
        width: containerComputedStyles['width'],
        paddingLeft: containerComputedStyles['padding-left'],
        paddingRight: containerComputedStyles['padding-right']
      }

      // get rid of 'px'
      for (let property in containerDimensions) {
        containerDimensions[property] = containerDimensions[property].substr(0, containerDimensions[property].length - 2);
      }

      let { paddingLeft, paddingRight, width } = containerDimensions;
      width = width - paddingLeft - paddingRight;
      let height = width * ratioFactor;
      if (width > 500) {
        height = width * ratioFactor;
      }
      if (width !== this.state.chartWidth) {
        this.setState({
          chartHeight: height,
          chartWidth: width,
        });
      }
    }

    handleResize() {
      if (this.resizeTimeout === null) {
        this.resizeTimeout = setTimeout(() => this.calculateWidth(), 50);
      }
      else {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => this.calculateWidth(), 50);
      }
    }

    render() {
      return ( 
        <div ref={(el) => this.container = el}>
          {this.state.chartWidth !== null && <WrappedComponent
            containerHeight={this.state.chartHeight}
            containerWidth={this.state.chartWidth}
            {...this.props}
          />}
        </div>
      );
    }
  }

}

export default withResizeHandling;
