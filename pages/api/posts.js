import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
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
