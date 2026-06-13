exports.getUniversities = async (req, res) => {
  try {
    const list = [
      { id: "estin_bejaia", name: "École Supérieure en Sciences et Technologies de l'Informatique et du Numérique (ESTIN)" },
      { id: "esi_alger", name: "École nationale Supérieure d'Informatique (ESI ex-INI)" },
      { id: "usthb", name: "Université des Sciences et de la Technologie Houari Boumediene (USTHB)" },
      { id: "oxford", name: "University of Oxford" },
      { id: "stanford", name: "Stanford University" },
      { id: "mit", name: "Massachusetts Institute of Technology" },
      { id: "cambridge", name: "University of Cambridge" },
      { id: "eth_zurich", name: "ETH Zurich" },
      { id: "harvard", name: "Harvard University" },
      { id: "caltech", name: "California Institute of Technology" },
      { id: "berkeley", name: "University of California, Berkeley" },
      { id: "ucl", name: "University College London" },
      { id: "imperial", name: "Imperial College London" },
      { id: "nus", name: "National University of Singapore" },
      { id: "tsinghua", name: "Tsinghua University" },
      { id: "sorbonne", name: "Sorbonne University" },
      { id: "other", name: "Other / Not Listed" }
    ];
    res.json(list);
  } catch (error) {
    console.error('Fetch universities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
