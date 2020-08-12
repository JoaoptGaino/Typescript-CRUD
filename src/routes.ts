import express from 'express';
import ProductsController from './controllers/ProductsController'
const routes = express.Router();
const productsController = new ProductsController()
routes.get('/',(req,res)=>{
    res.json({
        message:"Hello world!",
    })
});

routes.get('/products',productsController.index);
routes.post('/products',productsController.create);

export default routes;