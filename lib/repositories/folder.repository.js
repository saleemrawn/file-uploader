import { prisma } from "../prisma.js";

export const getAllFolders = async () => {
  const folders = await prisma.folder.findMany();
  return folders;
};

export const getAllFoldersByOwnerId = async (ownerId) => {
  const folders = await prisma.folder.findMany({
    where: { ownerId: ownerId },
  });

  return folders;
};
