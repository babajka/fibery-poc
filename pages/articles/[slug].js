import React from 'react';
import Link from 'next/link';

import fetch from 'isomorphic-unfetch';
import renderHTML from 'react-render-html';

const ArticlePage = ({ article }) => (
    <div>
        <style jsx>{`
            h1 {
                color: ${article['Content~Marketing/Color']};
            }
        `}</style>
        <Link href="/">
            <a>Home</a>
        </Link>
        <h1>{article['Content~Marketing/Title-be']}</h1>
        <p>{article['Content~Marketing/Subtitle-be']}</p>
        {renderHTML(article['Content~Marketing/Text-be'])}
    </div>
);

ArticlePage.getInitialProps = async ({ query }) =>
    fetch(`http://localhost:3000/api/articles/${query.slug}`).then(res =>
        res.json()
    );

export default ArticlePage;
