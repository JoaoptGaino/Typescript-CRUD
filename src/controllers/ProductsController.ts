import {Request,Response} from 'express';
import db from '../database/connection';

export default class ProductsController{
    async index(req:Request,res:Response){
        const products = await db('products')
        .select()
        .table('products')

        return res.json(products);
    }
    async create(req:Request,res:Response){
        const{
            name,
            price
        } = req.body;
        const trx = await db.transaction();
        try{
            await trx('products').insert(
                {
                    name,
                    price
                }
            );
            await trx.commit();
            return res.status(201).send();
        }catch(err){
            await trx.rollback();
            return res.status(400).json({
                error:'Error while creating product'
            })
            console.log(err)
        }
    }
    async show(req:Request,res:Response){
        const {id} = req.params;
        const product = await db('products').where('id',id).first();

        if(!product){
            return res.status(400).json({
                message:"Error finding product"
            })
        }
        return res.json(product);
    }

    async remove(req:Request,res:Response){
        const {id} = req.params;

        const removeProduct = await db('products').where('id',id).delete()
        if(!removeProduct){
            return res.status(400).json({
                message:"Unable to find product"
            })
        }
        return res.json({
            message:"Removed product:",
            removeProduct
        });
    }
    async update(req:Request,res:Response){
        const {id} = req.params;
        const {name,price} = req.body;
        const updatedProduct = await db('products').where('id',id).update({name,price});

        return res.json({
            message:"Updated",
            updatedProduct
        })
    }
    
}