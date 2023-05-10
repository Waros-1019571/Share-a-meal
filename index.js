const express = require('express')
const userRoutes = require('./src/routes/user.routes')
const logger = require('tracer').colorConsole()

const app = express()
const port = process.env.PORT || 1337

app.use(express.json())

app.use('/api/user', userRoutes)

app.use('*', (req, res) => {
    logger.warn('Invalid endpoint called: ', req.path)
    res.status(404).json({
      code: 404,
      message: 'Endpoint not found',
      data: {}
    })
})

app.use((err, req, res, next) => {
  logger.error(err?.code, err?.message);
  res.status(err?.code ?? 500).json({
    code: err?.code ?? 500,
    message: err?.message ?? 'Unknown error',
    data: {}
  })
})

app.listen(port, () => {
    logger.info(`Share-a-meal draait nu op port ${port}`)
})

module.exports = { app }