import { PrismaClient } from "@prisma/client"

let prisma = new PrismaClient()

export async function connect() {
  await prisma.$connect()
  console.log("Connected")
}

export default prisma
