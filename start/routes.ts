import router from '@adonisjs/core/services/router'
import apiRoutes from './routes/api.js'
import webRoutes from './routes/web.js'

router.group(() => {
  apiRoutes()
  webRoutes()
})
