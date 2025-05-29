import Link from "next/link";

export default function Layout({ children }) {
    return(
        <html>
            <body>
                <div>
                    <nav className="navbar">
                        <Link className="nav-link" href="/videos">Videos</Link>
                    </nav>
                    <main>{children}</main>
                </div>
            </body>
        </html>
    )
}