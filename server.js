// Importamos las librerías necesarias (¡En inglés!)
const express = require("express");
const app = express();
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

// ==================================================================
// 🔑 CONFIGURACIÓN DE MERCADO PAGO
// ==================================================================
// REEMPLAZA EL TEXTO DE ABAJO CON TU ACCESS TOKEN REAL (El largo)
// Debe empezar con APP_USR- o TEST-
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-4258164784257219-020120-f00ae5c4250ef8362942d6be738a9a3c-3170201217' });

// Configuramos el servidor para recibir datos JSON y permitir conexiones externas
app.use(cors());
app.use(express.json());

// ==================================================================
// 🌐 RUTA DE PRUEBA (Para ver si el servidor vive)
// ==================================================================
app.get("/", (req, res) => {
    res.send("¡El servidor de Cloed Shop está funcionando en Render! 🚀");
});

// ==================================================================
// 💳 RUTA PARA CREAR LA PREFERENCIA DE PAGO
// ==================================================================
app.post("/create_preference", async (req, res) => {
    try {
        // 1. Recibimos los datos del producto desde tu página web
        // body será algo como: { title: "Compra", quantity: 1, price: 1500 }
        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "MXN",
                },
            ],
            // Rutas a donde volverá el usuario después de pagar
            back_urls: {
                success: "https://www.cloedgamer.com", // Cambia esto por tu dominio real
                failure: "https://www.cloedgamer.com",
                pending: "https://www.cloedgamer.com",
            },
            auto_return: "approved",
        };

        // 2. Creamos la preferencia en Mercado Pago
        const preference = new Preference(client);
        const result = await preference.create({ body });
        
        // 3. Devolvemos el ID de la preferencia a tu página web
        res.json({
            id: result.id, 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al crear la preferencia :(" });
    }
});

// ==================================================================
// 🚀 INICIAR EL SERVIDOR
// ==================================================================
// Render nos asigna un puerto automáticamente en process.env.PORT
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
});
