import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = (endpoint, params = {}, shouldFetch = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!shouldFetch) {
            // If shouldFetch is false, reset data, error, and ensure loading is false
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }


        // Determine base URL based on environment
        // If we are in development (localhost), we might be served from /dhexstream/ or root
        // In Vercel, we are at root but API is at /api.php
        // We use a relative path strategy or environment variable if available

        let baseUrl = '';
        if (window.location.hostname === 'localhost') {
            baseUrl = '/dhexstream/api.php';
        } else {
            // Production / Vercel
            baseUrl = '/api.php';
        }

        const url = `${baseUrl}?endpoint=${endpoint}`;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(url, {
                    params,
                    withCredentials: true // Important: Send cookies for user tracking
                });
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, JSON.stringify(params)]);

    return { data, loading, error };
};
