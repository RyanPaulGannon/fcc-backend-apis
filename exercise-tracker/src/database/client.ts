import { PrismaClient } from "@prisma/client"

let prisma = new PrismaClient()

export async function connect() {
  // Connect the client
  await prisma.$connect()
  console.log("Connected")
  // ... you will write your Prisma Client queries here
}

export default prisma
