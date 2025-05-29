"use client";

import Link from "next/link";

export default function VideoChooserPage() {
    // add api call here later
    // mock data
    const mockData = [
        'intro.mp4',
        '5second.mp4',
        '10second.mp4'
    ]

    return(
        <div>
            <h1>Available Videos:</h1>
            <ul>
                {mockData.map((video, index) => (
                    <li key={index}>
                        <Link href={`/preview/${video}`}>{video}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}