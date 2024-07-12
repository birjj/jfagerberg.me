import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
