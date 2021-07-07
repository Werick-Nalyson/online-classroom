import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/database';

type ErrorResponseType = {
  error: string;
};

type SucessResponseType = {
  _id: string;
  name: string;
  email: string;
  cellPhone: string;
  teacher: boolean;
  coins: number;
  courses: Array<string>;
  available_hours: string;
  available_locations: [];
  reviews: [];
  appointments: [];
};

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponseType | SucessResponseType>
): Promise<void> => {
  if (request.method === 'GET') {
    const { email } = request.query;

    if (!email) {
      return response
        .status(400)
        .json({ error: 'missing e-mail on request body' });
    }

    const { db } = await connect();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return response.status(400).json({ error: 'user not found' });
    }

    return response.status(400).json(user);
  } else {
    return response.status(400).json({ error: 'wrong request method' });
  }
};
