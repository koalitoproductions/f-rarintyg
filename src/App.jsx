import React, { useState, useEffect } from 'react';
import questionsData from './questions.json';

const chapters = [
  {
    title: "Terräng",
    section: "Sjökortsbeteckningar – Terräng",
    desc: "Strandlinjer, vass, säv och grundläggande landkonturer."
  },
  {
    title: "Byggnader m m",
    section: "Sjökortsbeteckningar – Byggnader m m",
    desc: "Hus, broar, master, kraftledningar och teleledningar."
  },
  {
    title: "Landmärken",
    section: "Sjökortsbeteckningar – Landmärken",
    desc: "Kyrkor, vindkraftverk, vattentorn, skorstenar och master."
  },
  {
    title: "Hamnar",
    section: "Sjökortsbeteckningar – Hamnar",
    desc: "Pirar, kajer, dykdalber, slipställen, slussar och kranar."
  },
  {
    title: "Djup",
    section: "Sjökortsbeteckningar – Djup",
    desc: "Djupangivelser, djuphål, muddrat och ramat farvatten."
  },
  {
    title: "Grund, vrak & hinder",
    section: "Sjökortsbeteckningar – Grund, vrak & hinder",
    desc: "Stenar, bränningar, undervattensgrund, vrak och oren botten."
  },
  {
    title: "Offshoreanläggningar",
    section: "Sjökortsbeteckningar – Offshoreanläggningar",
    desc: "Undervattenskablar, elledningar och rörledningar."
  },
  {
    title: "Farleder",
    section: "Sjökortsbeteckningar – Farleder",
    desc: "Farledslinjer, trafiksepareringssystem (TSS) och färjeleder."
  },
  {
    title: "Områden & gränser",
    section: "Sjökortsbeteckningar – Områden & gränser",
    desc: "Förbudsområden, ankringsförbud, naturskydd och baslinjer."
  },
  {
    title: "Fritidsbåtsanordningar",
    section: "Sjökortsbeteckningar – Fritidsbåtsanordningar",
    desc: "Småbåtshamnar, gästhamnar, sopmajor och toaletter."
  },
  {
    title: "Fyrar & färgsektorer",
    section: "Sjökortsbeteckningar – Fyrar",
    desc: "Sektorbågar, ensfyrar, sektorfyrar, tillfälliga och släckta fyrar."
  },
  {
    title: "Sjömärken & prickar",
    section: "Sjökortsbeteckningar – Sjömärken",
    desc: "Styrbord, babord, punktmärken, mittled, specialmärken och fasta märken."
  },
  {
    title: "Kardinalmärken",
    section: "Sjökortsbeteckningar – Kardinalmärken",
    desc: "Väderstrecksmärken (Nord, Syd, Ost, Väst) med färger och topptecken."
  },
  {
    title: "Bottenbeskaffenhet",
    section: "Sjökortsbeteckningar – Bottenbeskaffenhet",
    desc: "Sand, lera, grus, sten, snäckskal och dess förkortningar."
  },
  {
    title: "Diverse förkortningar",
    section: "Sjökortsbeteckningar – Diverse förkortningar",
    desc: "Namnändelser på öar/fjärdar och allmänna förkortningar."
  },
  {
    title: "Fyrljusfärger",
    section: "Sjökortsbeteckningar – Fyrljusfärger",
    desc: "Färgkoder för fyrljus och sjömärken (W, R, G, Bu, B, Y, Or)."
  }
];

