import React from 'react';
import fetch from 'isomorphic-unfetch';
import renderHTML from 'react-render-html';

const ArticlePage = ({ article, content }) => (
    <div>
        <h1>{article['Content~Marketing/Title-be']}</h1>
        <p>{article['Content~Marketing/Subtitle-be']}</p>
        {renderHTML(content['8f0393b3-ab15-11e9-afc5-ffb30d2a8ffb'])}
    </div>
);

ArticlePage.getInitialProps = async () =>
    fetch('http://localhost:3000/api/article').then(res => res.json());

export default ArticlePage;
