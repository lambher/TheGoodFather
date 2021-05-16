<img src="https://cdn-website.partechpartners.com/media/images/Madkudu_Logo_Website.original.png" height=150 alt="Madkudu logo" />

# Madkudu Test

This is a restful API that allow us to fetch a csv file depending on a date and insert each row inside an elasticsearch database.

### Before Installation

Please make sure you already have:

- Docker [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
- Docker Compose [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

### Installation

- `git clone git@github.com:lambher/madkudu-test.git`
- `cd madkudu-test`
- `docker-compose up`

## REST API

**Start Process**
----
  Start proecssing the CSV

* **URL**

  /process-csv

* **Method:**

  `POST`
  
* **Data Params**

  `{"date": "2021/04"}`

* **Success Response:**

  * **Code:** 200 <br />
 
* **Sample Call:**

  ```javascript
    import axios from "axios";
    
    const options = {
      method: 'POST',
      url: 'http://localhost:3001/process-csv',
      headers: {'Content-Type': 'application/json'},
      data: {date: '2021/04'}
    };
    
    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
  ```

**Get Analyses**
----
  Returns :
    - The most active users
    - The events over year
    - The events over month
    - The events over day

* **URL**

  /analyses

* **Method:**

  `GET`
  
* **Success Response:**

  * **Code:** 200 <br />
  * **Example data:**
    ```json
    {
      "most_active_users": [
        {
          "user": "example1@gmail.com",
          "nb_event": 24
        },
        {
          "user": "example2@gmail.com",
          "nb_event": 21
        }
      ],
      "events_over_year": [
        {
          "date": "2021-01-01T00:00:00.000Z",
          "nb_events": 1000000
        }
      ],
      "events_over_month": [
        {
          "date": "2021-03-01T00:00:00.000Z",
          "nb_events": 549124
        },
        {
          "date": "2021-04-01T00:00:00.000Z",
          "nb_events": 450876
        }
      ],
      "events_over_day": [
        {
          "date": "2021-03-15T00:00:00.000Z",
          "nb_events": 32266
        },
        {
          "date": "2021-03-16T00:00:00.000Z",
          "nb_events": 32210
        },
      ]
    }
    ```

* **Sample Call:**

  ```javascript
    import axios from "axios";

    const options = {method: 'GET', url: 'http://localhost:3001/analyses'};

    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
  ```

## Configuration

There are five default environment variables that you can change in the .env file:
- `AWS_BUCKET_HOST` This is the url where all the csv are hosted
- `PORT` This is the port of our API
- `ES_HOST` This is the host of the elasticsearch server
- `BULK_SIZE` This is the limit size of one bulk. It allows to insert multiple documents in one HTTP call in order to optimise the writing time in ES
- `MAX_BULK` This is the maximum of bulks that we can send in the same time

If you want to change them, don't forget to rebuild the container image with `docker-compose build`