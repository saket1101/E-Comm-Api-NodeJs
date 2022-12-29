import { MongoClient } from 'mongodb';
import {
  ObjectId
} from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'product': new ObjectId('63a9355bb79adcd952497beb')
    }
  }, {
    '$group': {
      '_id': null, 
      'averageRating': {
        '$avg': '$ratings'
      }, 
      'noofReviews': {
        '$sum': 1
      }
    }
  }
];

const client = await MongoClient.connect(
  '',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const coll = client.db('test').collection('reviews');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();