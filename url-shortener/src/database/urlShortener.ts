import prisma from "./client"

export function postUrlData(url: string) {
  return prisma.webUrl.create({
    data: { url },
  })
}

export function getUrlData(href: string) {
  return prisma.webUrl.findUnique({
    where: {
      url: href,
    },
  })
}

export function checkIfUrlExists(href: string) {
  return prisma.webUrl.findUnique({
    where: {
      url: href,
    },
  })
}

export function getUrlIdData(id: string) {
  return prisma.webUrl.findUnique({
    where: { id },
    select: {
      url: true,
    },
  })
}
