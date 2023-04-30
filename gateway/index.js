import express from "express";
import cors from 'cors';
import proxy from "express-http-proxy";
import morgan from "morgan";


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/customer', proxy('http://localhost:8001'));
app.use('/shopping', proxy('http://localhost:8003'));
// products
app.use('/', proxy('http://localhost:8002'));


app.listen(8000, console.log("Customer is listening on port 8000"));
