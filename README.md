# [EvenHire](http://evenhire.herokuapp.com/)
Desc
######[Visit the app](http://evenhire.herokuapp.com/#/)

## Introduction
Desc

## Setup
During development we have the server running on localhost port 8000, but before running locally, be sure to run:

- 'npm install' to install our dependencies
- 'npm install gulp -g' to make sure gulp is installed
- 'gulp start' to build the dist/ folder, start the server with nodemon, and to watch files for changes

We used a dotenv npm package to configure our development variables. Create a .env file in the root directory with the following variables and their values:
- DATABASE_URL
- JWT_SECRET
- MAILGUN_API_KEY
- MAILGUN_DOMAIN

## Choice of Technologies
- AngularJS
- NodeJS/Express
- Postgres
- Sequelize
- Karma
- Mocha
- Chai
- Sinon
- Gulp
- SASS

## Features
- General Features
  - User authentication for recruiters and applicants
- Applicant Features
  - Obtain list of jobs available
    - Ordered as most recent posted first
  - Filter available jobs list
    - By location
    - By Job Type
    - By Career Level
    - By Industry
    - By Keyword
- Recruiter Features
  - Post new jobs
  - View all jobs posted by recruiter
  - View applicants to particular jobs
    - Applicants are color coded
      - Red: Recruiter is not interested in applicant
      - Green: Recruiter is interested in applicant
    - Contact button changes to say "emailed" after recruiter has emailed applicant


## Future Features
- General Features
  - 
- Applicant Features
  - Let users know if they've already applied to a particular job
- Recruiter Features
 - Remove filled jobs from job listing

## Contributing
Please refer to the [CONTRIBUTING.md](docs/CONTRIBUTING.md) file to see how to contribute to our project.

## Style Guide
Please refer to the [STYLE-GUIDE.md](docs/STYLE-GUIDE.md) file to see our style guide.

## Testing
For client and server-side testing, we used mocha and chai.

```
gulp tests
```

## Resources
- [Angular](https://docs.angularjs.org/guide)

## Team
We are a team of 4 full-stack software engineers. If you have any questions, please feel free to contact us!

Thomas Sorensen | [Github](https://github.com/tps-80)

Xavier Hayeck | [Github](https://github.com/xhayeck)

Darko Gjorgoski | [Github](https://github.com/darko7)

Alice Kao | [Github](https://github.com/alicekao)
