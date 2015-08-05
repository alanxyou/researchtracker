// Module dependencies
var application_root = __dirname,
    express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler');

    
// Create server
var app = express();


// Where to serve static content
app.use(express.static(path.join(application_root, 'site')));
app.use(bodyParser());


// Start server
var port = 4711;

app.listen(port, function() {
  console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});


// Routes
app.get('/api', function(request, response) {
  response.send('Library API is running.')
});


// Connect to database
mongoose.connect('mongodb://localhost/library_database');


// Schemas
var Project = new mongoose.Schema({
  title: String,
  attending: String,
  resident: String
});


// Models
var ProjectModel = mongoose.model('Project', Project);


// Configure server
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  // parses request body and populates request.body
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
  // checks request.body for HTTP method overrides
  app.use(methodOverride('X-HTTP-Method-Override'));
  
  // where to serve static content
  app.use(express.static(path.join(application_root, 'site')));
  
  // show all errors in development
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}


// Get a list of all Projects
app.get('/api/projects', function(request, response) {
  return ProjectModel.find(function(err, projects) {
    if (!err) {
      return response.send(projects);
    }
    else {
      return console.log(err);
    }
  });
});

// Insert a new Project
app.post('/api/projects', function(request, response) {
  var project = new ProjectModel({
    title: request.body.title,
    attending: request.body.attending,
    resident: request.body.resident
  });
  
  return project.save(function(err) {
    if (!err) {
      console.log('created');
      return response.send(project);
    }
    else {
      console.log(err);
    }
  });
});

// Get a single Project by ID
app.get('/api/projects/:id', function(request, response) {
  return ProjectModel.findById(request.params.id, function(err, project) {
    if (!err) {
      return response.send(project);
    }
    else {
      return console.log(err);
    }
  });
});

// Update a Project
app.put('/api/projects/:id', function(request, response) {
  console.log('Updating project ' + request.body.title);
  return ProjectModel.findById(request.params.id, function(err, project) {
    project.title = request.body.title;
    project.attending = request.body.attending;
    project.resident = request.body.resident;
    
    return project.save(function(err) {
      if (!err) {
        console.log('project updated');
        return response.send(project);
      }
      else {
        console.log(err);
      }
    });
  });
});

// Delete a Project
app.delete('/api/projects/:id', function(request, response) {
  console.log('Deleting project with id: ' + request.params.id);
  return ProjectModel.findById(request.params.id, function(err, project) {
    return project.remove(function(err) {
      if (!err) {
        console.log('project removed');
        return response.send('');
      }
      else {
        console.log(err);
      }
    });
  });
});