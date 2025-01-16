import { password } from "bun";

export async function argon2Hash(plainPassword: string): Promise<string> {
  return await password.hash(plainPassword, {
    algorithm: "argon2id",  // You can also use "argon2i" or "argon2d"
    memoryCost: 65536,      // Amount of memory to use (in KiB)
    timeCost: 3,            // Number of iterations
  });
}

export async function argon2Verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await password.verify(plainPassword, hashedPassword);
}
