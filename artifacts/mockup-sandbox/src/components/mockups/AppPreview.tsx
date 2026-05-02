import React, { useState, useEffect } from 'react';
import { Search, Heart, Book as BookIcon, ChevronRight, Loader2 } from 'lucide-react';

// Simulated Book Type
interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

const AppPreview = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [saved, setSaved] = useState<Book[]>(() => {
    const stored = localStorage.getItem('saved_books_data');
    return stored ? JSON.parse(stored) : [];
  });
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [description, setDescription] = useState<string>('');
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [view, setView] = useState<'list' | 'detail'>('list');

  // REAL API call to Open Library
  const searchBooks = async (q: string, p = 1, isLoadMore = false) => {
    if (!q.trim()) {
       setBooks([]);
       return;
    }
    
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    
    try {
      const offset = (p - 1) * 20;
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=20&offset=${offset}&fields=key,title,author_name,first_publish_year,cover_i`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (isLoadMore) {
        setBooks(prev => [...prev, ...data.docs]);
        setPage(p);
      } else {
        setBooks(data.docs);
        setPage(1);
      }
      
      setHasMore(data.docs.length === 20);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    searchBooks('Programming', 1);
  }, []);

  const fetchDescription = async (key: string) => {
    setLoadingDescription(true);
    setDescription('');
    try {
      const response = await fetch(`https://openlibrary.org${key}.json`);
      const data = await response.json();
      const desc = data.description?.value || data.description || 'No description available for this edition.';
      setDescription(desc);
    } catch (e) {
      setDescription('Failed to load description.');
    } finally {
      setLoadingDescription(false);
    }
  };

  const toggleSave = (book: Book) => {
    let newSaved;
    const isSaved = saved.some(b => b.key === book.key);
    if (isSaved) {
      newSaved = saved.filter(b => b.key !== book.key);
    } else {
      newSaved = [...saved, book];
    }
    setSaved(newSaved);
    localStorage.setItem('saved_books_data', JSON.stringify(newSaved));
  };

  const isBookSaved = (key: string) => saved.some(b => b.key === key);

  const displayedBooks = activeTab === 'search' 
    ? books 
    : saved;

  if (view === 'detail' && selectedBook) {
    return (
      <div className="flex flex-col h-screen bg-[#1a1a2e] text-white font-sans max-w-md mx-auto border-x border-gray-800 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="p-6">
          <button onClick={() => setView('list')} className="mb-6 p-2 bg-[#16213e] rounded-full hover:bg-gray-800 transition-colors">
            <ChevronRight className="h-6 w-6 rotate-180" />
          </button>
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-48 h-64 bg-[#0f3460] rounded-2xl flex items-center justify-center shadow-2xl mb-6">
              <BookIcon className="h-20 w-20 text-blue-400 opacity-20" />
            </div>
            <h1 className="text-2xl font-bold mb-2 leading-tight">{selectedBook.title}</h1>
            <p className="text-blue-400 text-lg mb-1">{selectedBook.author_name?.[0]}</p>
            <p className="text-gray-500 text-sm">{selectedBook.first_publish_year}</p>
          </div>

          <div className="space-y-6 px-2">
            <div>
              <h3 className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Description</h3>
              {loadingDescription ? (
                <div className="flex gap-2 items-center text-gray-500 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Fetching full story...</span>
                </div>
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {description}
                </p>
              )}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => toggleSave(selectedBook)}
                className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isBookSaved(selectedBook.key) ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-gray-800 text-gray-400'}`}
              >
                <Heart className={`h-5 w-5 ${isBookSaved(selectedBook.key) ? 'fill-current' : ''}`} />
                {isBookSaved(selectedBook.key) ? 'Saved' : 'Save Book'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#1a1a2e] text-white font-sans max-w-md mx-auto border-x border-gray-800 shadow-2xl overflow-hidden">
      {/* Status Bar Area */}
      <div className="h-10 flex items-center justify-between px-6 pt-2 text-xs opacity-60">
        <span>9:41</span>
        <div className="flex gap-1.5">
          <div className="w-4 h-2.5 border border-white rounded-sm"></div>
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Header */}
      <div className="p-6 pb-2">
        <h1 className="text-3xl font-bold mb-4 tracking-tight">
          {activeTab === 'search' ? 'Discover' : 'My Bookshelf'}
        </h1>
        
        {activeTab === 'search' && (
          <div className="relative group">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              className="w-full bg-[#16213e] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              placeholder="Search by title, author, or ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchBooks(query, 1)}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-50">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <p className="text-sm">Fetching results...</p>
          </div>
        ) : displayedBooks.length > 0 ? (
          <div className="space-y-4">
            {displayedBooks.map((book) => (
              <div 
                key={book.key} 
                onClick={() => { 
                  setSelectedBook(book); 
                  setView('detail'); 
                  fetchDescription(book.key);
                }}
                className="bg-[#16213e] rounded-2xl p-3 flex gap-4 hover:bg-[#1f2d52] transition-colors cursor-pointer border border-transparent active:border-gray-700"
              >
                {/* Cover Image Placeholder */}
                <div className="w-20 h-28 bg-[#0f3460] rounded-xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                  <BookIcon className="h-8 w-8 text-blue-400 opacity-20" />
                </div>
                
                {/* Book Details */}
                <div className="flex-1 flex flex-col justify-center py-1">
                  <h3 className="font-semibold text-base line-clamp-2 leading-tight mb-1">{book.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{book.author_name?.[0]}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-gray-500">{book.first_publish_year}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(book);
                      }}
                      className={`p-2 rounded-full transition-all ${isBookSaved(book.key) ? 'bg-pink-500/10 text-pink-500' : 'bg-gray-800 text-gray-400'}`}
                    >
                      <Heart className={`h-4 w-4 ${isBookSaved(book.key) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center pr-1 opacity-20">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            ))}
            
            {activeTab === 'search' && hasMore && (
              <button 
                onClick={() => searchBooks(query, page + 1, true)}
                className="w-full py-4 bg-[#16213e] rounded-2xl text-blue-400 font-semibold border border-blue-500/20 hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2"
                disabled={loadingMore}
              >
                {loadingMore ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Load More'}
              </button>
            )}
            
            {activeTab === 'search' && !hasMore && (
              <div className="py-8 text-center opacity-30 text-xs">
                No more results found
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 opacity-40">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">No books found</p>
            <p className="text-sm">Try searching for something else</p>
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div className="h-20 bg-[#16213e] border-t border-gray-800 flex items-center justify-around px-8 pb-4">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'search' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Search className="h-6 w-6" />
          <span className="text-[10px] font-medium uppercase tracking-widest">Search</span>
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'saved' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Heart className={`h-6 w-6 ${activeTab === 'saved' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-medium uppercase tracking-widest">Saved</span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0f3460; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AppPreview;
