import prisma from "./client"

export async function connect() {
  // Connect the client
  await prisma.$connect()
  console.log("Connected")
  // ... you will write your Prisma Client queries here
}
