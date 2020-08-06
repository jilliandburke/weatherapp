import express from 'express'
import Weather from '../models/weather'
import db from '../db/connection'
const apiRouter = express.Router()

// tslint:disable-next-line:no-console
db.once('open', () => console.log('Connected to database'))

apiRouter.get('/api/temperatures', async (req, res) => {
  // Get all temps
  try {
    await Weather.find().sort('-createdAt').exec((err, temps) => {
      if (err) {
        res.send('Error ' + err)
      } else {
        res.send(temps)
      }
    })
  } catch (err) {
    res.send('Error ' + err)
  }
})

apiRouter.post('/api/temperatures', async (req, res) => {
  // Add new temps
  const weather = new Weather({
    time: req.body.time,
    temperature: req.body.temperature,
    location: req.body.location
  })

  await weather.save((err, w) => {
    if (err){
      res.send('Error ' + err)
    } else {
      res.send(w)
    }
  })
})

apiRouter.delete('/api/temperature/:id', async (req, res) => {
  // Delete temp
  try {
    await Weather.deleteOne({_id: req.params.id}).then((err) => {
      if (err) {
        res.send('Error ' + err)
      } else {
        res.status(200).send('Record deleted')
      }
    })
  } catch (err) {
    res.send('Error: ' + err)
  }

})

export default apiRouter
