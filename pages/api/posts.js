import { MongoClient } from 'mongodb';

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }

const handler = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await client.connect();
    const db = client.db();

    switch (req.method) {
        case 'GET':
            const posts = await db.collection('posts').find({}).toArray();
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
            res.status(200).json(posts);
            break;
        case 'POST':
            const newPost = req.body;
            const result = await db.collection('posts').insertOne(newPost);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(201).json(result.ops[0]);
            break;
        case 'PUT':
            const { id, ...data } = req.body;
            const resultPut = await db.collection('posts').updateOne(
                { _id: new ObjectId(id) },
                { $set: data }
            );
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(resultPut);
            break;
        case 'DELETE':
            const resultDelete = await db.collection('posts').deleteOne({
                _id: new ObjectId(req.body.id),
            });
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).json(resultDelete);
            break;
        default:
            res.status(405).json({ error: 'Unsupported HTTP method' });
    }

    await client.close();
}

module.exports = allowCors(handler)
