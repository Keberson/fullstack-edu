import React, {useCallback, useContext, useEffect, useState} from "react";
import {useHTTP} from "../hooks/https.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {LinksList} from "../components/LinksList";

export const LinksPage = () => {
    const [links, setLinks] = useState([]);
    const {loading, request} = useHTTP();
    const {token} = useContext(AuthContext);

    const fetchLinks = useCallback(async () => {
        try {
            const fetched = await request('/api/link', 'GET', null, {
                authtorization: `Bearer ${token}`
            });
            setLinks(fetched);
        } catch (e) { }
    }, [token, request]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && <LinksList links={links} />}
        </>
    );
}