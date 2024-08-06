'use client';

import BaseSvg from './BaseSvg';

const docLinks = [
  { href: 'https://onchainkit.xyz', title: 'Docs' },
  { href: 'https://github.com/coinbase/onchainkit', title: 'Github' },
  { href: 'https://discord.gg/8gW3h6w5', title: 'Discord' },
  {
    href: 'https://www.figma.com/community/file/1370194397345450683/onchainkit',
    title: 'Figma',
  },
  { href: 'https://x.com/Onchainkit', title: 'X' },
];

export default function Footer() {
  return (
    <section className="mt-12 mb-6 flex w-full justify-between">
      <aside className="flex items-center">
        <h3 className="mr-2 text-m">Built with love on</h3>
        <BaseSvg />
        <h3 className="ml-1 text-[#0052FF] text-m">Base</h3>
      </aside>
      <ul className="flex gap-6">
        {docLinks.map(({ href, title }) => (
          <li className="flex" id={href}>
            <a href={href} target="_blank" rel="noreferrer">
              <p>{title}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
