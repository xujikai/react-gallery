import React from 'react';
import ReactDOM from 'react-dom';

import ImgFigure from './ImgFigure';
import ControllerUnit from './ControllerUnit';
require('./App.css');

var imageDatas = require('../data/imageDatas.json');

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgFiguresProps: []
    };
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        topSecY: [0, 0],
        x: [0, 0]
      }
    };
  }

  componentWillMount() {
    for (let i = 0, j = imageDatas.length; i < j; i++) {
      var imageData = imageDatas[i];
      imageData.url = '../images/' + imageData.fileName;
      imageDatas[i] = imageData;
    }
    //console.log(imageDatas);
  }

  render() {

    this.imgFigures = [];
    this.controllerUnits = [];
    imageDatas.forEach((value, index) => {
      if (!this.state.imgFiguresProps[index]) {
        this.state.imgFiguresProps[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate:0,
          isInverse:false,
          isCenter:false,
        };
      }
      this.imgFigures.push(
        <ImgFigure key={index} data={value} ref={'imgFigure' + index}
                   infos={this.state.imgFiguresProps[index]}
                   inverse={this.inverseImg(index)}
                   center={this.centerImg(index)}/>
      );
      this.controllerUnits.push(
        <ControllerUnit key={index} infos={this.state.imgFiguresProps[index]}
                    inverse={this.inverseImg(index)}
                    center={this.centerImg(index)}/>
      );
    });

    //console.log('render',this.imgFigures);
    //<ImgFigure data={{url:'../images/1.jpg',title:'哈哈哈'}} ref={'imgFigure'}/>
    return (
      <section className="stage" ref={"stage"}>
        <section className="stage-img">
          {this.imgFigures}
        </section>
        <nav className="stage-nav">
          {this.controllerUnits}
        </nav>
      </section>
    );
  }

  componentDidMount() {
    //console.log('componentDidMount',"获取组件宽和高");
    /**
     * 获取舞台组件和图片组件的宽和高
     */
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    var imgDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgDOM.scrollWidth,
      imgH = imgDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    /**
     * 计算图片组件在左，上，右区域取的坐标范围
     */
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH,
    };
    this.Constant.hPosRange = {
      leftSecX: [-halfImgW, halfStageW - halfImgW * 3],
      rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
      y: [-halfImgH, stageH - halfImgH]
    };
    this.Constant.vPosRange = {
      topSecY: [-halfImgH, halfStageH - halfImgH * 3 - 30],
      x: [halfStageW - imgW, halfStageW]
    };

    //console.log('componentDidMount',this.Constant);

    this.reLayoutImage(0);
  }

  /**
   * 重新布局所有图片
   * @param centerIndex
   */
  reLayoutImage(centerIndex) {
    let imgPropsArr = this.state.imgFiguresProps;

    let imgPropsArrCenter = imgPropsArr.splice(centerIndex, 1);
    imgPropsArrCenter[0] = {
      pos:this.Constant.centerPos,
      rotate:0,
      isCenter:true,
    };

    let imgTopNumber = Math.floor(Math.random() * 2);
    let imgTopIndex = Math.ceil(Math.random() * (imgPropsArr.length - imgTopNumber));
    let imgPropsArrTop = imgPropsArr.splice(imgTopIndex, imgTopNumber);
    imgPropsArrTop.forEach((value, index) => {
      imgPropsArrTop[index] = {
        pos:{
          left: this.getRandomValue(this.Constant.vPosRange.x[0], this.Constant.vPosRange.x[1]),
          top: this.getRandomValue(this.Constant.vPosRange.topSecY[0], this.Constant.vPosRange.topSecY[1])
        },
        rotate:this.getRandomRotate(),
        isCenter:false
      };
    });

    for (let i = 0, j = imgPropsArr.length, k = j / 2; i < j; i++) {
      let range = null;
      if (i < k) {
        range = this.Constant.hPosRange.leftSecX;
      } else {
        range = this.Constant.hPosRange.rightSecX;
      }

      imgPropsArr[i] = {
        pos:{
          left: this.getRandomValue(range[0], range[1]),
          top: this.getRandomValue(this.Constant.hPosRange.y[0], this.Constant.hPosRange.y[1])
        },
        rotate:this.getRandomRotate(),
        isCenter:false
      }
    }

    if (imgPropsArrTop && imgPropsArrTop.length > 0) {
      imgPropsArr.splice(imgTopIndex, 0, imgPropsArrTop[0]);
    }

    imgPropsArr.splice(centerIndex, 0, imgPropsArrCenter[0]);

    //console.log("reLayoutImage",imgPosArr);
    this.setState({
      imgFiguresProps:imgPropsArr
    });
  }

  /**
   * 翻转图片
   * @param index 翻转图片在状态数组中的索引位置
   */
  inverseImg(index){
    return () => {
      let imgPropsArr = this.state.imgFiguresProps;
      imgPropsArr[index].isInverse = !imgPropsArr[index].isInverse;

      this.setState({
        imgFiguresProps:imgPropsArr
      });
    };
  }

  /**
   * 将指定图片居中显示
   * @param index 居中图片在状态数组中的索引位置
   * @returns {function()}
   */
  centerImg(index){
    return () => {
      this.reLayoutImage(index);
    };
  }

  /**
   * 获取在[min,max]中的值
   */
  getRandomValue(min, max) {
    return Math.ceil((Math.random() * (max - min)) + min);
  }

  /**
   * 获取随机旋转角度
   */
  getRandomRotate(){
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
  }

}

