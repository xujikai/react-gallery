/**
 * Created by admin on 2017/1/7.
 */
import React from 'react';

require('./ImgFigure.css');

export default class ImgFigure extends React.Component {

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};

  }

  render() {
    var infoStyle = {};
    if (this.props.infos.pos) {
      infoStyle = this.props.infos.pos;
    }
    if (this.props.infos.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(value => {
        infoStyle[value] = 'rotate(' + this.props.infos.rotate + 'deg)';
      });
    }
    if(this.props.infos.isCenter){
      infoStyle.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure' + (this.props.infos.isInverse ? ' is-inverse' : '');
    // console.log('Img render',infoStyle);
    return (
      <figure className={imgFigureClassName} style={infoStyle} onClick={this.handClick.bind(this)}>
        <img src={this.props.data.url} alt={this.props.data.title}/>
        <figcaption className="img-title-layout">
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-inverse">
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }

  handClick(event) {
    if(this.props.infos.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    event.preventDefault();
    event.stopPropagation();
  }

}
