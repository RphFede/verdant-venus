import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        fontStyle: z.string(),
        tags: z.array(z.string())
    })
});

export const collections = { blog };