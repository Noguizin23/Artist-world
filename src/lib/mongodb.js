import { MongoClient } from 'mongodb';

// URL de conexão obtida do arquivo .env
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

export async function connectDB() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
    return client;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

export default client;
