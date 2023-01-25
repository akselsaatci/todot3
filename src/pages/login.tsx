import { Helmet } from "react-helmet";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext } from "next";
import Link from "next/dist/client/link";

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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function clickHandle() {
    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/",
      username: username,
      password: password,
    }).catch((err) => console.log(err));
  }
  const { error } = useRouter().query;
  return (
    <>
      <Helmet>
        <body className="bg-primary" />
      </Helmet>
      <div className="container mx-auto">
        <div className="justify-center bg-primary ">
          <h1 className="pt-10 text-center text-5xl font-bold text-secondary">
            Login
          </h1>
          {error && <SignInError error={error} />}
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
                    void clickHandle().catch((err) => console.log(err));
                  }}
                  className="h-10 rounded-md bg-thirdcolor p-2 text-secondary"
                >
                  Login
                </button>
                <p className="text-center">or</p>
                <Link className="inline-grid" href={"/register"}>
                  <button className="h-10 rounded-md bg-thirdcolor p-2 text-secondary">
                    Register
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const errors = {
  Signin: "Try signing with a different account.",
  OAuthSignin: "Try signing with a different account.",
  OAuthCallback: "Try signing with a different account.",
  OAuthCreateAccount: "Try signing with a different account.",
  EmailCreateAccount: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};
const SignInError: React.FC<{ error: string | string[] }> = ({ error }) => {
  const errorMessage =
    error && (errors[error as keyof typeof errors] ?? errors.default);
  return <div className="mt-5 text-center text-secondary">{errorMessage}</div>;
};

export default Login;
