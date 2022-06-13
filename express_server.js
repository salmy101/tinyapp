const express = require('express');
const app = express(); //makes the server/app an object?
const PORT = 8080


app.get('/', (req,res) => {
  res.send("welcome!")
})

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
}) 