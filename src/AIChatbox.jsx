import React, { useState, useRef, useEffect } from 'react';

export default function AIChatbox({ messages, setMessages }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Jika sesi ini memiliki riwayat pesan, otomatis status welcome screen tersembunyi
  const hasStarted = messages.length > 0;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const suggestions = [
    { label: "🏢 Project Magang", text: "Apa project yang Leo buat saat magang di CV. Sinar Teknologi Indonesia?" },
    { label: "📱 Aplikasi Mobile", text: "Jelaskan tentang aplikasi EkoIndustrial yang dirancang Leo!" },
    { label: "🗺️ Sistem BaliRoute", text: "Apa itu sistem BaliRoute yang diusulkan oleh Leo?" },
    { label: "🏍️ Hobi Otomotif", text: "Apakah Leo punya ketertarikan di bidang otomotif?" },
  ];

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    setInput('');
    const updatedMessages = [...messages, { sender: 'user', text: textToSend }];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Memformat history chat agar sesuai kebutuhan backend Laravel
    const formattedHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    try {
     const response = await fetch('https://portfolio-backend-production-090f.up.railway.app/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          message: textToSend,
          history: formattedHistory
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages([...updatedMessages, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages([...updatedMessages, { sender: 'ai', text: 'Waduh ngab, servernya lagi oleng parah alias error. Coba panggil Leo langsung!' }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([...updatedMessages, { sender: 'ai', text: 'Gagal konek ke backend Laravel. Cek terminalmu, udah php artisan serve?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-900 relative overflow-hidden transition-colors duration-300">
      
      {/* AREA UTAMA CHATFLOW */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:py-8 md:px-0 max-w-4xl w-full mx-auto">
        
        {!hasStarted ? (
          <div className="h-full flex flex-col justify-center items-start space-y-8 py-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Halo, Saya Gemini AI
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-zinc-300 dark:text-zinc-600">
                Asisten Portofolio I Nengah Leo Andika Purnama.
              </h2>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed font-normal">
              Saya siap membantu Anda menelusuri data kompetensi Leo di bidang **Front-end Development**, 
              rincian tugas sistem pemeliharaan fasilitas saat magang, hingga hobi otomotifnya dengan gaya Gen Z. Silakan tanya apa saja!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(item.text)}
                  className="p-5 text-left rounded-2xl bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-32 shadow-sm"
                >
                  <span className="text-zinc-700 dark:text-zinc-300 text-sm font-medium pr-4 leading-snug">{item.text}</span>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                    {item.label} &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-3 md:gap-4 max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto max-w-xl justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0 border border-blue-200 dark:border-blue-900/50">
                    AI
                  </div>
                )}
                
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pl-1">
                    {msg.sender === 'user' ? 'Anda' : 'Gemini Agent'}
                  </p>
                  <div className={`text-[15px] leading-relaxed whitespace-pre-line px-5 py-3.5 rounded-2xl border ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 border-blue-600 dark:border-blue-700 text-white rounded-tr-none shadow-sm' 
                      : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0 animate-pulse">
                  AI
                </div>
                <div className="space-y-1.5 pt-2 w-48">
                  <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full animate-pulse"></div>
                  <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full w-5/6 animate-pulse"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* FOOTER INPUT BOX BAR */}
      <footer className="w-full bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 px-4 py-4 shrink-0 transition-colors duration-300">
        <div className="max-w-4xl w-full mx-auto">
          
          {hasStarted && (
            <div className="flex flex-wrap gap-1.5 mb-3.5 justify-start max-w-3xl">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(item.text)}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="relative flex items-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-zinc-800 focus-within:shadow-md rounded-xl px-5 py-3.5 transition-all w-full"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan di sini..."
              className="flex-1 bg-transparent text-zinc-700 dark:text-zinc-200 text-sm focus:outline-none pr-12 placeholder-zinc-300 dark:placeholder-zinc-600 font-normal"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>

          <p className="text-center text-[10px] text-zinc-300 dark:text-zinc-600 mt-2 tracking-wide">
            Asisten AI Portofolio Leo Purnama. Harap lakukan verifikasi data secara manual.
          </p>
        </div>
      </footer>

    </div>
  );
}