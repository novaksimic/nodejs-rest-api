const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dataPath = "src/products.json";

app.get('/', (req, res, next) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
        const products = JSON.parse(data);

        console.log(products);
        res.status(200).send(JSON.parse(data));
    })

})

app.post('/addProduct', (req, res, next) => {
    const product = req.body;

    fs.readFile(dataPath, 'utf8', function (err, data) {
        const products = JSON.parse(data);
        products.push(product);

        console.log(products);
        fs.writeFile(dataPath, JSON.stringify(products, null, 2), (err, result) => {
            if (err) console.log('error', err);
            res.status(200).send(result);
        })
    }, true);
})

app.get('/:id', (req, res, next) => {
    const prodId = req.params.id;
    //const product = req.body;
    fs.readFile(dataPath, 'utf8', function (err, data) {
        if (err) {
            res.send(`Cannot get product with ${prodId}.`)
        }
        const products = JSON.parse(data);
        const product = products.find(item => item.id === prodId);
        if (product) {
            res.status(200).send(product);
            console.log(product);
        }
    }, true)
})

app.put('/:id', (req, res, next) => {
    const prodId = req.params.id;
    const updatedProduct = req.body;
    fs.readFile(dataPath, 'utf8', function (err, data) {
        let products = JSON.parse(data);
        console.log(products);
        const newProduct = products.map(product => product.id.toString() === prodId.toString());  
        if(newProduct){
            console.log(updatedProduct);
            let newData = JSON.stringify(updatedProduct);
            products[prodId] = newData; 
            
        }
        console.log(products);
        fs.writeFile(dataPath, JSON.stringify(products, null, 2), () => {
            res.status(200).send(`product id:${prodId} updated.`);
        })
    }, true)
})

app.delete('/:id', (req, res, next) => {
    const prodId = req.params.id;

    fs.readFile(dataPath, 'utf8', function (err, data) {
        let products = JSON.parse(data);
        let removedProduct = [];

        for (let i = 0; i < products.length; i++) {
            if (products[i].id.toString() !== prodId.toString()) {
                console.log(`product ${prodId} cannot be found.`);
            }
            removedProduct = products.filter(product => product.id.toString() !== prodId.toString());
        }
        fs.writeFile(dataPath, JSON.stringify(removedProduct, null, 2), (err, result) => {

            res.status(200).send(`product ${prodId} is removed.`);
        });
    }, true);
})


app.listen(port);