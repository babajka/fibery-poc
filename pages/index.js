import React from 'react';
import fetch from 'isomorphic-unfetch';
import renderHTML from 'react-render-html';

const ArticlePage = article => (
    <div>
        <h1>{article['Content~Marketing/Title-be']}</h1>
        <p>{article['Content~Marketing/Subtitle-be']}</p>
        {renderHTML(article['Content~Marketing/Text-be'])}
    </div>
);

ArticlePage.getInitialProps = async () =>
    fetch('http://localhost:3000/api/article').then(res => res.json());

export default ArticlePage;
