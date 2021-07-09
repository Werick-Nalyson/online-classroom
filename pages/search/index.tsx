import { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import api from '../../utils/api';

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

const Search: NextPage = () => {
  const [session, loading] = useSession();
  const [data, setData] = useState<TeacherType[]>([]);
  const [textInput, setTextInput] = useState('');

  const handleSearch = useCallback(async () => {
    await api(`/api/search/${textInput}`).then((response) => {
      const teachers: TeacherType[] = response.data;

      setData(teachers);
    });
  }, [textInput, setData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Bem vindo a página Search</h1>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn('auth0')}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
          <input
            type="text"
            placeholder="Digite a matéria pretendida"
            className="bg-blue-200"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button className="bg-blue-400" onClick={() => handleSearch()}>
            Pesquisar professores
          </button>
        </>
      )}

      {data.length !== 0 &&
        data.map((teacher) => (
          <Link href={`/search/${teacher._id}`} key={teacher._id}>
            <a className="bg-gray-500">
              <h1>Teacher name: {teacher.name}</h1>
              <h1>Teacher email: {teacher.email}</h1>
            </a>
          </Link>
        ))}

      {loading && (
        <div>
          <h1>Carregando...</h1>
        </div>
      )}
    </div>
  );
};

export default Search;
