import React, { useState, useEffect } from 'react';
import AIChatbox from './AIChatbox';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // State untuk menyimpan daftar sesi chat backend
  const [chatSessions, setChatSessions] = useState([
    { id: 1, title: 'Obrolan Baru', messages: [] }
  ]);
  const [activeChatId, setActiveChatId] = useState(1);

  // Efek memicu toggle class 'dark' pada elemen HTML paling atas
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Efek mengatur Judul Tebal dan Logo Tab (Favicon) dari folder public
  useEffect(() => {
    // 1. Set nama tab menggunakan karakter Unicode bold
    document.title = "𝗔𝗜 𝗟𝗲𝗼";

    // 2. Manipulasi elemen link icon untuk mengganti favicon ke avatar.png
    let favicon = document.querySelector('link[rel="icon"]');
    
    if (favicon) {
      favicon.href = "/foto-leo.png";
    } else {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/png';
      favicon.href = '/foto-leo.png';
      document.head.appendChild(favicon);
    }
  }, []);

  // Fungsi membuat halaman/sesi chat baru (mengosongkan layar chatbox)
  const handleCreateNewChat = () => {
    const newId = Date.now();
    const newSession = { id: newId, title: `Obrolan #${chatSessions.length + 1}`, messages: [] };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveChatId(newId);
  };

  // Ambil data sesi chat yang sedang dibuka
  const activeChat = chatSessions.find(chat => chat.id === activeChatId) || chatSessions[0];

  // Update pesan di dalam sesi aktif saat ada chat masuk/keluar
  const handleUpdateMessages = (newMessages) => {
    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id === activeChatId) {
          const firstUserMsg = newMessages.find(m => m.sender === 'user');
          const dynamicTitle = firstUserMsg ? firstUserMsg.text.substring(0, 24) + '...' : session.title;
          return { ...session, title: dynamicTitle, messages: newMessages };
        }
        return session;
      })
    );
  };

  // Fungsi mengarahkan langsung ke WhatsApp
  const handleHubungiWhatsApp = () => {
    const waUrl = "https://wa.me/6281237581579?text=Halo%20Leo%2C%20saya%20tertarik%20dengan%20portofolio%20Anda%20dan%20ingin%20bertanya%20lebih%20lanjut%21";
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 flex font-sans antialiased overflow-hidden transition-colors duration-300">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200/80 dark:border-zinc-800 transition-all duration-300 flex flex-col justify-between overflow-hidden shrink-0 z-20`}>
        <div className="p-4 space-y-6">
          
          {/* Header Sidebar */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Dashboard AI</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors"
              title="Tutup Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Tombol Halaman/Sesi Pertanyaan Baru */}
          <div className="space-y-2">
            <button 
              onClick={handleCreateNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/10 transition-all active:scale-[0.98]"
            >
              <span>➕ Halaman Baru</span>
            </button>
          </div>

          {/* PENGATURAN MODE & WHATSAPP */}
          <div className="space-y-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/80">
            <div className="px-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Pengaturan</div>
            
            {/* Switch Mode Terang / Gelap */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">✨ Mode Gelap</span>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 duration-300 ease-in-out ${isDarkMode ? 'bg-blue-600' : 'bg-zinc-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-4' : ''}`} />
              </button>
            </div>

            {/* Tombol Hubungi Langsung Via WhatsApp */}
            <button 
              onClick={handleHubungiWhatsApp}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30 text-left font-bold text-xs transition-all shadow-sm active:scale-[0.98]"
            >
              <span>🟢 Hubungi WA Leo</span>
            </button>
          </div>
        </div>

        {/* Profil Akademik */}
        <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center font-bold text-sm text-blue-600 dark:text-blue-400 shadow-sm">
              LP
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">Leo Purnama</h4>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold truncate">A.Md.Kom | ITB STIKOM</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen relative overflow-hidden bg-white dark:bg-zinc-900 transition-colors duration-300">
        
        {/* Top Header Bar */}
        <header className="h-16 flex items-center px-5 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 justify-between shrink-0 shadow-sm z-10 transition-colors duration-300">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800 shadow-sm transition-all"
                title="Buka Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            )}
            <span className="text-xs font-bold tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent uppercase">
              Leo Portfolio v2.0
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Connected to AI 
          </div>
        </header>

        {/* Komponen Utama Box Chat */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-zinc-900 transition-colors duration-300">
          <AIChatbox 
            messages={activeChat.messages} 
            setMessages={handleUpdateMessages} 
          />
        </div>
      </main>

    </div>
  );
}

export default App;