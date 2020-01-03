import React, { Component } from 'react';
import './styles/LongTapProgress.less';


class LongTapProgress extends Component {
   state = {
      canvasWidth: 425,
      scale: 5,
      hover: false
   }

   componentDidMount() {
      let { scale } = this.state
      let self = this
      this.frameIn = null
      this.frameOut = null
      this.progress = 0
      setTimeout(() => {
         let canvas = document.getElementById('long-tap-canvas')
         let width = document.getElementById('canvas-wrap').offsetWidth * scale
         self.setState({ canvasWidth: width }, () => {
            self.ctx = canvas.getContext("2d");
         })
      }, 0)
   }

   componentWillUnmount() {
      this.process = 0
   }

   handleTouchStart() {
      this.setState({ hover: true })
      if (!this.frameOut && !this.frameIn && this.progress < 100) {
         this.handleStartAnimate()
      }
   }

   handleTouchEnd() {
      let ctx = this.ctx
      let width = this.state.canvasWidth;
      let callback = this.props.onComplate
      this.setState({ hover: false })
      window.cancelAnimationFrame(this.frameIn)
      this.frameIn = null
      if (!this.frameOut && !this.frameIn) {
         if (this.progress > 0 && this.progress < 100) {
            this.handleCancleAnimate()
         }
         if (this.progress === 100) {
            callback && callback()
            ctx.clearRect(0, 0, width, width)
            this.progress = 0
            //this.handleCancleAnimate()
         }
      }
   }

   handleStartAnimate() {
      this.progress++;
      this.draw()
      if (this.progress < 100) {
         this.frameIn = window.requestAnimationFrame(this.handleStartAnimate.bind(this))
      } else {
         this.frameIn = null
      }
   }

   handleCancleAnimate() {
      this.progress--
      this.drawOut()
      if (this.progress > 0) {
         this.frameOut = window.requestAnimationFrame(this.handleCancleAnimate.bind(this))
      } else {
         this.frameOut = null
      }
   }

   draw() {
      let { scale } = this.state
      let ctx = this.ctx
      let width = this.state.canvasWidth;
      let x = width / 2;
      let y = width / 2;
      let r = (x - 1 * scale);
      let PI = Math.PI;
      let start = 0
      let end = 2 * PI * (this.progress / 100)
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 2 * scale
      ctx.beginPath();
      ctx.arc(x, y, r, start, end, false);
      ctx.stroke();
   }

   drawOut() {
      let { scale } = this.state
      let ctx = this.ctx
      let width = this.state.canvasWidth;
      let x = width / 2;
      let y = width / 2;
      let r = (x - 1 * scale);
      let PI = Math.PI;
      let start = 0
      let end = 2 * PI * (this.progress / 100)
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 2 * scale
      ctx.clearRect(0, 0, width, width)
      ctx.beginPath()
      ctx.arc(x, y, r, end, start, true);
      ctx.stroke();
   }


   render() {
      const { canvasWidth, hover } = this.state
      return (
         <div className='long-press-btn-wrap'>
            <div className={hover ? 'long-press-btn hover' : 'long-press-btn'} >
               <span>长按<br></br>结束</span>
            </div>
            <div id='canvas-wrap' className='long-tab-progress' onTouchStart={this.handleTouchStart.bind(this)} onTouchEnd={this.handleTouchEnd.bind(this)} onContextMenu={() => {
               window.event.returnValue = false;
            }}>
               <canvas id='long-tap-canvas' width={canvasWidth} height={canvasWidth}></canvas>
            </div>
         </div>
      )
   }
}

export default LongTapProgress