const express = require("express");
const app = express();
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

// PEGA TU ACCESS TOKEN ENTRE LAS COMILLAS
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-4258164784257219-020120-f00ae5c4250ef8362942d6be738a9a3c-3170201217' });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("El servidor de Cloed Shop está vivo 🤖");
});

app.post("/create_preference", async (req, res) => {
    try {
        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "MXN",
                },
            ],
            back_urls: {
                success: "https://www.google.com",
                failure: "https://www.google.com",
                pending: "https://www.google.com",
            },
            auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({ id: result.id });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al crear la preferencia" });
    }
});

app.listen(8080, () => {
    console.log("El servidor corre en el puerto 8080 🚀");
});