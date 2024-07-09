import { Request, Response } from "express";
import Product from "../models/Product.model";


export const getProducts = async(req: Request, res: Response) => {
    const products = await Product.findAll({
        order: [
            ['id', 'DESC']
        ]
    });
    res.json({data: products});
}

export const getProductById = async(req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if(!product) {
        return res.status(404).json({
            errors: 'Producto no encontrado'
        });
    }

    res.json({data: product});
}

export const createProduct = async(req: Request, res: Response) => {

    //**  Las dos formas hacen lo mismo solo que en la de abajo crea la instancia y almacena en la base de datos en un solo paso. **//

    // const product = new Product(req.body);
    // const savedProduct = await product.save();
    const product = await Product.create(req.body);
    res.status(201).json({data: product}); 
}

export const updateProduct = async(req: Request, res: Response) => {

    const { id } = req.params;
    const product = await Product.findByPk(id);

    if(!product) {
        return res.status(404).json({
            errors: 'Producto no encontrado'
        });
    }

    //Actualizar
    await product.update(req.body);
    await product.save();

    res.json({data: product});
    
}

export const updateAvailability = async(req: Request, res: Response) => {

    const { id } = req.params;
    const product = await Product.findByPk(id);

    if(!product) {
        return res.status(404).json({
            errors: 'Producto no encontrado'
        });
    }

    //En lugar de mandar por el body  el valor solo cámbialo. si es true pasa a false y viceversa
    product.availability = !product.dataValues.availability;
    await product.save();

    res.json({data: product});
}

export const deleteProduct = async(req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if(!product) {
        return res.status(404).json({
            errors: 'Producto no encontrado'
        });
    }

    await product.destroy();
    res.json({data: 'Producto eliminado'});
}