import { NextPage } from 'next';
import useSWR from 'swr';
import { signIn, signOut, useSession } from 'next-auth/client';
import api from '../utils/api';

const Profile: NextPage = () => {
  const [session, loading] = useSession();

  const { data, error } = useSWR(`/api/user/${session?.user.email}`, api);

  if (error) {
    console.log(error);
  }

  if (data) {
    console.log(data);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {!session && (
        <>
          Por favor, faça login para acessar essa página
          <br />
          <button onClick={() => signIn('auth0')}>Sign in</button>
        </>
      )}
      {session && data?.data && (
        <>
          <h1>Bem vindo a página profile {session.user.email}</h1>
          <button onClick={() => signOut()}>Sign out</button>
          <p>---------------</p>
          <h3>{data.data.name}</h3>
          <h3>{data.data.coins} moedas</h3>
        </>
      )}
      {error && <h1>O usuário com email {session.user.email} não existe</h1>}
      {loading && (
        <div>
          <h1>Carregando...</h1>
        </div>
      )}
    </div>
  );
};

export default Profile;
