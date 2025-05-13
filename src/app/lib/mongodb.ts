import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
}
const uri: string = process.env.MONGODB_URI;
const options = {}

let client: MongoClient;

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // En desarrollo, usa una variable global para evitar múltiples conexiones
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri, options);
        (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
} else {
    // En producción, crea una nueva conexión
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

clientPromise
    .then(() => {
        console.log("Conexión a MongoDB exitosa");
    })
    .catch((error: Error) => {
        console.error("Error de conexión a MongoDB:", error.message);
    });

export default clientPromise;
