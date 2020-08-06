import mongoose from 'mongoose'

const weatherSchema = new mongoose.Schema ({
  time: {
    type: Date,
    required: true,
  },
  temperature: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    minlength: 2,
    required: true,
  }
},
{
  timestamps: true
})

const Weather = mongoose.model('Weather', weatherSchema)

export default Weather