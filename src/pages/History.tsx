export default function History() {
  const periods = [
    { title: "Ancient Period (Pre-1204)", content: "Ruled by Maurya, Gupta, Pala, and Sena dynasties. Rich in Buddhist and Hindu culture." },
    { title: "Islamic Rule (1204 - 1757)", content: "Starting with Bakhtiyar Khalji. The Bengal Sultanate emerged as a major trading nation." },
    { title: "British Era (1757 - 1947)", content: "Battle of Plassey marked the beginning of British rule. Bengal experienced economic changes and a renaissance." },
    { title: "Pakistan Period (1947 - 1971)", content: "East Bengal became East Pakistan. The Language Movement of 1952 sowed the seeds of nationalism." },
    { title: "Liberation War (1971)", content: "Under the leadership of Bangabandhu Sheikh Mujibur Rahman, Bangladesh achieved independence after a bloody 9-month war." },
    { title: "Modern Bangladesh (1971 - Present)", content: "A journey of rebuilding, economic growth, and development. Today, Bangladesh is a rapidly growing economy." }
  ];
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold mb-12 text-center text-brand-green">History of Bangladesh</h1>
      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-brand-green/20">
        {periods.map((period, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-brand-green text-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">{i + 1}</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-brand-green/30 transition-colors">
              <h3 className="font-bold text-xl mb-2 text-white">{period.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{period.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}