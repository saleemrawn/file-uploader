import { prisma } from "../prisma.js";

export const createUser = async (username, password) => {
  const user = await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });
};
