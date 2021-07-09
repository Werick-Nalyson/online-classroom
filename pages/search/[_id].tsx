import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';

type TeacherType = {
  _id: string;
  name: string;
  email: string;
  cellPhone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>;
  appointments: Record<string, unknown>;
};

const teacherProfile = ({ teacher }: { teacher: TeacherType }): JSX.Element => {
  return (
    <>
      <h1>Nome do professor: {teacher.name}</h1>
      <h1>E-mail do professor: {teacher.email}</h1>
      <h1>Id do professor: {teacher._id}</h1>
    </>
  );
};

export default teacherProfile;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const _id = ctx.query._id as string;

  const response = await axios.get<TeacherType>(
    `http://localhost:3001/api/teacher/${_id}`
  );

  const teacher = response.data;

  return {
    props: {
      teacher,
    },
  };
};
