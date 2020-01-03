import React, { useState, useEffect } from 'react'
import './styles/index.less'

export default function Course() {
    
    const scrollToAnchor = (anchorName) => {
        if (anchorName) {
            // 找到锚点
            let anchorElement = document.getElementById(anchorName);
            // 如果对应id的锚点存在，就跳转到锚点
            if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
        }
    }

    return <div className='course-container'>
        <div onClick={() => scrollToAnchor('question')}>test</div>
        <div className="test">test</div>
        <div id="question">quesiton</div>
    </div>
}