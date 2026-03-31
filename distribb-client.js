/**
 * Distribb API Client
 * 
 * Client for sending content TO Distribb.
 * 
 * Note: This assumes Distribb has a public API for creating content.
 * If not available, this serves as a template for when they add it.
 */

// Using native fetch (Node.js 18+) or node-fetch fallback
let fetchImpl;
try {
  fetchImpl = globalThis.fetch;
} catch {
  fetchImpl = require('node-fetch');
}

// Configuration
const API_KEY = process.env.DISTRIBB_API_KEY;
const API_URL = process.env.DISTRIBB_API_URL || 'https://distribb.io/api/v1';

class DistribbClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey || API_KEY;
    this.baseUrl = options.baseUrl || API_URL;
    
    if (!this.apiKey) {
      throw new Error('Distribb API key is required');
    }
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetchImpl(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Distribb API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Create a new article in Distribb
   */
  async createArticle(article) {
    const payload = {
      title: article.title,
      content: article.content,
      content_format: article.contentFormat || 'markdown', // 'markdown' or 'html'
      status: article.status || 'draft', // 'draft' or 'published'
      meta_description: article.metaDescription,
      tags: article.tags || [],
      author: article.author,
      project_id: article.projectId,
      schedule_at: article.scheduleAt, // ISO date string for scheduled publishing
      image_url: article.imageUrl,
      alt_text: article.altText
    };

    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Update an existing article
   */
  async updateArticle(articleId, updates) {
    return this.request(`/articles/${articleId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  /**
   * Get article by ID
   */
  async getArticle(articleId) {
    return this.request(`/articles/${articleId}`);
  }

  /**
   * List articles
   */
  async listArticles(options = {}) {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.projectId) params.append('project_id', options.projectId);
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/articles${queryString}`);
  }

  /**
   * Delete an article
   */
  async deleteArticle(articleId) {
    return this.request(`/articles/${articleId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Publish a draft article immediately
   */
  async publishArticle(articleId) {
    return this.request(`/articles/${articleId}/publish`, {
      method: 'POST'
    });
  }

  /**
   * Schedule article for future publishing
   */
  async scheduleArticle(articleId, publishAt) {
    return this.request(`/articles/${articleId}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ publish_at: publishAt })
    });
  }

  /**
   * Get list of projects
   */
  async listProjects() {
    return this.request('/projects');
  }

  /**
   * Get project by ID
   */
  async getProject(projectId) {
    return this.request(`/projects/${projectId}`);
  }
}

// Export singleton instance
module.exports = {
  DistribbClient,
  client: new DistribbClient()
};
