import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

let clientPromise;

if (process.env.NODE_ENV === 'development') {
    clientPromise = client.connect();
} else {
    clientPromise = client.connect();
}

clientPromise.then(() => {
    console.log("Conexión a MongoDB exitosa");
}).catch((error) => {
    console.error("Error de conexión a MongoDB:", error.message);
});

export default clientPromise;
