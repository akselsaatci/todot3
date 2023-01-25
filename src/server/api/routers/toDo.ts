import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const todoRouter = createTRPCRouter({
  getAllTodos: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.toDo.findMany({ orderBy: { id: "desc" } });
  }),
  createTodo: publicProcedure
    .input(z.object({ text: z.string(), id: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.toDo.create({
        data: {
          text: input.text,
          userId: input.userId,
          completed: false,
          id: input.id,
        },
      });
      return {};
    }),
  completeTodo: publicProcedure
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.toDo.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
      return {};
    }),
  deletetoDo: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.toDo.delete({ where: { id: input.id } });
    }),
  createUser: publicProcedure
    .input(z.object({ name: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({where: {userName: input.name}});
      if(user)
        throw new Error("User already exists");
      await ctx.prisma.user.create({
        data: { userName: input.name, userPassword: input.password },
      });
      return {};
    }),
});
