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

export const getFilesByFolderId = async (folderId) => {
  const files = await prisma.file.findMany({
    where: { AND: { folderId: folderId }, NOT: { folderId: null } },
    include: { folder: true },
  });

  return files;
};
