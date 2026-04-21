import { prisma } from "../prisma.js";

export const createFile = async ({ name, mimetype, path, size, ownerId, folderId }) => {
  return prisma.file.create({
    data: {
      name,
      mimetype,
      path,
      size,
      ownerId,
      folderId,
    },
  });
};
