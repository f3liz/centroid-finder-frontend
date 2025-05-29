"use client";

import { useParams } from "next/navigation";

export default function PreviewPage() {
    const { filename } = useParams();

    return (
        <div>
            <h1>Preview</h1>
            <p>Video being previewed: {filename}</p>
        </div>
    )
}