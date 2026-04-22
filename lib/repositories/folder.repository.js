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
