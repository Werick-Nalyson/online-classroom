import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'mongodb';

import connect from '../../utils/database';

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
    const { id } = request.body;

    if (!id) {
      return response
        .status(400)
        .json({ error: 'missing teacher id on request body' });
    }

    const { db } = await connect();

    const teacher = await db
      .collection('users')
      .findOne({ _id: new ObjectID(id) });

    if (!teacher) {
      return response.status(400).json({ error: 'Teacher not found' });
    }

    return response.status(200).json(teacher);
  } else {
    return response.status(400).json({ error: 'wrong request method' });
  }
};