function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'chapters', 'quiz', 'completed'
  const [category, setCategory] = useState(null); // 'prov1', 'prov2', 'prov3', 'vajning', 'beteckningar', 'mixed'
  const [subCategoryTitle, setSubCategoryTitle] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState([]);
  const [shuffleMode, setShuffleMode] = useState(false);

  // Load questions for the selected category
  const startQuiz = (catId, subSection = null) => {
    setCategory(catId);
    let qList = [];

    if (catId === 'mixed') {
      // Merge all categories together
      Object.keys(questionsData).forEach(key => {
        qList = [...qList, ...questionsData[key]];
      });
      // Force shuffle for mixed mode
      qList = shuffleArray([...qList]);
      setSubCategoryTitle(null);
    } else {
      qList = [...questionsData[catId]];
      if (catId === 'beteckningar' && subSection) {
        qList = qList.filter(q => q.section === subSection);
        setSubCategoryTitle(subSection);
      } else {
        setSubCategoryTitle(null);
      }
      if (shuffleMode) {
        qList = shuffleArray(qList);
      }
    }

    setQuestions(qList);
    setCurrentIndex(0);
    setAnswers(new Array(qList.length).fill(''));
    setSubmitted(new Array(qList.length).fill(false));
    setView('quiz');
  };

  // Helper to get number of questions in a sub-section
  const getSectionCount = (sectionName) => {
    return questionsData.beteckningar.filter(q => q.section === sectionName).length;
  };

  // Helper to shuffle array
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Handle answer submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!(answers[currentIndex] || '').trim()) return;
    setSubmitted(prev => {
      const newSub = [...prev];
      newSub[currentIndex] = true;
      return newSub;
    });
  };

  // Move to next question
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setView('completed');
    }
  };

  // Move to previous question
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const getCategoryTitle = (catId) => {
    if (catId === 'beteckningar' && subCategoryTitle) {
      return subCategoryTitle;
    }
    switch(catId) {
      case 'prov1': return 'Övningsprov 1 – Förarintyg';
      case 'prov2': return 'Övningsprov 2 – Ruttplanering';
      case 'prov3': return 'Övningsprov 3 – Säkerhet & Lagar';
      case 'vajning': return 'Väjningsregler';
      case 'beteckningar': return 'Sjökortsbeteckningar';
      case 'skyltar': return 'Sjövägmärken (Wikipedia)';
      case 'ljudsignaler': return 'Manöver- & varningssignaler';
      case 'mixed': return 'Blandade Frågor (Kör direkt)';
      default: return '';
    }
  };

  const getImageLabel = (qId, index) => {
    if (qId.includes('vajning') || qId.includes('p2_q15')) {
      return `Situation ${index + 1}`;
    }
    return `Märke ${index + 1}`;
  };

  const activeQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  return (
    <div className="container">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo" style={{ cursor: 'pointer' }} onClick={() => setView('dashboard')}>
          <svg viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z" />
          </svg>
          <span className="app-title">Navigationsträning</span>
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>Båtförarintyget</div>
      </header>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* VIEW 1: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="animate-fade-in">
            <div className="banner glass-card">
              <div className="banner-glow"></div>
              <h1>Plugga till Förarintyget</h1>
              <p>Träna på sjökortssymboler, navigering, väjningsregler och sjösäkerhet. Testa dina kunskaper inför provet.</p>
              <button className="btn btn-accent btn-lg" onClick={() => startQuiz('mixed')}>
                Kör direkt (Blandade frågor)
              </button>
              
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="shuffle-toggle" 
                  checked={shuffleMode} 
                  onChange={(e) => setShuffleMode(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
                <label htmlFor="shuffle-toggle" style={{ cursor: 'pointer', fontSize: '0.95rem', color: 'hsl(var(--text-secondary))' }}>
                  Slumpa ordningen på frågorna i proven
                </label>
              </div>
            </div>

            <h2 className="category-title">Välj övningskategori</h2>
            <div className="category-grid">
              
              {/* Category 1 */}
              <div className="glass-card category-card" onClick={() => startQuiz('prov1')}>
                <h3>Övningsprov 1</h3>
                <p>Grundläggande teori om sjökort, symboler, navigering, säkerhet och lagar. Perfekt att börja med.</p>
                <div className="category-card-meta">
                  <span>{questionsData.prov1.length} Frågor</span>
                  <span className="category-card-tag">Teori & Tecken</span>
                </div>
              </div>

              {/* Category 2 */}
              <div className="glass-card category-card" onClick={() => startQuiz('prov2')}>
                <h3>Övningsprov 2</h3>
                <p>Ruttplanering i Stockholms skärgård från Dalarö till Utö. Praktisk navigering, ljussignaler och tampar.</p>
                <div className="category-card-meta">
                  <span>{questionsData.prov2.length} Frågor</span>
                  <span className="category-card-tag">Rutt & Navigering</span>
                </div>
              </div>

              {/* Category 3 */}
              <div className="glass-card category-card" onClick={() => startQuiz('prov3')}>
                <h3>Övningsprov 3</h3>
                <p>Djupgående prov om sjösäkerhet, första hjälpen, kompassdeviation, lagar och bestämmelser till sjöss.</p>
                <div className="category-card-meta">
                  <span>{questionsData.prov3.length} Frågor</span>
                  <span className="category-card-tag">Säkerhet & Lagar</span>
                </div>
              </div>

              {/* Category 4 */}
              <div className="glass-card category-card" onClick={() => startQuiz('vajning')}>
                <h3>Väjningsregler</h3>
                <p>Vem väjer och varför? Träna på mötande motorbåtar, segelbåtar för olika vindhalsar samt trånga farleder.</p>
                <div className="category-card-meta">
                  <span>{questionsData.vajning.length} Frågor</span>
                  <span className="category-card-tag">Sjötrafikregler</span>
                </div>
              </div>

              {/* Category 5 */}
              <div className="glass-card category-card" onClick={() => setView('chapters')}>
                <h3>Sjökortsbeteckningar</h3>
                <p>Flashcards för symboler och förkortningar i sjökortet. Lär dig känna igen prickar, fyrar, kablar och bottenförhållanden.</p>
                <div className="category-card-meta">
                  <span>{questionsData.beteckningar.length} Symboler</span>
                  <span className="category-card-tag">Sjökort</span>
                </div>
              </div>

              {/* Category 6 */}
              <div className="glass-card category-card" onClick={() => startQuiz('skyltar')}>
                <h3>Sjövägmärken</h3>
                <p>Träna på sjövägmärken från Wikipedia. Innehåller varningsmärken, påbudsmärken, förbudsmärken och upplysningsmärken.</p>
                <div className="category-card-meta">
                  <span>{questionsData.skyltar.length} Skyltar</span>
                  <span className="category-card-tag">Skyltar</span>
                </div>
              </div>

              {/* Category 7 */}
              <div className="glass-card category-card" onClick={() => startQuiz('ljudsignaler')}>
                <h3>Manöver & varningssignaler</h3>
                <p>Öva på ljudsignaler vid god sikt och nedsatt sikt (dimma). Lär dig girsignaler, varningssignaler samt mistsignaler.</p>
                <div className="category-card-meta">
                  <span>{questionsData.ljudsignaler.length} Frågor</span>
                  <span className="category-card-tag">Ljudsignaler</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: CHAPTERS */}
        {view === 'chapters' && (
          <div className="animate-fade-in">
            <div className="glass-card banner" style={{ padding: '40px 24px', marginBottom: '32px' }}>
              <div className="banner-glow"></div>
              <h1>Välj kapitel – Sjökortsbeteckningar</h1>
              <p>Träna på specifika delar av sjökortets symboler och förkortningar, eller kör alla {questionsData.beteckningar.length} frågor på en gång.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <button className="btn btn-accent" onClick={() => startQuiz('beteckningar')}>
                  Kör alla symboler ({questionsData.beteckningar.length} st)
                </button>
                <button className="btn btn-secondary" onClick={() => setView('dashboard')}>
                  &larr; Tillbaka till huvudmenyn
                </button>
              </div>
            </div>

            <h2 className="category-title" style={{ marginBottom: '24px' }}>Träna per kapitel</h2>
            <div className="category-grid">
              {chapters.map((ch, idx) => {
                const count = getSectionCount(ch.section);
                return (
                  <div key={idx} className="glass-card category-card" onClick={() => startQuiz('beteckningar', ch.section)}>
                    <h3>{ch.title}</h3>
                    <p>{ch.desc}</p>
                    <div className="category-card-meta">
                      <span>{count} {count === 1 ? 'fråga' : 'frågor'}</span>
                      <span className="category-card-tag" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'hsl(var(--color-primary))' }}>
                        Öva &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: QUIZ */}
        {view === 'quiz' && activeQuestion && (
          <div className="animate-fade-in quiz-layout">
            
            {/* Progress Container */}
            <div className="progress-container">
              <div className="progress-header">
                <span style={{ fontWeight: 600, color: 'hsl(var(--color-accent))' }}>
                  {getCategoryTitle(category)}
                </span>
                <span style={{ color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                  Fråga {currentIndex + 1} av {questions.length}
                </span>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setView(category === 'beteckningar' ? 'chapters' : 'dashboard')}
                >
                  Avbryt & meny
                </button>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="glass-card">
              
              {activeQuestion.section && (
                <div className="question-section-header">
                  {activeQuestion.section}
                </div>
              )}

              <div className="question-text">
                {activeQuestion.question}
              </div>

              {/* Question Images */}
              {activeQuestion.images && activeQuestion.images.length > 0 && (
                <div className="quiz-images-container">
                  <div className={`images-grid ${
                    activeQuestion.images.length === 1 ? 'single' : 
                    activeQuestion.images.length === 2 ? 'double' : 'multi'
                  }`}>
                    {activeQuestion.images.map((imgName, index) => (
                      <div key={index} className="quiz-image-wrapper">
                        <img 
                          src={`/images/${imgName}`} 
                          className="quiz-image" 
                          alt={`Övningsbild ${index + 1}`} 
                        />
                        {activeQuestion.images.length > 1 && (
                          <span className="quiz-image-label">
                            {getImageLabel(activeQuestion.id, index)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Input Form */}
              <form onSubmit={handleSubmit} className="answer-form">
                <div className="input-group">
                  <label htmlFor="user-answer" className="input-label">
                    Skriv ditt svar nedan:
                  </label>
                  <textarea
                    id="user-answer"
                    className="textarea-answer"
                    placeholder="Skriv hur du resonerar eller vad svaret är..."
                    value={answers[currentIndex] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAnswers(prev => {
                        const newAns = [...prev];
                        newAns[currentIndex] = val;
                        return newAns;
                      });
                    }}
                    disabled={submitted[currentIndex]}
                  />
                </div>

                <div className="quiz-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                  >
                    &larr; Föregående
                  </button>
                  
                  {!submitted[currentIndex] ? (
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={!(answers[currentIndex] || '').trim()}
                    >
                      Svara
                    </button>
                  ) : (
                    <span className="badge badge-success">Besvarad</span>
                  )}
                  
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleNext}
                  >
                    {currentIndex < questions.length - 1 ? 'Nästa \u2192' : 'Avsluta \u2192'}
                  </button>
                </div>
              </form>

              {/* Facit / Answer Reveal */}
              {submitted[currentIndex] && (
                <div className="reveal-container">
                  <div className="reveal-header">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>Rätt Svar (Facit)</span>
                  </div>
                  <div className="reveal-content">
                    <div style={{ marginBottom: activeQuestion.answer_images && activeQuestion.answer_images.length > 0 ? '20px' : '0' }}>
                      {activeQuestion.answer}
                    </div>
                    {activeQuestion.answer_images && activeQuestion.answer_images.length > 0 && (
                      <div className="quiz-images-container" style={{ background: 'rgba(0,0,0,0.15)', margin: '10px 0 0 0' }}>
                        <div className={`images-grid ${activeQuestion.answer_images.length === 1 ? 'single' : 'double'}`}>
                          {activeQuestion.answer_images.map((imgName, index) => (
                            <div key={index} className="quiz-image-wrapper" style={{ background: 'rgba(0,0,0,0.1)' }}>
                              <img 
                                src={`/images/${imgName}`} 
                                className="quiz-image" 
                                alt={`Facitbild ${index + 1}`} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW 3: COMPLETED */}
        {view === 'completed' && (
          <div className="animate-fade-in glass-card completion-container">
            <div className="completion-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h2>Övningsomgången klar!</h2>
            <p>Du har gått igenom alla frågor i den här kategorin. Repetera gärna igen för att sätta kunskaperna inför provet!</p>
            <button 
              className="btn btn-primary btn-lg" 
              onClick={() => setView(category === 'beteckningar' ? 'chapters' : 'dashboard')}
            >
              Tillbaka till menyn
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 Navigationsträning. Framtagen för båtförarintyget.</p>
      </footer>
    </div>
  );
}

export default App;
