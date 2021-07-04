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
  if (request.method === 'POST') {
    const {
      name,
      email,
      cellPhone,
      teacher,
      coins = 1,
      courses,
      available_hours,
      available_locations,
      reviews = [],
      appointments = [],
    } = request.body;

    if (!teacher) {
      if (!name || !email || !cellPhone) {
        return response.status(400).json({ error: 'missing body parameter' });
      }
    } else if (teacher) {
      if (
        !name ||
        !email ||
        !cellPhone ||
        !courses ||
        !available_hours ||
        !available_locations
      ) {
        return response.status(400).json({ error: 'missing body parameter' });
      }
    }

    const { db } = await connect();

    const insertResponse = await db.collection('users').insertOne({
      name,
      email,
      cellPhone,
      teacher,
      coins,
      courses: courses || [],
      available_hours: available_hours || {},
      available_locations: available_locations || [],
      reviews,
      appointments,
    });

    return response.status(200).json(insertResponse.ops[0]);
  } else if (request.method === 'GET') {
    const { email } = request.body;

    if (!email) {
      return response
        .status(400)
        .json({ error: 'missing e-mail on request body' });
    }

    const { db } = await connect();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return response.status(200).json({ error: 'user not found' });
    }

    return response.status(200).json(user);
  } else {
    return response.status(400).json({ error: 'wrong request method' });
  }
};
