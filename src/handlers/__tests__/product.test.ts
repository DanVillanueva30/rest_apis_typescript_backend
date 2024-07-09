import request from "supertest";
import server from "../../server";



describe('POST /api/products', () => {

    it('should display validation errors', async() => {
        const response = await request(server).post('/api/products').send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(4);
    })


    it('should validate that the price is grater than 0', async() => {
        const response = await request(server).post('/api/products').send({
            name: "Control - Testing",
            price: 0
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(4);
    })

    it('should validate that the price is a number and greater than 0', async() => {
        const response = await request(server).post('/api/products').send({
            name: "Control - Testing",
            price: "Hola"
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(4);
    })

    it('should create a new product', async() => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 75
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('GET /api/products', () => {

    it('should check if api/products exists', async () => {
        const response = await request(server).get('/api/products');
        expect(response.status).not.toBe(404);
    });

    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('data');

        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('GET /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const response = await request(server).get(`/api/products/${productId}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBe('Producto no encontrado');
    });

    it('should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Id no válido');
    });

    it('get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
});

describe('PUT /api/products/:id', () => {

    it('should check a valid ID in the URL', async () => {
        const response = await request(server).put('/api/products/not-valid-url').send({
            name: 'Monitor Curvo',
            price: 200,
            availability: true,
            
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Id no válido');
    });

    it('should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(5);

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });


    it('should validate that the price is grater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Monitor Curvo',
            price: 0,
            availability: true
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Precio no válido');

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    it('should validate that the name is not empty', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: '',
            price: 200,
            availability: true
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('El nombre del producto no puede ir vacío');

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    it('should validate that availability has a valid value', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Monitor Curvo',
            price: 200,
            availability: ''
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Valor para disponibilidad no válido');

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: 'Monitor Curvo',
            price: 200,
            availability: true
        });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBe("Producto no encontrado");

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    it('should update an exisiting product with valid data', async () => {
        const response = await request(server).put(`/api/products/1`).send({
            name: 'Monitor Curvo',
            price: 200,
            availability: true
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    })
});

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non existing product', async () => {
        const productId = 2000;
        const response = await request(server).patch(`/api/products/${productId}`);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('DELETE /api/products/:id', () => {
    it('should check a valid ID', async () => {
        const response  = await request(server).delete('/api/products/not-valid');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0].msg).toBe('Id no válido');

        expect(response.status).not.toBe(200);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const response  = await request(server).delete(`/api/products/${productId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200);
        expect(response.body.errors).not.toHaveProperty('data');
    });

    it('should delete an existing product', async () => {
        const response = await request(server).delete('/api/products/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    })
});