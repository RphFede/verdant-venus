import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export const post: APIRoute = async ({ request }) => {
    try {
        const post = await request.json();
        
        // Validar campos requeridos
        if (!post.title || !post.content || !post.date || !post.fontStyle || !post.tags) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Faltan campos requeridos'
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Crear un slug a partir del título
        const slug = post.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Crear el contenido del archivo markdown con formato YAML válido
        const content = `---
title: ${post.title}
date: ${post.date}
fontStyle: ${post.fontStyle}
tags:
${post.tags.map(tag => `  - ${tag}`).join('\n')}
---
 
${post.content}
`;

        // Asegurar que existe el directorio
        const dirPath = join(process.cwd(), 'src', 'content', 'blog');
        await mkdir(dirPath, { recursive: true });

        // Guardar el archivo
        const filePath = join(dirPath, `${slug}.md`);
        await writeFile(filePath, content, 'utf-8');

        return new Response(
            JSON.stringify({ success: true, slug }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Error al guardar el post:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Error al guardar el post'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};