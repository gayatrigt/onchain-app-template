import Link from 'next/link'
import NavbarCta from './NavbarCta'

const Navbar = () => {
    return (
        <section className="py-6 mb-6 flex w-full flex-col md:flex-row px-4 sticky top-0">
            <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
                <Link href={"/"}>
                    <h2 className='text-2xl font-bold'>Bhet</h2>
                </Link>
                <div className="flex items-center gap-3">
                    <NavbarCta />
                </div>
            </div>
        </section>
    )
}

export default Navbar