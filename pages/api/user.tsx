import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';

type ErrorResponseType = {
  error: string;
};

type SucessResponseType = {
  _id: string;
  name: string;
  email: string;
  cellPhone: string;
  teacher: string;
};

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponseType | SucessResponseType>
): Promise<void> => {
  if (request.method === 'POST') {
    const { name, email, cellPhone, teacher } = request.body;

    if (!name || !email || !cellPhone || !teacher) {
      return response.status(400).json({ error: 'missing body parameter' });
    }

    const { db } = await connect();

    const insertResponse = await db.collection('users').insertOne({
      name,
      email,
      cellPhone,
      teacher,
    });

    return response.status(200).json(insertResponse.ops[0]);
  } else {
    return response.status(400).json({ error: 'wrong request method' });
  }
};
