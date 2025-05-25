import { useState } from 'react';

export default function PostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [fontStyle, setFontStyle] = useState('regular');
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const post = {
            title,
            content,
            fontStyle,
            tags,
            date: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post)
            });

            if (response.ok) {
                // Limpiar el formulario
                setTitle('');
                setContent('');
                setFontStyle('regular');
                setTags([]);
                // Recargar la página para ver el nuevo post
                window.location.reload();
            }
        } catch (error) {
            console.error('Error al crear el post:', error);
        }
    };

    const addTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <form onSubmit={handleSubmit} className="post-form">
            <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del post"
                required
            />
            
            <div className="font-controls">
                {['regular', 'bold', 'italic'].map(style => (
                    <button
                        key={style}
                        type="button"
                        className={`font-btn ${fontStyle === style ? 'active' : ''}`}
                        onClick={() => setFontStyle(style)}
                    >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                ))}
            </div>
            
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Contenido del post"
                required
                className={fontStyle}
            />
            
            <div className="tags-input">
                <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Agregar etiqueta"
                />
                <button type="button" onClick={addTag}>+</button>
                
                <div className="tag-container">
                    {tags.map(tag => (
                        <span key={tag} className="tag">
                            {tag}
                            <button 
                                type="button" 
                                onClick={() => removeTag(tag)}
                                className="remove-tag"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            
            <button type="submit">Publicar</button>
        </form>
    );
}