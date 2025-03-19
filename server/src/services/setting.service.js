import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSettings = async () => {
    return await prisma.setting.findMany();
};