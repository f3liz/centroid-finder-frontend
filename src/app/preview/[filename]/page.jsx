"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';

export default function PreviewPage() {
    const { filename } = useParams();
    const [ imageUrl, setImageUrl ] = useState(null);

    useEffect(() => {
        fetchThumbnail();
    }, [filename]);

    const fetchThumbnail = async () => {
        const res = await fetch(`http://localhost:3000/thumbnail/${filename}`);
                
        const blob = await res.blob();
                
        setImageUrl(URL.createObjectURL(blob));
    };

    return (
        <div>
            <h1>Preview</h1>
            <p>Video being previewed: {filename}</p>
            {imageUrl ? (
                <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                    <h3>Original Frame</h3>
                    <img src={imageUrl} alt="Thumbnail" width={320} height={240} />
                </div>
                <div>
                    <h3>Binarized Preview</h3>
                    <p>(Will update live in Step 3)</p>
                </div>
                </div>
            ) : (
                <p>Loading thumbnail...</p>
            )}
        </div>
    )
}