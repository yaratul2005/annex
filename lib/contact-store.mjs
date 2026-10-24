import { MongoClient } from 'mongodb';

const RETENTION_DAYS = 30;
const COLLECTION_NAME = 'contact_requests';
const TTL_INDEX_NAME = 'contact_requests_expire_after_30_days';

function getMongoUri(env) {
  // The Atlas Marketplace integration creates this variable using the "annex" prefix.
  return env.annex_MONGODB_URI || env.annex_MONGODB_URL || env.MONGODB_URI || '';
}

async function getDatabase(uri) {
  const cache = globalThis;
  if (!cache.__annexMongoClientPromise) {
    const client = new MongoClient(uri, {
      connectTimeoutMS: 5_000,
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 8_000,
      maxPoolSize: 5
    });
    cache.__annexMongoClientPromise = client.connect().catch((error) => {
      cache.__annexMongoClientPromise = undefined;
      throw error;
    });
  }

  const client = await cache.__annexMongoClientPromise;
  return client.db('annex');
}

export async function storeContactRequest(contact, env = process.env) {
  const uri = getMongoUri(env);
  if (!uri) return { stored: false, reason: 'not_configured' };

  const database = await getDatabase(uri);
  const requests = database.collection(COLLECTION_NAME);
  const cache = globalThis;
  if (!cache.__annexContactTtlIndexPromise) {
    cache.__annexContactTtlIndexPromise = requests.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: RETENTION_DAYS * 24 * 60 * 60, name: TTL_INDEX_NAME }
    ).catch((error) => {
      cache.__annexContactTtlIndexPromise = undefined;
      throw error;
    });
  }
  await cache.__annexContactTtlIndexPromise;
  await requests.insertOne({
    ...contact,
    source: 'website-contact-form',
    createdAt: new Date()
  });

  return { stored: true };
}
