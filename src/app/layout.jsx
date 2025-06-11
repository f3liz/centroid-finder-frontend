import Link from "next/link";

export default function Layout({ children }) {
    return(
        <html>
            <body>
                <div>
                    <nav className="navbar">
                        <Link data-testid="nav-home" className="nav-link" href="/">Home</Link>
                        <Link data-testid="nav-videos" className="nav-link" href="/videos">Videos</Link>
                        <Link data-testid="nav-jobs" className="nav-link" href="/jobs">Jobs</Link>
                    </nav>
                    <main>{children}</main>
                </div>
            </body>
        </html>
    )
}