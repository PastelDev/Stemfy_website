/**
 * Local API Client
 * Fetches posts, resources, and news from the local JSON API
 */
(function () {
  const API_ENDPOINT = '/admin/api.php';

  async function fetchJson(url) {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  }

  async function fetchPosts(lang) {
    try {
      const data = await fetchJson(`${API_ENDPOINT}?type=posts`);
      if (!data.success) {
        return [];
      }
      return (data.posts || []).map(post => ({
        id: post.id,
        title_en: post.title_en || '',
        title_el: post.title_el || '',
        description_en: post.description_en || '',
        description_el: post.description_el || '',
        media: post.media || [],
        created_at: post.created_at || ''
      }));
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      return [];
    }
  }

  async function fetchResources(lang) {
    try {
      const data = await fetchJson(`${API_ENDPOINT}?type=posts`);
      if (!data.success) {
        return [];
      }
      return (data.resources || []).map(resource => ({
        id: resource.id,
        title_en: resource.title_en || '',
        title_el: resource.title_el || '',
        description_en: resource.description_en || '',
        description_el: resource.description_el || '',
        file_url: resource.file_url || '',
        type: resource.type || 'pdf',
        created_at: resource.created_at || ''
      }));
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      return [];
    }
  }

  async function fetchNews(lang) {
    try {
      const data = await fetchJson(`${API_ENDPOINT}?type=news`);
      if (!data.success) {
        return [];
      }
      const announcements = data.announcements || [];
      // Sort: pinned items first, then by date (already sorted by API, but ensure)
      announcements.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      return announcements.map(item => ({
        id: item.id,
        title_en: item.title_en || '',
        title_el: item.title_el || '',
        content_en: item.content_en || '',
        content_el: item.content_el || '',
        file_url: item.file_url || '',
        link_url: item.link_url || item.file_url || '',
        category: item.category || 'general',
        pinned: Boolean(item.pinned),
        created_at: item.created_at || ''
      }));
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  }

  // Expose the same interface as the old cms-api.js for compatibility
  window.stemfyCms = {
    config: {
      baseUrl: window.location.origin,
      perPage: 100,
      endpoints: {
        posts: '/admin/api.php?type=posts',
        news: '/admin/api.php?type=news',
        resources: '/admin/api.php?type=posts'
      }
    },
    fetchNews,
    fetchPosts,
    fetchResources
  };
})();
