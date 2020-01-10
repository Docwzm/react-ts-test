import Layout from '@/views/layout/index'
import {_loadable} from '@/utils'

const routes = [{
   path: "/healthPro",//健康计划
   component: Layout,
   routes: [
      {
         path: "/healthPro/bp-measure",
         component: _loadable(() => import('@/views/healthPro/bpMeasure'))
      },
      {
         path: "/healthPro/diet",
         component: _loadable(() => import('@/views/healthPro/diet'))
      },
      {
         path: "/healthPro/course",
         component: _loadable(() => import('@/views/healthPro/course'))
      },
      {
         path: "/healthPro/breathing",
         component: _loadable(() => import('@/views/healthPro/breathing'))
      }
   ]
}]

export default routes