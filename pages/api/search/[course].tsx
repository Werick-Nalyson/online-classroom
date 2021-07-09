import { NextApiRequest, NextApiResponse } from 'next';

import connect from '../../../utils/database';

type ErrorResponseType = {
  error: string;
};

type Teacher = {
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
  response: NextApiResponse<ErrorResponseType | Teacher[]>
): Promise<void> => {
  if (request.method === 'GET') {
    const { course } = request.query;

    if (!course) {
      return response
        .status(400)
        .json({ error: 'missing course name on params' });
    }

    const { db } = await connect();

    const teachers: Teacher[] = await db
      .collection('users')
      .find({ courses: { $in: [new RegExp(`^${course}`, 'i')] } })
      .toArray();

    if (teachers.length === 0) {
      return response.status(400).json({ error: 'Course not found' });
    }

    return response.status(200).json(teachers);
  } else {
    return response.status(400).json({ error: 'wrong request method' });
  }
};
