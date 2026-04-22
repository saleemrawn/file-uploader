import { prisma } from "../prisma.js";

export const getAllFolders = async () => {
  const folders = await prisma.folder.findMany({
    include: {
      _count: {
        select: { files: true },
      },
    },
  });
  return folders;
};

export const getAllFoldersByOwnerId = async (ownerId) => {
  const folders = await prisma.folder.findMany({
    where: { ownerId: ownerId },
  });

  return folders;
};

export const getFolderById = async (folderId) => {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });

  return folder;
};

export const createFolder = async ({ name, ownerId }) => {
  return await prisma.folder.create({
    data: {
      name,
      ownerId,
    },
  });
};

export const updateFolder = async ({ name, folderId }) => {
  return await prisma.folder.update({
    where: { id: folderId },
    data: { name },
  });
};

export const deleteFolder = async (folderId) => {
  return await prisma.folder.delete({
    where: { id: folderId },
  });
};
