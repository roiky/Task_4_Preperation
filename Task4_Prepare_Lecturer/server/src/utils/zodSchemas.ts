import { z } from "zod";

export const ratingRange = z.number().int().min(0).max(10);

export const createLecturerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    skills: z.object({
        react: ratingRange,
        node: ratingRange,
        angular: ratingRange,
        dotnet: ratingRange,
        microservices: ratingRange,
        microfrontends: ratingRange,
        ai: ratingRange,
        docker: ratingRange,
    }),
});
