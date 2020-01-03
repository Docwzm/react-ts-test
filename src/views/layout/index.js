import React from 'react'
import { Route } from "react-router-dom"

export default function Layout(props) {
   return <>
      {
         props.routes.map((route, index) => {
            return <Route key={index} exact={route.exact} path={route.path} render={props => (
               <route.component {...props} routes={route.routes} />
            )} ></Route>
         })
      }
   </>
}