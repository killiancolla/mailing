const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllSettings = async () => {
    return await prisma.setting.findMany();
};

module.exports = { getAllSettings };