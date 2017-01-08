/**
 * Created by admin on 2017/1/8.
 */
import React from 'react';

require('./ControllerUnit.css');

export default class ControllerUnit extends React.Component{

  render(){
    let controllerUnitClassName = 'controller-unit';
    if(this.props.infos.isCenter){
      controllerUnitClassName += ' controller-is-center';
      if(this.props.infos.isInverse){
        controllerUnitClassName += ' controller-is-inverse';
      }
    }

    return(<span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}/>);
  }

  handleClick(event){
    if(this.props.infos.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    event.preventDefault();
    event.stopPropagation();
  }

}
