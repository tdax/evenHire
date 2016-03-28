angular.module('evenhire.home.factory', [])

  .factory('Home',['$state', function($state) {
    var home = {};
    // Options for forms
    home.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });

    home.careerLevels = ['Entry-level', 'Experienced', 'Manager'];
    home.jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Commission'];
    home.industries = ['Administrative', 'Construction', 'Customer Service', 'Education', 'Financial', 'Healthcare', 'Human Resources', 'Legal', 'Marketing', 'Media', 'Real Estate', 'Retail', 'Sales','Technology', 'Transportation'];
    home.cities = [{fullName: 'San Francisco, CA', shortName: 'San Francisco'}, {fullName: 'Los Angeles, CA', shortName: 'Los Angeles'}, {fullName: 'New York City, NY', shortName: 'New York City'}, {fullName: 'Austin, TX', shortName: 'Austin'}, {fullName: 'Seattle, WA', shortName: 'Seattle'}, {fullName: 'Chicago, IL', shortName: 'Chicago'}];

    return home;
  }]);
