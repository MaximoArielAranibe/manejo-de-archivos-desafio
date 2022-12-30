import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import productRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
const app = express();

console.log(__dirname);

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(express.static(__dirname + '/public/'))
app.use('/api', productRouter)
app.use('/api', cartsRouter)

//HANDLEBARS
app.engine('handlebars', handlebars.engine()) //Inicializamos
app.set('views', __dirname + 'src/views'); //Donde estan las vistas
app.set('view engine', 'handlebars')

//APP USE
app.use('/api/products', productRouter)
/* app.use('/carts', cartProducts) */




const httpServer = app.listen(8080, console.log("Server running on the port 8080"));

