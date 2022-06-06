import React from 'react';

export const LinkCard = (link) => {
    const usingLink = link.link;

    return (
        <>
            <h2>Ссылка</h2>

            <p>Ваша ссылка: <a href={usingLink.to} target="_blank" rel="noopener noreferrer">{usingLink.to}</a></p>
            <p>Откуда: <a href={usingLink.from} target="_blank" rel="noopener noreferrer">{usingLink.from}</a></p>
            <p>Количество кликов по ссылке: <strong>{usingLink.clicks}</strong></p>
            <p>Дата создания: <strong>{new Date(usingLink.date).toLocaleDateString()}</strong></p>
        </>
    );
};