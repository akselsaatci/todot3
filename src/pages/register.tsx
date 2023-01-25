import { Helmet } from "react-helmet";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext } from "next";
import { api } from "../utils/api";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { ses: session },
  };
}

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const createUser = api.todo.createUser.useMutation();
  const router = useRouter();
  function clickHandle() {
    createUser.mutate(
      { name: username, password: password },
      {
        // it should be fixed i couldnt find a way to fix it yet
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSuccess:  (async () => {
          await router.push("/login");
        }),
        onError: (error) => {
          {
            setError(error.message);
          }
        },
      }
    );
  }
  const [error, setError] = useState("");
  return (
    <>
      <Helmet>
        <body className="bg-primary" />
      </Helmet>
      <div className="container mx-auto p-4">
        <div className="justify-center bg-primary">
          <h1 className="pt-10 text-center text-5xl font-bold text-secondary">
            Register
          </h1>
          <p className="text-red-700 mt-4 text-center text-lg">{error}</p>

          <div className="flex justify-center pt-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex w-96 flex-col">
                <input
                  type="text"
                  placeholder="Username"
                  className="h-10 rounded-md border-2 border-thirdcolor bg-secondary pl-2"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
                <div className="pt-2"></div>
                <input
                  type="password"
                  placeholder="Password"
                  className="h-10 rounded-md border-2 border-thirdcolor bg-secondary pl-2"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <div className="pt-2"></div>
                <div className="pt-2"></div>
                <button
                  onClick={() => {
                    void clickHandle();
                  }}
                  className="h-10 rounded-md bg-thirdcolor p-2 text-secondary"
                >
                  Register
                </button>

                <p className="mt-5 text-secondary text-lg text-center font-bold">Don&apos;t use your main password I&apos;m not encrypting passwords!</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
