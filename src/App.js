import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import routes from './routes/index';
import { setHtmlFonts, checkEnv } from "./utils/index"

export default function App() {
  useEffect(() => {
    setHtmlFonts()
    window.onresize = function () {
      setHtmlFonts()
    }

    //在测试环境开启控制台
    if (checkEnv() === 'dev') {

    }
  }, [])


  return <Router>
    {
      routes.map((route, index) => {
        return <Route key={index} exact={route.exact} path={route.path} render={props => (
          route.redirect ? <Redirect to={route.redirect} /> : <route.component {...props} routes={route.routes} />
        )}></Route>
      })
    }
  </Router>
}