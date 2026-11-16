export function SourcingSection() {
  const pillars = [
    {
      index: '01',
      title: 'Collecte directe auprès des coopératives',
      body: 'Chaque matière première est sourcée à la récolte auprès de groupements agricoles et unités de transformation du Bénin, limitant les intermédiaires pour préserver des prix justes.',
    },
    {
      index: '02',
      title: 'Fiches techniques & calibrage contrôlé',
      body: 'Taux d’humidité, calibre W240, pureté du karité et propreté des graines de soja sont vérifiés sur échantillon avant toute mise en sac ou expédition.',
    },
    {
      index: '03',
      title: 'Négoce souple du détail à la tonne',
      body: 'Commandez un format ménage ou réservez vos lots professionnels directement sur WhatsApp, avec export de suivi prêt pour votre comptabilité.',
    },
  ];

  return (
    <section
      id="espace-agro"
      className="border-t border-[#E5E3DD] bg-white py-14 sm:py-16"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-[#0F6E4A] mb-2">
            Place de marché agropastorale
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold text-[#161615] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Des matières premières tropicales fiables pour les ménages et
            l’industrie
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.index} className="pt-5 border-t border-[#E5E3DD]">
              <span className="font-mono text-xs font-semibold text-[#0F6E4A] block mb-2">
                {pillar.index}.
              </span>
              <h3 className="text-base font-semibold text-[#161615] mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-[#575652] leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
