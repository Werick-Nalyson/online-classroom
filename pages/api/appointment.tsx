import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { ObjectID } from 'mongodb';

import connect from '../../utils/database';

type ErrorResponseType = {
  error: string;
};

type SucessResponseType = {
  data: string;
  teacher_name: string;
  teacher_id: string;
  student_name: string;
  student_id: string;
  course: string;
  location: string;
  appointment_link: string;
};

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponseType | SucessResponseType>
): Promise<void> => {
  const session = await getSession({ req: request });

  if (!session) {
    return response.status(401).json({ error: 'Please login first' });
  }

  if (request.method === 'POST') {
    const {
      data,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link,
    } = request.body;

    if (
      !data ||
      !teacher_name ||
      !teacher_id ||
      !student_name ||
      !student_id ||
      !course ||
      !location
    ) {
      return response
        .status(400)
        .json({ error: 'missing parameter on request body' });
    }

    const { db } = await connect();

    const teacher = await db
      .collection('users')
      .findOne({ _id: new ObjectID(teacher_id) });

    if (!teacher)
      return response.status(400).json({
        error: `teacher ${teacher_name} with ${teacher_id} does not exists`,
      });

    const student = await db
      .collection('users')
      .findOne({ _id: new ObjectID(student_id) });

    if (!student)
      return response.status(400).json({
        error: `student ${student_name} with ${student_id} does not exists`,
      });

    const appointments = {
      data,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link: appointment_link || '',
    };

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(teacher_id) },
        { $push: { appointments: appointments } }
      );

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(student_id) },
        { $push: { appointments: appointments } }
      );

    return response.status(200).json(appointments);
  } else {
    return response.status(400).json({ error: 'wrong request method' });
  }
};
