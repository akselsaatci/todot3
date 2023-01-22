import { Helmet } from "react-helmet";
import { signIn } from "next-auth/react";

const Login = () => {
  async function clickHandle() {
    await signIn();
  }

  return (
    <>
      <Helmet>
        <body className="bg-primary" />
      </Helmet>
      <div className="container mx-auto p-4">
        <div className="justify-center bg-primary">
          <h1 className="pt-10 text-center text-5xl font-bold text-secondary">
            Login
          </h1>
          <div className="flex justify-center pt-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex w-96 flex-col">
                <input
                  type="text"
                  placeholder="Username"
                  className="h-10 rounded-md border-2 border-thirdcolor bg-secondary pl-2"
                />
                <div className="pt-2"></div>
                <input
                  type="text"
                  placeholder="Password"
                  className="h-10 rounded-md border-2 border-thirdcolor bg-secondary pl-2"
                />
                <div className="pt-2"></div>
                <div className="pt-2"></div>
                <button
                  onClick={() => {
                    void clickHandle().catch((err) => console.log(err));
                  }}
                  className="h-10 rounded-md bg-thirdcolor p-2 text-secondary"
                ></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
