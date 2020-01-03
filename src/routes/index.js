import Layout from '@/views/layout/index'
import Loadable from 'react-loadable'
import loading from '@/views/layout/loading'

function _loadable(loader) {
   return Loadable({
      loader,
      loading
   });
}

const routes = [{
   path: "/healthPro",//健康计划
   component: Layout,
   routes: [
      {
         path: "/healthPro/measure",
         component: _loadable(() => import('@/views/healthPro/measure'))
      },
      {
         path: "/healthPro/foodAndDrink",
         component: _loadable(() => import('@/views/healthPro/foodAndDrink'))
      },
      {
         path: "/healthPro/course",
         component: _loadable(() => import('@/views/healthPro/course'))
      },
      {
         path: "/healthPro/reducePress",
         component: _loadable(() => import('@/views/healthPro/reducePress'))
      }
   ]
}]

export default routes