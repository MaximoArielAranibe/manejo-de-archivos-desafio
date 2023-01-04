import express from 'express'

const router = express.Router()

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
        res.render('home', {prodLimit})
    }

    res.render('home', {products})
})


export default router;
