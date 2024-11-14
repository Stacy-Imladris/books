import {app} from './app';
import {runDB} from './repositories/db';

const port = process.env.PORT || 2727

const startApp = async () => {
  await runDB()
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

startApp()
