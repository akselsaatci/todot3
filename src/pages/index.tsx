import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { prisma } from "../../src/server/db";
import type { toDo } from "@prisma/client";
import { api } from "../utils/api";
import { getSession, signOut } from "next-auth/react";
import LoadingSpinner from "../components/loadingSpinner";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const data: toDo[] = await prisma.toDo.findMany({
    where: { userId: session.user.id },
    orderBy: { completed: "asc" },
  });

  return {
    props: { todosV: data, ses: session },
  };
}

const Home = ({
  todosV,
  ses,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<toDo[]>(todosV);
  const createTodo = api.todo.createTodo.useMutation();
  const [loading, setLoading] = useState(false);

  function OnSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = `${Math.random()}`;
    setLoading(true);
    createTodo.mutate(
      { text: text, id: id, userId: ses?.user.id },
      {
        onSuccess: () => {
          setTodos([
            {
              id: id,
              text: text,
              completed: false,
              userId: ses?.user.id,
            },
            ...todos,
          ]);
          setText("");
          setLoading(false);
        },
        onError: (error) => {
          console.log(error);
          setLoading(false);
        },
      }
    );
  }
  return (
    <>
      <Helmet>
        <body className="bg-primary" />
      </Helmet>
      <div className="container mx-auto p-1">
        <div className="justify-center bg-primary">
          <h1 className="pt-10 text-center text-5xl font-bold text-secondary">
            To Do App
          </h1>
          

          {ses && (
            <div className="mt-5 flex items-center justify-center gap-5">
              <p className="text-center text-secondary ">
                Logged in as {ses.user.name}{" "}
              </p>{" "}
              <button
                className="h-10 justify-center rounded-md bg-thirdcolor p-2 text-secondary"
                onClick={() => void signOut()}
              >
                Logout
              </button>
            </div>
          )}
          <div className="mt-3 flex justify-center h-10">
            {loading && <LoadingSpinner />}
          </div>
          <div className="flex justify-center pt-10">
            <div className="overflow-hidden rounded-md border-4 border-thirdcolor bg-secondary">
              <div className="h-80 w-80 flex-col overflow-y-auto">
                {todos.map((todo) => (
                  <ToDoComponent
                    key={todo.id}
                    id={todo.id}
                    text={todo.text}
                    completed={todo.completed}
                    setTodos={setTodos}
                    setLoading={setLoading}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-6">
            <form onSubmit={OnSubmitHandler}>
              <div className="flex w-80 flex-col">
                <input
                  type="text"
                  placeholder="Add a new task"
                  className="h-10 rounded-md border-2 border-thirdcolor bg-secondary pl-2"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                />
                <div className="pt-2"></div>
                <button className="h-10 rounded-md bg-thirdcolor p-2 text-secondary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
type ToDoProps = {
  id: string;
  text: string;
  completed: boolean;
  setTodos: React.Dispatch<React.SetStateAction<toDo[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export default Home;

function ToDoComponent(props: ToDoProps) {
  const [completed, setCompleted] = useState(props.completed);
  const updateTodo = api.todo.completeTodo.useMutation();
  const deleteTodo = api.todo.deletetoDo.useMutation();
  function deleteHandler() {
    props.setLoading(true);
    deleteTodo.mutate(
      { id: props.id },
      {
        onSuccess: () => {
          props.setTodos((prev: toDo[]) =>
            prev.filter((todo: toDo) => todo.id !== props.id)
          );
          props.setLoading(false);
        },
        onError: (error) => {
          console.log(error);
          props.setLoading(false);
        },
      }
    );
  }
  function handleCompleted() {
    props.setLoading(true);
    updateTodo.mutate(
      { id: props.id, completed: !completed },
      {
        onSuccess: () => {
          setCompleted(!completed);
          props.setLoading(false);
        },
        onError: (error) => {
          console.log(error);
          props.setLoading(false);
        },
      }
    );
  }

  return (
    <>
      <div className="flex w-full content-center overflow-x-hidden bg-secondary p-4 px-3 align-middle">
        <input
          id="default-checkbox"
          type="checkbox"
          value=""
          onChange={handleCompleted}
          checked={completed}
          className="text-blue-600 bg-gray-100 flex-6 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 w-4 rounded pr-3 align-middle focus:ring-2"
        />
        <div className="flex w-full flex-auto justify-between">
          <p
            className={
              "transition-tag flex w-full break-all px-2 text-lg" +
              (completed ? " line-a" : "")
            }
          >
            {props.text}
          </p>
          <button onClick={deleteHandler} className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 30 30"
            >
              <path d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="mx-5 border-b-2"></div>
    </>
  );
}
