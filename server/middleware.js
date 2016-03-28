module.exports = function(app, express) {
  var applicantsRouter = express.Router();
  var recruitersRouter = express.Router();
  var authRouter = express.Router();

  app.use('/api/auth', authRouter);
  app.use('/api/applicant', applicantsRouter);
  app.use('/api/recruiter', recruitersRouter);

  require('./auth/authController.js')(authRouter);
  require('./applicants/applicantRoutes.js')(applicantsRouter);
  require('./recruiters/recruiterRoutes.js')(recruitersRouter);
}
