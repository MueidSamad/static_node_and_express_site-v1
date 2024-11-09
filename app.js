const express = require('express');
const path = require('path');
const data = require('./data.json');

const app = express();

// Set up view engine
app.set('view engine', 'pug');

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { projects: data.projects });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/project/:id', (req, res, next) => {
    const projectId = req.params.id;
    const project = data.projects.find(proj => proj.id === parseInt(projectId));

    if (project) {
        res.render('project', { project });
    } else {
        const err = new Error('Project not found');
        err.status = 404;
        next(err);
    }
});

// Intentional test error for 500 status
app.get('/testerror', (req, res, next) => {
    const err = new Error('Intentional server error.');
    err.status = 500;
    next(err);
});

// 404 Error Handler
app.use((req, res, next) => {
    const err = new Error('The page you are looking for does not exist.');
    err.status = 404;
    console.error(`404 Error: ${err.message}`);
    next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
    err.status = err.status || 500; // Default to 500 if no status
    err.message = err.message || 'Oops! Something went wrong on the server.';

    console.error(`Error ${err.status}: ${err.message}`);

    res.status(err.status);
    res.render('error', { error: err });
});

// Start server
app.listen(3000, () => {
    console.log('The app is listening on port 3000');
});
