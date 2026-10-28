import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';

type Message = {
  role: 'bot' | 'user';
  text: string;
};

type KnowledgeEntry = {
  keywords: string[];
  response: string;
};

const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ['камера', 'камеру', 'техник', 'оборудование', 'микрофон', 'свет', 'хромакей', 'арендовать'],
    response: 'Чтобы взять камеру или другое оборудование, зайди в раздел «Медиацентр», выбери нужную технику и нажми «Запросить оборудование». Укажи цель съёмки — для школьных проектов аренда бесплатна! Заявка попадёт на рассмотрение администратору.',
  },
  {
    keywords: ['до скольки', 'время работы', 'часы работы', 'когда работает', 'расписание работы', 'открыт'],
    response: 'Коворкинг работает с 09:00 до 21:00. Доступные тайм-слоты по 2 часа: 09:00-11:00, 11:00-13:00, 13:00-15:00, 15:00-17:00, 17:00-19:00, 19:00-21:00. Забронировать место можно в разделе «Коворкинг».',
  },
  {
    keywords: ['тихая зона', 'тихой зоне', 'правила', 'тишина', 'шум', 'громко'],
    response: 'В тихой зоне действуют правила: полная тишина, телефоны на беззвучном режиме, разговоры только шёпотом или вне зоны. Зона рассчитана на 10 мест — для самостоятельной учёбы и подготовки к экзаменам.',
  },
  {
    keywords: ['забронировать', 'бронирование', 'бронь', 'место', 'забронировать место', 'пропуск'],
    response: 'Чтобы забронировать место: 1) Выбери зону (тихая, проектный офис, переговорная). 2) Укажи дату и тайм-слот. 3) Введи имя и класс. 4) Нажми «Забронировать». После бронирования ты получишь QR-пропуск, который можно скачать на телефон.',
  },
  {
    keywords: ['событие', 'воркшоп', 'лекция', 'митап', 'мастер-класс', 'афиша', 'расписание событий'],
    response: 'Афиша мероприятий — в разделе «Расписание событий». Там можно записаться на воркшопы по подкастам, лекции по ИИ-промптингу, митапы стартапов и воркшопы по видеосъёмке. Места ограничены — записывайся заранее!',
  },
  {
    keywords: ['стоимость', 'цена', 'сколько стоит', 'платно', 'бесплатно', 'сом', 'деньги'],
    response: 'Аренда коворкинга стоит от 40 до 100 сом/час в зависимости от зоны. Оборудование — от 40 сом/час. Для школьных проектов (учеба, хакатоны, школьные новости) всё бесплатно! Калькулятор окупаемости в разделе «Калькулятор» покажет экономику проекта.',
  },
  {
    keywords: ['подкаст', 'записать подкаст', 'аудио', 'звук'],
    response: 'Для записи подкастов у нас есть студийные микрофоны Rode PodMic, петлички Rode Wireless GO и звуковая карта Focusrite. Запроси оборудование в разделе «Медиацентр» — укажи цель «Подкаст». Также проводим воркшопы по подкастингу, следи за афишей!',
  },
  {
    keywords: ['стартап', 'проект', 'питч', 'хакатон', 'идея'],
    response: 'Для стартапов и хакатонов есть «Проектный офис» — зона с маркерными досками и большими столами на 3 команды. Также проводим митапы школьных стартапов, где можно показать свой проект и получить обратную связь от жюри.',
  },
  {
    keywords: ['qr', 'код', 'пропуск', 'скачать'],
    response: 'QR-пропуск генерируется автоматически после бронирования места. В модальном окне нажми «Скачать» — PNG-файл сохранится на устройство. Покажи этот QR-код на входе в коворкинг.',
  },
  {
    keywords: ['привет', 'здравствуй', 'хай', 'hello', 'hi'],
    response: 'Привет! Я Nexus AI Assistant. Могу рассказать про бронирование зон, аренду оборудования, расписание событий, правила коворкинга и многое другое. Спрашивай!',
  },
  {
    keywords: ['спасибо', 'благодарю', 'thanks'],
    response: 'Всегда рад помочь! Если есть ещё вопросы — спрашивай. Удачи в коворкинге!',
  },
];

function findResponse(query: string): string {
  const lower = query.toLowerCase();
  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.response;
  }

  return 'Я пока не знаю ответа на этот вопрос. Попробуй спросить про: бронирование зон, аренду оборудования, расписание событий, стоимость, правила в тихой зоне или время работы коворкинга.';
}

const suggestedQuestions = [
  'Как взять камеру?',
  'До скольки работает коворкинг?',
  'Какие правила в тихой зоне?',
  'Как забронировать место?',
  'Что по событиям?',
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Привет! Я Nexus AI Assistant. Могу помочь с бронированием, арендой оборудования, расписанием событий и правилами коворкинга. Спрашивай!',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isTyping]);

  function sendQuestion(question: string) {
    const q = question.trim();
    if (!q) return;

    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = findResponse(q);
      setMessages((prev) => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 700 + Math.random() * 400);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendQuestion(input);
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[90] w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 shadow-2xl shadow-primary-500/40 flex items-center justify-center hover:scale-110 transition-all animate-glow-pulse"
          aria-label="Открыть чат"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[90] w-[calc(100vw-3rem)] sm:w-96 h-[32rem] max-h-[calc(100vh-3rem)] glass-card rounded-3xl shadow-2xl flex flex-col animate-scale-in origin-bottom-right overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-bold text-sm">Nexus AI Assistant</p>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent-300 animate-glow-pulse" />
                  Онлайн
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-md shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-slate-400 animate-glow-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions (only when few messages) */}
          {messages.length <= 2 && !isTyping && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 bg-slate-50 dark:bg-slate-900/50">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendQuestion(q)}
                  className="px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 rounded-full hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напиши вопрос..."
              className="flex-1 px-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
