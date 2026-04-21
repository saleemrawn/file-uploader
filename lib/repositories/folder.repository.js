import { prisma } from "../prisma.js";

export const getAllFoldersByOwnerId = async (ownerId) => {
  const folders = await prisma.folder.findMany({
    where: { ownerId: ownerId },
  });

  return folders;
};
