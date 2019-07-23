import React from 'react';
import Link from 'next/link';

const ARTICLES = [
    { slug: 'sample', title: 'Sample Article' },
    { slug: 'dushy', title: 'Дзе жывуць душы беларусаў?' },
];

export default () => (
    <div>
        <h2>Hello, Fibery.io + Next.js!</h2>
        <ul>
            {ARTICLES.map(({ slug, title }) => (
                <li key={slug}>
                    <Link href="/articles/[slug]" as={`/articles/${slug}`}>
                        <a>{title}</a>
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);
