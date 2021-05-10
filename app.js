const express = require('express');
const app = express();
const { Elasticsearch } = require('./elasticsearch');
const prcs = require('./process.js');
require('dotenv').config();

const port = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const elasticsearch = new Elasticsearch();
elasticsearch.connection(process.env.ES_HOST).then(() => {
    elasticsearch.checkIndex();
    startApp();
}).catch((err) => {
    console.log(err);
})

function startApp() {
    app.post('/process-csv', (req, res) => {
        const processCSV = new prcs.ProcessCSV(elasticsearch);
        processCSV.run(req.body.date);
        res.send();
    });

    app.get('/analyses', (req, res) => {
        elasticsearch.getAnalyses().then((response) => {
            res.send(response);
        }).catch((err) => {
            res.send(err);
        })
    });

    app.post('/init-mapping', (req, res) => {
        elasticsearch.initMapping('./mapping/events.json');
        res.send();
    });

    app.listen(port, () => {
        console.log(`Madkudu app is listening at http://localhost:${port}`)
    });
}

