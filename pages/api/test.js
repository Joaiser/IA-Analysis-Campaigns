// pages/api/test.js
import clientPromise from "@/app/lib/mongodb"; // Asegúrate de tener esta ruta correcta

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db(); // Usamos la base de datos predeterminada
        const collections = await db.listCollections().toArray(); // Obtenemos las colecciones de la base de datos

        // Si la conexión es exitosa, respondemos con el nombre de las colecciones
        res.status(200).json({ success: true, collections });
    } catch (error) {
        // Si hay un error en la conexión, respondemos con el error
        res.status(500).json({ success: false, message: "Error connecting to MongoDB", error: error.message });
    }
}
