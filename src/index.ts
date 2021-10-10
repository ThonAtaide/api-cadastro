import express from 'express';
const app = express();
const PORT = 5000;

app.get('/', (_req, res) => {
    console.log('Pingando')
    res.status(200).send("Ok ok ok");
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})