const { Client } = require('@elastic/elasticsearch')

class Elasticsearch {

    connection(host) {
        const ref = this;
        return new Promise((successCallback, failureCallback) => {
            createEsClient(host, function (client) {
                if (client === null) {
                    failureCallback('ELASTICSEARCH: FAIL TO CONNECT');
                } else {
                    ref.client = client;
                    console.log('ELASTICSEARCH: CONNECTED');
                    successCallback();
                }
            });
        });
    }

    // create index events with mapping if it doesn't exist
    checkIndex() {
        this.client.indices.exists({
            index: 'events'
        }).then((response) => {
            if (response.body === false) {
                this.initMapping('events', './mapping/events.json');
            }
        });
    }

    insertEvent(event) {
        this.client.index({
            index: 'events',
            body: event
        }).catch(err => {
            console.log(err);
        });
    }

    initMapping(index, path) {
        const body = require(path);
        this.client.indices.create({
            index: index,
            body: body
        }).then(() => {
            console.log(`${index} index has been created`);
        })
    }

    getAnalyses() {
        return new Promise((successCallback, failureCallback) => {
            this.client.search({
                body: {
                    "size": 0,
                    "aggs": {
                        "events_over_year": {
                            "date_histogram": {
                                "field": "timestamp",
                                "calendar_interval": "year"
                            }
                        },
                        "events_over_month": {
                            "date_histogram": {
                                "field": "timestamp",
                                "calendar_interval": "month"
                            }
                        },
                        "events_over_day": {
                            "date_histogram": {
                                "field": "timestamp",
                                "calendar_interval": "day"
                            }
                        },
                        "most_active_users": {
                            "terms": {
                                "field": "email"
                            }
                        }
                    }
                }
            }).then((response) => {
                const mostActiveUsers = response.body.aggregations.most_active_users.buckets.map(mapMostActiveUsers);
                const eventsOverYear = response.body.aggregations.events_over_year.buckets.map(mapEventsOverTime);
                const eventsOverMonth = response.body.aggregations.events_over_month.buckets.map(mapEventsOverTime);
                const eventsOverDay = response.body.aggregations.events_over_day.buckets.map(mapEventsOverTime);

                successCallback({
                    most_active_users: mostActiveUsers,
                    events_over_year: eventsOverYear,
                    events_over_month: eventsOverMonth,
                    events_over_day: eventsOverDay
                });
            }).catch((err) => {
                failureCallback(err);
            })
        })
    }
}

function mapMostActiveUsers(data) {
    return {
        user: data.key,
        nb_event: data.doc_count
    }
}

function mapEventsOverTime(data) {
    return {
        date: data.key_as_string,
        nb_events: data.doc_count
    }
}

function createEsClient(host, callback) {
    console.log(`ELASTICSEARCH: Trying to connect to es host ${host}`);
    const client = new Client({
        node: host
    });
    client.ping(function (err) {
        if (err) {
            setTimeout(function () { createEsClient(host, callback); }, 3000);
        } else {
            return callback(client);
        }
    });
}


exports.Elasticsearch = Elasticsearch;