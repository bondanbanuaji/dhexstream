import { useState, useEffect } from 'react';

const ANILIST_QUERY = `
  query ($search: String) {
    Media (search: $search, type: ANIME) {
      id
      bannerImage
      coverImage {
        extraLarge
      }
    }
  }
`;

export const useAniListImage = (title) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!title) return;

        const fetchImage = async () => {
            // Clean title for better search results (remove "Sub Indo", etc)
            const cleanTitle = title.replace(/sub\s*indo/gi, '').replace(/subtitle\s*indonesia/gi, '').trim();

            try {
                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: ANILIST_QUERY,
                        variables: { search: cleanTitle }
                    })
                });

                const data = await response.json();
                const media = data?.data?.Media;

                if (media) {
                    // Prefer banner, fallback to extraLarge cover
                    setImage(media.bannerImage || media.coverImage?.extraLarge || null);
                }
            } catch (error) {
                console.error("Failed to fetch AniList image", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [title]);

    return { image, loading };
};
