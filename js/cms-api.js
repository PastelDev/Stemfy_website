(function () {
  const DEFAULTS = {
    baseUrl: 'https://cms.stemfy.gr',
    perPage: 100,
    endpoints: {
      posts: '/wp-json/wp/v2/posts',
      news: '/wp-json/wp/v2/news',
      resources: '/wp-json/wp/v2/resources'
    },
    categoryFallbacks: {
      news: 'news',
      resources: 'resources'
    },
    langParam: null,
    langMap: { en: 'en', el: 'el' }
  };

  const userConfig = window.STEMFY_CMS || {};
  const config = {
    ...DEFAULTS,
    ...userConfig,
    endpoints: { ...DEFAULTS.endpoints, ...(userConfig.endpoints || {}) },
    categoryFallbacks: { ...DEFAULTS.categoryFallbacks, ...(userConfig.categoryFallbacks || {}) }
  };

  const baseUrl = (config.baseUrl || DEFAULTS.baseUrl).replace(/\/$/, '');
  const perPage = config.perPage || DEFAULTS.perPage;
  const langParam = config.langParam;
  const langMap = config.langMap || DEFAULTS.langMap;
  const categoryCache = {};

  function buildUrl(pathOrUrl, params) {
    if (!pathOrUrl) return null;
    const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
    const url = new URL(isAbsolute ? pathOrUrl : `${baseUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, value);
        }
      });
    }
    return url.toString();
  }

  async function fetchJson(url) {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  }

  async function tryFetch(urls) {
    let lastError = null;
    for (const url of urls) {
      if (!url) continue;
      try {
        return await fetchJson(url);
      } catch (error) {
        lastError = error;
      }
    }
    if (lastError) throw lastError;
    return [];
  }

  async function getCategoryId(slug) {
    if (!slug) return null;
    if (Object.prototype.hasOwnProperty.call(categoryCache, slug)) {
      return categoryCache[slug];
    }
    const url = buildUrl('/wp-json/wp/v2/categories', { slug });
    try {
      const data = await fetchJson(url);
      const id = Array.isArray(data) && data[0] ? data[0].id : null;
      categoryCache[slug] = id || null;
      return categoryCache[slug];
    } catch (error) {
      categoryCache[slug] = null;
      return null;
    }
  }

  function stripHtml(value) {
    return String(value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function readValue(value) {
    if (value == null) return '';
    if (typeof value === 'object') {
      if (value.rendered != null) return stripHtml(value.rendered);
      if (value.raw != null) return stripHtml(value.raw);
    }
    return stripHtml(value);
  }

  function getField(item, key) {
    if (!item || !key) return null;
    if (Object.prototype.hasOwnProperty.call(item, key)) return item[key];
    if (item.acf && Object.prototype.hasOwnProperty.call(item.acf, key)) return item.acf[key];
    if (item.meta && Object.prototype.hasOwnProperty.call(item.meta, key)) return item.meta[key];
    return null;
  }

  function getLocalizedField(item, baseKey, lang) {
    const langKey = `${baseKey}_${lang}`;
    const langValue = getField(item, langKey);
    if (langValue) return readValue(langValue);

    const fallback = getField(item, baseKey);
    if (fallback) return readValue(fallback);

    if (baseKey === 'title') {
      return readValue(item && item.title ? item.title : '');
    }

    if (baseKey === 'content' || baseKey === 'description') {
      const content = item && item.content ? item.content : null;
      const excerpt = item && item.excerpt ? item.excerpt : null;
      return readValue(content || excerpt || '');
    }

    return '';
  }

  function getCreatedAt(item) {
    return (
      getField(item, 'created_at') ||
      getField(item, 'date') ||
      getField(item, 'date_gmt') ||
      getField(item, 'modified') ||
      getField(item, 'updated_at') ||
      ''
    );
  }

  function flattenTerms(embedded) {
    const list = [];
    if (!embedded) return list;
    embedded.forEach((entry) => {
      if (Array.isArray(entry)) {
        entry.forEach((term) => list.push(term));
      }
    });
    return list;
  }

  function getCategorySlug(item) {
    const direct = getField(item, 'category');
    if (direct) return direct;
    const terms = item && item._embedded && item._embedded['wp:term'] ? flattenTerms(item._embedded['wp:term']) : [];
    const category = terms.find((term) => term && term.taxonomy === 'category');
    return category ? category.slug || category.name : '';
  }

  function toBool(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
    return false;
  }

  function inferMediaType(url, mime, fallback) {
    const lowerUrl = (url || '').toLowerCase();
    const extension = lowerUrl.split('.').pop();
    if (mime && mime.startsWith('video/')) return 'video';
    if (mime && mime.startsWith('image/')) return 'image';
    if (['mp4', 'webm', 'mov', 'm4v'].includes(extension)) return 'video';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    return fallback || 'image';
  }

  function normalizeMediaItem(item) {
    if (!item) return null;
    const url =
      item.url ||
      item.source_url ||
      item.file ||
      (item.guid && item.guid.rendered) ||
      item.guid ||
      '';
    if (!url) return null;
    const mime = item.mime_type || item.mime || '';
    const type = item.type || item.media_type || inferMediaType(url, mime);
    return { type, url };
  }

  function extractMedia(item) {
    const collected = [];
    const direct = getField(item, 'media') || getField(item, 'media_items');
    if (Array.isArray(direct)) {
      direct.forEach((mediaItem) => {
        const normalized = normalizeMediaItem(mediaItem);
        if (normalized) collected.push(normalized);
      });
    }

    const acfMediaKeys = ['media', 'gallery', 'media_gallery', 'post_media'];
    acfMediaKeys.forEach((key) => {
      const acfField = item && item.acf ? item.acf[key] : null;
      if (Array.isArray(acfField)) {
        acfField.forEach((mediaItem) => {
          const normalized = normalizeMediaItem(mediaItem);
          if (normalized) collected.push(normalized);
        });
      }
    });

    const featured = item && item._embedded && item._embedded['wp:featuredmedia'] ? item._embedded['wp:featuredmedia'] : null;
    if (Array.isArray(featured) && featured.length > 0) {
      const featuredItem = normalizeMediaItem(featured[0]);
      if (featuredItem) collected.push(featuredItem);
    }

    const legacyImage = getField(item, 'image_url') || getField(item, 'featured_image');
    if (legacyImage) {
      const normalized = normalizeMediaItem({ url: legacyImage });
      if (normalized) collected.push(normalized);
    }

    const unique = [];
    const seen = new Set();
    collected.forEach((mediaItem) => {
      if (!mediaItem || !mediaItem.url) return;
      if (seen.has(mediaItem.url)) return;
      seen.add(mediaItem.url);
      unique.push(mediaItem);
    });
    return unique;
  }

  function extractFileUrl(item) {
    const fields = ['file_url', 'file', 'pdf', 'attachment', 'resource_file', 'download'];
    for (const field of fields) {
      const value = getField(item, field);
      if (!value) continue;
      if (typeof value === 'string') return value;
      if (value.url) return value.url;
    }
    return '';
  }

  function normalizeNewsItem(item, lang) {
    const fileUrl = extractFileUrl(item);
    const linkUrl = getField(item, 'link_url') || getField(item, 'link') || fileUrl || '';

    return {
      id: item.id || item.ID || item.slug || `${Math.random()}`,
      title_en: getLocalizedField(item, 'title', 'en'),
      title_el: getLocalizedField(item, 'title', 'el'),
      content_en: getLocalizedField(item, 'content', 'en') || getLocalizedField(item, 'description', 'en'),
      content_el: getLocalizedField(item, 'content', 'el') || getLocalizedField(item, 'description', 'el'),
      file_url: fileUrl,
      link_url: linkUrl,
      category: getCategorySlug(item) || 'general',
      pinned: toBool(getField(item, 'pinned')),
      created_at: getCreatedAt(item)
    };
  }

  function normalizePostItem(item) {
    return {
      id: item.id || item.ID || item.slug || `${Math.random()}`,
      title_en: getLocalizedField(item, 'title', 'en'),
      title_el: getLocalizedField(item, 'title', 'el'),
      description_en: getLocalizedField(item, 'description', 'en') || getLocalizedField(item, 'content', 'en'),
      description_el: getLocalizedField(item, 'description', 'el') || getLocalizedField(item, 'content', 'el'),
      media: extractMedia(item),
      created_at: getCreatedAt(item)
    };
  }

  function normalizeResourceItem(item) {
    return {
      id: item.id || item.ID || item.slug || `${Math.random()}`,
      title_en: getLocalizedField(item, 'title', 'en'),
      title_el: getLocalizedField(item, 'title', 'el'),
      description_en: getLocalizedField(item, 'description', 'en') || getLocalizedField(item, 'content', 'en'),
      description_el: getLocalizedField(item, 'description', 'el') || getLocalizedField(item, 'content', 'el'),
      file_url: extractFileUrl(item),
      type: getField(item, 'type') || getField(item, 'resource_type') || 'pdf',
      created_at: getCreatedAt(item)
    };
  }

  function resolveEndpoints(type) {
    const entry = config.endpoints && config.endpoints[type];
    if (!entry) return [];
    return Array.isArray(entry) ? entry : [entry];
  }

  function withDefaultParams(urls, lang) {
    const params = { per_page: perPage, _embed: 1 };
    if (langParam) {
      params[langParam] = langMap[lang] || lang;
    }
    return urls.map((url) => buildUrl(url, params));
  }

  async function fetchCollection(type, lang) {
    const endpoints = resolveEndpoints(type);
    const urls = withDefaultParams(endpoints, lang);
    let data = [];
    if (urls.length) {
      try {
        data = await tryFetch(urls);
      } catch (error) {
        data = [];
      }
    }

    if ((!data || data.length === 0) && config.categoryFallbacks[type]) {
      const slug = config.categoryFallbacks[type];
      const categoryId = await getCategoryId(slug);
      if (categoryId) {
        const postsEndpoint = config.endpoints.posts || DEFAULTS.endpoints.posts;
        const url = buildUrl(postsEndpoint, {
          per_page: perPage,
          _embed: 1,
          categories: categoryId,
          ...(langParam ? { [langParam]: langMap[lang] || lang } : {})
        });
        try {
          data = await tryFetch([url]);
        } catch (error) {
          data = [];
        }
      }
    }

    return Array.isArray(data) ? data : [];
  }

  async function fetchNews(lang) {
    const items = await fetchCollection('news', lang);
    const normalized = items.map((item) => normalizeNewsItem(item, lang));
    normalized.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return normalized;
  }

  async function fetchPosts(lang) {
    const items = await fetchCollection('posts', lang);
    return items.map((item) => normalizePostItem(item));
  }

  async function fetchResources(lang) {
    const items = await fetchCollection('resources', lang);
    return items.map((item) => normalizeResourceItem(item));
  }

  window.stemfyCms = {
    config: {
      baseUrl,
      perPage,
      endpoints: config.endpoints,
      categoryFallbacks: config.categoryFallbacks
    },
    fetchNews,
    fetchPosts,
    fetchResources
  };
})();
