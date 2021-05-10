const parse = require('csv-parse')
const request = require('request');

class ProcessCSV {
    constructor(elasticsearch) {
        this.elasticsearch = elasticsearch;
        this.nbBulk = 0;
    }

    run(date) {
        (async () => {
            let count = 0;
            let events = [];
            let headers = [];

            const parser = request(`${process.env.AWS_BUCKET_HOST}${date}/events.csv`).pipe(parse());

            console.log('start');
            const start = new Date();

            for await (const record of parser) {
                if (count++ === 0) {
                    headers = record;
                    continue;
                }

                const event = {};
                for (let i = 0; i < record.length; i++) {
                    event[headers[i].trim()] = record[i];
                }

                events.push(event);

                if (events.length >= process.env.BULK_SIZE) {
                    await this.insertEvents(events);
                    events = [];
                }

            }

            if (events.length > 0) {
                await this.insertEvents(events);
            }
            console.log('end');
            const end = new Date();

            console.log(`${end - start} ms`);


        })()

    }

    async insertEvents(events) {
        this.nbBulk++;
        const refresh = this.nbBulk >= process.env.MAX_BULK;
        const body = events.flatMap(doc => [{ index: { _index: 'events' } }, doc]);
        console.log(`bulk(${this.nbBulk}) insert ${events.length} events`)
        if (refresh) {
            await this.elasticsearch.client.bulk({ refresh: refresh, body });
        } else {
            this.elasticsearch.client.bulk({ refresh: refresh, body });
        }
        if (refresh) {
            this.nbBulk = 0;
        }
    }
}

exports.ProcessCSV = ProcessCSV;