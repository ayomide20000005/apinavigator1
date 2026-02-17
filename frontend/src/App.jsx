import React, { useState } from 'react';
import { Search, MessageSquare, Sun, Moon, ExternalLink, Send, Loader2 } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    // Only search when user presses Enter
    if (e.key === 'Enter' && query.trim() !== "") {
      setLoading(true);
      setError("");
      setResult(null);
      
      try {
        // UPDATED: Now points to your live Render backend
        const response = await fetch(`https://apinavigator1.onrender.com/search?model=${query.toLowerCase()}`);
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || "Something went wrong");
        } else {
          setResult(data);
        }
      } catch (err) {
        setError("The server is waking up or offline. Please try again in 30 seconds.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-slate-900'} h-screen flex transition-colors duration-300 font-sans`}>
      
      {/* 1. Sidebar */}
      <aside className={`w-72 border-r ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'} hidden md:flex flex-col`}>
        <div className="p-6 font-bold text-xl flex justify-between items-center tracking-tighter">
          API NAVIGATOR
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl hover:bg-blue-500/10 transition-colors text-blue-500">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="px-4 text-xs font-bold opacity-40 uppercase mb-4">Examples</div>
        <div className="px-4 space-y-2">
           {['gpt-4o', 'gemini', 'llama-3'].map(item => (
             <div key={item} className={`p-3 rounded-lg text-sm cursor-pointer ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`} onClick={() => setQuery(item)}>
               {item}
             </div>
           ))}
        </div>
      </aside>

      {/* 2. Center Content */}
      <main className="flex-1 flex flex-col">
        <header className={`h-16 border-b flex items-center px-8 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search model (e.g. gpt-4o)..." 
              className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm"
            />
          </div>
        </header>

        <section className="flex-1 p-12 flex flex-col items-center justify-center text-center">
          {loading && <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />}
          
          {!result && !error && !loading && (
            <div className="opacity-30">
              <Search size={60} className="mx-auto mb-4" />
              <h2 className="text-xl font-medium">Ready to explore?</h2>
              <p>Type a model name and press Enter</p>
            </div>
          )}

          {error && <div className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">{error}</div>}

          {result && (
            <div className={`p-8 rounded-3xl border w-full max-w-md ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-xl'}`}>
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                <ExternalLink color="white" size={30} />
              </div>
              <h2 className="text-3xl font-bold capitalize mb-2">{result.model}</h2>
              <p className="opacity-60 mb-6 text-sm">Official documentation found for this model.</p>
              <a 
                href={result.link} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02]"
              >
                Open API Docs
              </a>
            </div>
          )}
        </section>
      </main>

      {/* 3. Chat Component (Simple) */}
      <section className={`w-80 border-l ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'} hidden lg:flex flex-col`}>
        <div className="p-4 border-b font-bold text-sm flex items-center gap-2 dark:border-slate-800 uppercase tracking-widest opacity-50">
          <MessageSquare size={16} /> AI Chat
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
           <div className={`p-3 rounded-2xl text-xs ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
             Search for a model, then ask me questions about the link!
           </div>
        </div>
        <div className="p-4 border-t dark:border-slate-800">
          <div className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
            <input type="text" placeholder="Chat..." className="bg-transparent outline-none flex-1 text-xs px-2" />
            <Send size={14} className="text-blue-500 mr-2" />
          </div>
        </div>
      </section>
    </div>
  );
}