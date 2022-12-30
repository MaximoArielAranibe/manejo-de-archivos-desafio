import { Router } from 'express'
import ProductManager from '../productmanager.js';
const router = Router()

const manager = new ProductManager('./productos.json');


router.get('/products', async (req, res) => {
    const products = await manager.getProducts()
    let limit = req.query.limit
    if (!limit) res.send({products})
    else {
        
        const prodLimit = [];
        if (limit > products.length) limit = products.length;
        for (let index = 0; index < limit; index++) {
            prodLimit.push(products[index]);
        }
        res.send({prodLimit})
    }
})

router.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid
    const pid2 = parseInt(pid)
    const product = await manager.getProductById(pid2)
    console.log(product);
    res.send({product})
})

router.post('/products', async (req, res) => {
    const {title, description, price, code, stock, category, status, thumbnail} = req.body
    const addProduct = await manager.addProduct(title, description, price, code, stock, category, status, thumbnail)
    await manager.getProducts()
    res.send(addProduct)

})

router.put('products/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const updateProduct = await manager.updateProductById({id, title, description, price, code, stock, category, status, thumbnails})
    await manager.getProducts()
    res.send(updateProduct)
})

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    console.log(id);
    const deleteProduct =  await manager.deleteProduct(id)
        await manager.getProducts()
    res.send(deleteProduct)
})

router.get('/home/inicio', async (req, res) =>{
    const products = await manager.getProducts()
    res.render('home',
    {
        title: "Lista de Productos",
        products: products
    })
})

router.get('/realtimeproducts', async (req, res) =>{
    const products = await manager.getProducts()
    res.render('realTimeProducts',
    {
        title: "Lista de Productos",
        products: products
    })

})

export default router;