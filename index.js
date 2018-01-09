const express = require('express');
const bodyParser = require('body-parser')
const githubHelpers = require('../helpers/github.js')
const databaseHelpers = require('../database/index.js')

let app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.use(bodyParser.json())

app.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database
  console.log('Successfully reached the app.post in index.js');

  console.log('this is the body.query of the request: ', req.body.query)

  var userQueryUsername = req.body.query;

  githubHelpers.getReposByUsername(userQueryUsername, function(result) {

    result = JSON.parse(result);
    var numberOfSuccessfulSaves = 0;

    for (var i = 0; i < result.length; i++) {
      var currentRepoData = result[i];
      databaseHelpers.save(currentRepoData.owner.login, currentRepoData.name, currentRepoData.stargazers_count, currentRepoData.html_url, function() {
        numberOfSuccessfulSaves += 1;
        if (numberOfSuccessfulSaves >= result.length) {
          console.log('Successfully finished saving all repos')
          res.json(result);
        }
      })
    }
  })
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
  databaseHelpers.getReposFromDb(function(repoResults) {
    console.log('These are the repo results from within server index.js: ', repoResults);
    res.json(repoResults);
  })

});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

