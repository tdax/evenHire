# EvenHire ![](https://travis-ci.org/tdax/evenHire.svg?branch=master)

EvenHire is a responsive web application that removes the unconscious bias from the hiring process by hiding data that might reveal gender or ethnicity, allowing recruiters to diversify their workforce. EvenHire was concieved and by a team of four full-stack software engineers: [Alice Kao](https://github.com/alicekao), [Darko Gjorgoski](https://github.com/darko7), [Thomas Sorensen](https://github.com/tps-80), and [Xavier Hayeck](https://github.com/xhayeck)

#####[Visit the app](http://evenhire.herokuapp.com/#/)

## Tech Stack
![Tech Stack](/client/assets/imgs/evenhire_techstack.jpeg)

## Architecture
![Architecture](/client/assets/imgs/EvenHire-architecture.jpeg)

## Features
- General Features
  - User authentication for two user types: recruiters and applicants
  - RESTful API
  - Postgres relational database
- Applicant Features
  - Browse posted jobs
    - Filter available jobs by keyword
  - Apply to jobs
  - Update already-sent applications
- Recruiter Features
  - Recruiter dashboard
  - Post new jobs
  - Browse applicants by job
      - Filter by new, interested, or rejected applicants
  - Contact applicants

## Future Features
- Search jobs by location or radius
- Upload PDF resume and scrape data while signing up
- Integrate LinkedIn API for signups/logins
- Browse all EvenHire candidates by keyword or skill

## Setup
During development we have the server running on localhost port 8000, but before running locally, be sure to run:
- `npm install` to install our dependencies
- `npm install gulp -g` to make sure gulp is installed
- `gulp start` to build the dist/ folder, start the server with nodemon, and to watch files for changes

We used the [dotenv](https://github.com/bkeepers/dotenv) npm package to configure our development variables. Create a .env file in the root directory with the following variables and their values:
- DATABASE_URL
- DEV_DATABASE_URL
- JWT_SECRET
- MAILGUN_API_KEY
- MAILGUN_DOMAIN

## Contributing
Please refer to the [CONTRIBUTING.md](docs/CONTRIBUTING.md) file to see how to contribute to our project.

## Style Guide
Please refer to the [STYLE-GUIDE.md](docs/STYLE-GUIDE.md) file to see our style guide.

## Testing
For client-side testing we used mocha and chai, and for server-side testing we used mocha and chai along with [supertest](https://github.com/visionmedia/supertest). To run all tests run:
```
gulp tests
```
For server-side tests only, run:
```
gulp serverTest
```
For client-side tests only, run:
```
gulp clientTest
```
## Styling
All of our files and images used for styling are located in the `client/assets/` directory. If gulp is not already running, run gulp to copy images and compile scss into the `dist/` folder.

## Team
We are a team of 4 full-stack software engineers. If you have any questions, please feel free to contact us!

[Thomas Sorensen](https://www.linkedin.com/in/sorensenthomas) | [Github](https://github.com/tps-80)

[Xavier Hayeck](https://www.linkedin.com/in/xhayeck) | [Github](https://github.com/xhayeck)

[Darko Gjorgoski](https://www.linkedin.com/in/darkogjorgoski) | [Github](https://github.com/darko7)

[Alice Kao](https://www.linkedin.com/in/alicekaoak) | [Github](https://github.com/alicekao)
