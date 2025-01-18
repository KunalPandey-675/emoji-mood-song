import React, { useState } from 'react';

const emojis = [
  { symbol: '😃', mood: 'happy', color: 'bg-yellow-300' },
  { symbol: '😊', mood: 'content', color: 'bg-green-300' },
  { symbol: '😐', mood: 'neutral', color: 'bg-gray-300' },
  { symbol: '😔', mood: 'sad', color: 'bg-blue-300' },
  { symbol: '😢', mood: 'crying', color: 'bg-purple-300' },
  { symbol: '😡', mood: 'angry', color: 'bg-red-500' },
  { symbol: '😴', mood: 'sleepy', color: 'bg-indigo-300' },
  { symbol: '😎', mood: 'cool', color: 'bg-teal-300' },
  { symbol: '🤔', mood: 'thinking', color: 'bg-orange-300' },
  { symbol: '😇', mood: 'blessed', color: 'bg-pink-300' },
];

function App() {
  const [moodHistory, setMoodHistory] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [musicSuggestion, setMusicSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMusicSuggestion = async (mood) => {
    try {
      const response = await fetch(`https://shazam.p.rapidapi.com/search?term=${mood}&locale=en-US&offset=0&limit=1`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '97106eac65msh915271928a85aaep1af9c8jsn91b8a817793c', // Replace with your Shazam API key
          'x-rapidapi-host': 'shazam.p.rapidapi.com'
        }
      });
      const data = await response.json();
      console.log("API Response:", data); // Log the API response for debugging
      if (data.tracks && data.tracks.hits && data.tracks.hits.length > 0) {
        const track = data.tracks.hits[0].track;
        return `${track.title} by ${track.subtitle}`;
      } else {
        return "No suggestion available";
      }
    } catch (error) {
      console.error("Error fetching music suggestion:", error);
      return "No suggestion available";
    }
  };

  const logMood = async (emoji) => {
    const newMood = { ...emoji, timestamp: new Date().toLocaleString() };
    setMoodHistory([newMood, ...moodHistory]);
    setBackgroundColor(emoji.color);
    setLoading(true);
    const suggestion = await fetchMusicSuggestion(emoji.mood);
    setMusicSuggestion(suggestion);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen ${backgroundColor} flex flex-col items-center justify-center font-sans`}>
      <h1 className="text-5xl mb-6 font-display text-primary">Emoji Mood Tracker 🎭</h1>
      <div className="flex space-x-4 mb-8">
        {emojis.map((emoji) => (
          <button
            key={emoji.mood}
            className="text-6xl transform transition-transform duration-200 hover:scale-125"
            onClick={() => logMood(emoji)}
          >
            {emoji.symbol}
          </button>
        ))}
      </div>
      <div className="w-full max-w-md text-center bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-3xl mb-4 font-display text-secondary">Mood History</h2>
        <ul className="space-y-2">
          {moodHistory.map((entry, index) => (
            <li key={index} className="flex justify-between p-2 border rounded-lg bg-gray-100">
              <span className="text-2xl">{entry.symbol}</span>
              <span className="text-sm text-gray-500">{entry.timestamp}</span>
            </li>
          ))}
        </ul>
        {loading ? (
          <div className="mt-4">
            <h3 className="text-xl font-display text-primary">Loading music suggestion...</h3>
          </div>
        ) : (
          musicSuggestion && (
            <div className="mt-4">
              <h3 className="text-xl font-display text-primary">Music Suggestion:</h3>
              <p className="text-lg">{musicSuggestion}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
