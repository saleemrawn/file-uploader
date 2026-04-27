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

export const getAllFiles = async () => {
  const files = await prisma.file.findMany({
    orderBy: { createdAt: "desc" },
    include: { folder: true },
  });

  return files;
};

export const getFileById = async (fileId) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
    include: { folder: true },
  });

  return file;
};

export const updateFileFolderById = async ({ fileId, folderId, ownerId }) => {
  await prisma.file.update({
    where: { id: fileId, ownerId },
    data: { folderId },
  });
};
