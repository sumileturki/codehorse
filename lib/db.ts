// import { PrismaClient } from "./generated/prisma/client";
// import{PrismaPg} from "@prisma/adapter-pg";


// const adapter= new PrismaPg({
//     connectionString:process.env.DATABASE_URL
// })

// const PrismaClientSingleton =()=>{
//     return new PrismaClient({adapter})
// }

// declare const globalThis: {
//     prismaGlobal:ReturnType<typeof PrismaClientSingleton>;
// } & typeof global;


// const prisma = globalThis.prismaGlobal || PrismaClientSingleton();

// if (process.env.NODE_ENV !=="production") {
//     globalThis.prismaGlobal = prisma;
// }

// export default prisma;

import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// ✅ SAFE global cache (Inngest compatible)
const globalForPrisma = globalThis as unknown as {
  prismaGlobal?: PrismaClient;
};

const prisma =
  globalForPrisma.prismaGlobal ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaGlobal = prisma;
}

export default prisma;
