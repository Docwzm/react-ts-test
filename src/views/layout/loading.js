import React from 'react'
import './styles/loading.less'


export default function Loading() {
    return <div className="ls-loading-box">
        <div className="loader">
            <p className="loading">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
            </p>
        </div>
    </div>
}