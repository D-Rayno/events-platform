<<<<<<< HEAD
import apiRoutes from '#start/routes/api'
import webRoutes from '#start/routes/web'

apiRoutes()
webRoutes()
=======
import router from '@adonisjs/core/services/router'
import apiRoutes from './routes/api.js'
import webRoutes from './routes/web.js'

router.group(() => {
  apiRoutes()
  webRoutes()
})
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
