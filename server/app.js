import express from 'express';
import apiRoutes from './routes/apiRoutes.js';
import cors from 'cors';
import morgan from 'morgan';

// Create express app instance
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs'); // Set view engine to ejs so app can render the ejs to html.
                               // Looks in the default folder views for ejs files
app.use(express.static('public')); // The public folder we want the browser to see

app.use(express.json()); // This is so the express app can parse json now

app.use(cors()); // Allow different origins to recieve a response

app.use(morgan('combined')); // Middleware that allows us to see when request came in. Default is deprecated



// Routes
app.get('/', (req, res) => {
    res.redirect('/api');
});

app.use('/api', apiRoutes);

app.get('/error', (req, res) => {
    res.status(500).render('error', { status: 500, text: 'INTERNAL SERVER COULD NOT FULFILL REQUEST', title: 'Error' });
});
// End of routes



// If no route handler was used that means there was not a page found to render for the user so send error page
app.use((req, res) => {
    res.status(404).render('error', { status: 404, text: 'PAGE COULD NOT BE FOUND', title: 'Error' });
});

// localhost uses ip: 127.0.0.1 which is a loopback address. Traffic sent to this to this address is routed back to the same computer
// Want the server to listen after everything has been executed why its at the bottom
app.listen(PORT, 'localhost', () => {
    // console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Server is running`);
});



