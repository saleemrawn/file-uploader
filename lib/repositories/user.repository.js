import { prisma } from "../prisma.js";

export const findUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};

export const findUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  return user;
};

export const createUser = async (username, password) => {
  const user = await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });
};
