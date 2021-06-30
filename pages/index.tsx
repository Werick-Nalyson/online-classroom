import Head from 'next/head';
import { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="py-10">
        <h1>Next.js + tailwind css</h1>
      </div>
    </div>
  );
};

export default Home;
