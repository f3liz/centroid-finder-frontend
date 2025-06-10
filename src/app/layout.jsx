import Link from "next/link";

export default function Layout({ children }) {
    return(
        <html>
            <body>
                <div>
                    <nav className="navbar">
                        <Link className="nav-link" href="/">Home</Link>
                        <Link className="nav-link" href="/videos">Videos</Link>
                        <Link className="nav-link" href="/jobs">Jobs</Link>
                    </nav>
                    <main>{children}</main>
                </div>
            </body>
        </html>
    )
}