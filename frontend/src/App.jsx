import React, { useState, useEffect } from 'react';
import api from './api';

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/articles');
      setArticles(response.data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchArticles();
    setRefreshing(false);
  };

  const handleArticleClick = async (id) => {
    try {
      const response = await api.get(`/articles/${id}`);
      setSelectedArticle(response.data);
    } catch (error) {
      console.error("Failed to fetch article details:", error);
    }
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            BeyondChats Articles
          </h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`btn-primary ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : selectedArticle ? (
          <div className="glass-card p-8 animate-fade-in-up">
            <button
              onClick={handleBack}
              className="mb-6 text-sm text-secondary hover:text-white transition-colors flex items-center gap-2"
            >
              ← Back to list
            </button>
            <h2 className="text-3xl font-bold mb-4">{selectedArticle.title}</h2>
            <div className="flex items-center gap-4 mb-8 text-sm text-secondary">
              <span>{new Date(selectedArticle.created_at).toLocaleDateString()}</span>
              {selectedArticle.link && (
                <a href={selectedArticle.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  Original Source
                </a>
              )}
            </div>

            <div className="prose prose-invert max-w-none text-lg leading-relaxed text-gray-300">
              {/* Simple rendering for now. In real app use react-markdown if content is markdown */}
              {selectedArticle.content ? (
                selectedArticle.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))
              ) : (
                <p className="italic text-gray-500">No content available.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {articles.length === 0 ? (
              <div className="text-center text-gray-400 py-10 glass-card">
                No articles found. Run the scraper or processor to add content.
              </div>
            ) : (
              articles.map((article, idx) => (
                <a
                  key={article.id}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 cursor-pointer group animate-fade-in-up block text-left"
                  style={{ animationDelay: `${idx * 100}ms`, textDecoration: 'none', color: 'inherit' }}
                >
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-primary transition-colors no-underline">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 line-clamp-2 no-underline" style={{ textDecoration: 'none' }}>
                    {article.content || 'Click to read full article...'}
                  </p>
                  <div className="mt-4 flex justify-between items-center text-xs text-secondary no-underline">
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    <span className="group-hover:translate-x-1 transition-transform text-accent no-underline">Read Source →</span>
                  </div>
                </a>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
