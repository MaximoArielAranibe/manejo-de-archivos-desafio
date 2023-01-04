//IMPORTS
import CartManager from '../cartmanager.js';
import {Router} from 'express'

//Variables
const router = Router()
const manager = new CartManager('./carrito.json');


router.post('/carts', async (req, res) => {
    const newCart = await manager.addCart()
    res.send({newCart})
})

router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid
    const selCart = await manager.getCartById(cartId)
    res.send({selCart})
})

router.get('/carts', async (req, res) => {
    const carts = await manager.getCarts()
    res.send({carts})
})

router.post('/carts/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = parseInt(req.params.pid)
    await manager.addProductById(cartId,productId,1)
    const selCart = await manager.getCartById(cartId)
    res.send({selCart})
})

export default router;