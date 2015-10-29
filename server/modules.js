qs = Meteor.npmRequire('qs');
request = Meteor.npmRequire('request');
querystring = Meteor.npmRequire('querystring');
future = Meteor.npmRequire('fibers/future');
parser = Meteor.npmRequire('xml2json');
CronJob = Meteor.npmRequire('cron').CronJob;


Meteor.users.deny({
  update: function() {
    return true;
  }
});







