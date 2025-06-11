"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function VideoChooserPage() {
    // add api call here later
    // mock data
    // const mockData = [
    //     'intro.mp4',
    //     '5second.mp4',
    //     '10second.mp4',
    //     'Salamander5Seconds.mp4'
    // ]

    const [ videos, setVideos ] = useState([]);

    useEffect(() => {
        getVideos();
    }, []);

    const getVideos = async () => {
        const res = await fetch('http://localhost:3000/api/videos');

        const data = await res.json();

        setVideos(data);
    };

    return(
        <div>
            <h1>Available Videos:</h1>
            <ul>
                {videos.map((filename) => (
                    <li key={filename}>
                        <Link data-testid="video-link" data-filename={filename} href={`/preview/${filename}`}> {filename} </Link>
                    </li>
                    ))}
            </ul>
        </div>
    )
}