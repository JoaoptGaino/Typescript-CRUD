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
        const products = await db('products').where('id',id).first();

        if(!products){
            return res.status(400).json({
                message:"Error finding product"
            })
        }
        return res.json(products);
    }
    
}