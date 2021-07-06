import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/client';
import { ObjectID } from 'mongodb';

import connect from '../../utils/database';

type User = {
  _id: string;
  name: string;
  email: string;
  cellPhone: string;
  teacher: boolean;
  coins: number;
  courses: Array<string>;
  available_hours: Record<string, number>;
  available_locations: Array<string>;
  reviews: Record<string, number>[];
  appointments: {
    date: string;
  }[];
};

type ErrorResponseType = {
  error: string;
};

type AppointmentType = {
  date: string;
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
  response: NextApiResponse<ErrorResponseType | AppointmentType>
): Promise<void> => {
  // const session = await getSession({ req: request });

  // if (!session) {
  //   return response.status(401).json({ error: 'Please login first' });
  // }

  if (request.method === 'POST') {
    const {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link,
    }: AppointmentType = request.body;

    if (
      !date ||
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
      date,
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
        { $push: { appointments: appointments }, $inc: { coins: 1 } }
      );

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(student_id) },
        { $push: { appointments: appointments }, $inc: { coins: 1 } }
      );

    return response.status(200).json(appointments);
  } else {
    return response.status(400).json({ error: 'wrong request method' });
  }
};
