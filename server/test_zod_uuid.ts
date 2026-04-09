import { z } from "zod";
console.log("Checking string with zod:");
console.log(z.string().uuid().safeParse("bbbbbbbb-0000-0000-0000-000000000001"));
