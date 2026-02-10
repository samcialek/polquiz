/**
 * PRISM Political Archetypes v157
 *
 * Updated: 2026-01-28
 * Total: 132 archetypes
 *
 * v157 Changes:
 * - Split Mainstream Democrat (001) into Hopeful Democrat + Vigilant Democrat (N13)
 * - Split Mainstream Republican (002) into Sunrise Conservative + Fortress Conservative (N14)
 * - Split Kitchen Table Democrat (007) into Prosperity Democrat + Fighting-Class Democrat (N15)
 * - Split Faith Community Pillar (020) into Parish Traditionalist + Social Gospel Voter (N16)
 */

const ARCHETYPES = [
  {
    "id": "001",
    "name": "Hopeful Democrat",
    "tier": "T1",
    "frequency": 2.3,
    "description": "Believes in gradual progress and institutional reform; sees America as imperfect but improving. Votes Democratic with confidence rather than fear.",
    "examples": "Joe Biden, Tim Walz, Obama coalition optimists",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          48
        ],
        "sal": [
          75,
          100
        ]
      },
      "CD": {
        "pos": [
          0,
          48
        ],
        "sal": [
          50,
          74
        ]
      },
      "MOR": {
        "pos": [
          30,
          70
        ],
        "sal": [
          50,
          74
        ]
      },
      "H": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "TRB": {
        "pos": [
          30,
          70
        ],
        "sal": [
          75,
          100
        ]
      },
      "PF": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          74
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "ONT_H": [
        0,
        45
      ]
    }
  },
  {
    "id": "002",
    "name": "Sunrise Conservative",
    "tier": "T1",
    "frequency": 1.8,
    "description": "Morning-in-America optimism; believes in American dynamism and that conservative policies will restore prosperity. Forward-looking rather than defensive.",
    "examples": "Reagan heirs, Chamber of Commerce optimists, Nikki Haley",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          58,
          100
        ],
        "sal": [
          75,
          100
        ]
      },
      "MOR": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "H": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "TRB": {
        "pos": [
          34,
          66
        ],
        "sal": [
          75,
          100
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "PF": [
        0,
        30
      ],
      "ONT_H": [
        10,
        45
      ],
      "ZS": [
        65,
        100
      ]
    }
  },
  {
    "id": "003",
    "name": "Heritage Conservative",
    "tier": "T1",
    "frequency": 3.2,
    "description": "Defends traditional culture and hierarchy against perceived threats; cultural identity is central to politics.",
    "examples": "Pat Buchanan, Laura Ingraham",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          67,
          100
        ],
        "sal": [
          70,
          100
        ]
      },
      "MOR": {
        "pos": [
          34,
          66
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          60,
          95
        ],
        "sal": [
          55,
          90
        ]
      },
      "H": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          40,
          75
        ],
        "sal": [
          55,
          90
        ]
      }
    },
    "antiTraits": {
      "MAT": [
        0,
        40
      ],
      "CU": [
        60,
        100
      ]
    }
  },
  {
    "id": "004",
    "name": "Heritage Fortress Conservative",
    "tier": "T1",
    "frequency": 2,
    "description": "Maximum cultural defense posture; pessimistic about reversing decline but committed to holding the line.",
    "examples": "Tucker Carlson (2020s)",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          60,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "CU": {
        "pos": [
          60,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          60,
          100
        ],
        "sal": [
          50,
          80
        ]
      },
      "ZS": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          80
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          60,
          100
        ],
        "sal": [
          55,
          85
        ]
      }
    }
  },
  {
    "id": "005",
    "name": "Quiet Middle",
    "tier": "T1",
    "frequency": 3.5,
    "description": "Holds no strong political views; content with status quo and avoids political engagement. Politics is irrelevant distraction. 'I just want to grill.'",
    "examples": "Michael Jordan (1990s), Derek Jeter, Tim Duncan",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          65,
          100
        ]
      },
      "ENG": {
        "pos": [
          0,
          48
        ],
        "sal": [
          65,
          100
        ]
      },
      "TRB": {
        "pos": [
          30,
          60
        ],
        "sal": [
          35,
          70
        ]
      },
      "COM": {
        "pos": [
          35,
          70
        ],
        "sal": [
          35,
          70
        ]
      },
      "MOR": {
        "pos": [
          35,
          70
        ],
        "sal": [
          30,
          65
        ]
      }
    },
    "antiTraits": {
      "ENG": [
        70,
        100
      ],
      "ZS": [
        70,
        100
      ],
      "CD": [
        65,
        100
      ],
      "H": [
        65,
        100
      ]
    }
  },
  {
    "id": "006",
    "name": "Rising Tide Progressive",
    "tier": "T1",
    "frequency": 2.1,
    "description": "Believes progress lifts everyone; combines social liberalism with genuine optimism about human potential and positive-sum politics.",
    "examples": "Pete Buttigieg, Gavin Newsom",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "ZS": {
        "pos": [
          0,
          40
        ],
        "sal": [
          60,
          90
        ]
      },
      "ONT_H": {
        "pos": [
          45,
          100
        ],
        "sal": [
          50,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          55,
          95
        ],
        "sal": [
          50,
          85
        ]
      }
    },
    "antiTraits": {
      "COM": [
        60,
        100
      ],
      "CU": [
        55,
        100
      ],
      "ZS": [
        55,
        100
      ],
      "AES": [
        60,
        100
      ]
    }
  },
  {
    "id": "007",
    "name": "Prosperity Democrat",
    "tier": "T1",
    "frequency": 1.8,
    "description": "Focuses on bread-and-butter issues but believes smart economic policy can grow the pie for everyone. Solutions-oriented, less combative than populist wing.",
    "examples": "Jason Furman types, pragmatic union leaders, suburban economic Democrats",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          50,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          30,
          70
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          45,
          90
        ],
        "sal": [
          50,
          80
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "TRB": [
        60,
        100
      ],
      "H": [
        60,
        100
      ],
      "ZS": [
        60,
        100
      ]
    }
  },
  {
    "id": "008",
    "name": "Institutional Progressive",
    "tier": "T1",
    "frequency": 2.2,
    "description": "Works through established institutions to achieve progressive goals; believes in reform within the system.",
    "examples": "Hillary Clinton, Nancy Pelosi, Chuck Schumer",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          60,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          40,
          75
        ],
        "sal": [
          55,
          85
        ]
      },
      "EPS": {
        "pos": [
          30,
          65
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "H": [
        60,
        100
      ],
      "ZS": [
        60,
        100
      ]
    }
  },
  {
    "id": "009",
    "name": "Global Citizen Liberal",
    "tier": "T1",
    "frequency": 2.6,
    "description": "Sees humanity as interconnected; prioritizes international cooperation and universal human rights over national boundaries.",
    "examples": "Samantha Power, Angelina Jolie, George Clooney",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "CU": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          90
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "010",
    "name": "Full Spectrum Conservative",
    "tier": "T1",
    "frequency": 1.8,
    "description": "Combines free-market economics with traditional values and strong national identity; Reaganite fusion conservative.",
    "examples": "Ted Cruz, Ron DeSantis, Marco Rubio",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "CD": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          90
        ]
      },
      "ENG": {
        "pos": [
          45,
          90
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "PF": [
        0,
        45
      ],
      "MAT": [
        0,
        50
      ],
      "MOR": [
        0,
        55
      ]
    }
  },
  {
    "id": "011",
    "name": "Class Conflict Progressive",
    "tier": "T1",
    "frequency": 1.8,
    "description": "Views politics through lens of class struggle; corporations and billionaires are the enemy. Economic redistribution is the terminal goal.",
    "examples": "Bernie Sanders, Robert Reich",
    "ontLevel": "Var",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          55,
          100
        ],
        "sal": [
          65,
          95
        ]
      },
      "TRB": {
        "pos": [
          30,
          70
        ],
        "sal": [
          50,
          80
        ]
      },
      "H": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "PRO": {
        "pos": [
          40,
          70
        ],
        "sal": [
          45,
          75
        ]
      },
      "MOR": {
        "pos": [
          35,
          65
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "H": [
        60,
        100
      ],
      "ZS": [
        0,
        50
      ],
      "CD": [
        0,
        25
      ],
      "ONT_S": [
        60,
        100
      ],
      "CU": [
        50,
        100
      ],
      "MOR": [
        0,
        30
      ]
    }
  },
  {
    "id": "012",
    "name": "Markets-First Conservative",
    "tier": "T1",
    "frequency": 2,
    "description": "Economic freedom is the primary value; government intervention in markets is the main concern. Culture is secondary.",
    "examples": "Steve Forbes, Larry Kudlow, Art Laffer",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          60,
          100
        ],
        "sal": [
          70,
          100
        ]
      },
      "MOR": {
        "pos": [
          30,
          75
        ],
        "sal": [
          50,
          80
        ]
      },
      "H": {
        "pos": [
          30,
          75
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          30,
          75
        ],
        "sal": [
          45,
          75
        ]
      },
      "CD": {
        "pos": [
          40,
          70
        ],
        "sal": [
          30,
          60
        ]
      }
    },
    "antiTraits": {
      "CD": [
        75,
        100
      ],
      "TRB": [
        76,
        100
      ],
      "H": [
        0,
        25
      ]
    }
  },
  {
    "id": "013",
    "name": "Statistical Middle",
    "tier": "T1",
    "frequency": 1.6,
    "description": "Represents the mathematical center of American opinion; no strong ideological commitments on any dimension.",
    "examples": "Colin Powell (1990s)",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MOR": {
        "pos": [
          47,
          53
        ],
        "sal": [
          30,
          70
        ]
      },
      "H": {
        "pos": [
          47,
          53
        ],
        "sal": [
          30,
          70
        ]
      },
      "MAT": {
        "pos": [
          47,
          53
        ],
        "sal": [
          30,
          70
        ]
      },
      "PRO": {
        "pos": [
          47,
          53
        ],
        "sal": [
          30,
          70
        ]
      },
      "CD": {
        "pos": [
          45,
          55
        ],
        "sal": [
          30,
          70
        ]
      },
      "ENG": {
        "pos": [
          40,
          60
        ],
        "sal": [
          30,
          70
        ]
      }
    },
    "antiTraits": {
      "ZS": [
        60,
        100
      ],
      "ONT_H": [
        80,
        100
      ],
      "ONT_H_low": [
        0,
        30
      ],
      "ONT_S": [
        70,
        100
      ]
    }
  },
  {
    "id": "014",
    "name": "Faith and Family Traditionalist",
    "tier": "T1",
    "frequency": 2,
    "description": "Religious faith and scripture are the foundation of political knowledge; family and church structure are paramount.",
    "examples": "Mike Pence, Mike Huckabee",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          60,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "CU": {
        "pos": [
          60,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          45,
          85
        ],
        "sal": [
          50,
          80
        ]
      },
      "PF": {
        "pos": [
          50,
          95
        ],
        "sal": [
          45,
          75
        ]
      },
      "EPS": {
        "pos": [
          60,
          100
        ],
        "sal": [
          60,
          90
        ]
      }
    },
    "antiTraits": {
      "AES": [
        60,
        100
      ],
      "PF": [
        0,
        40
      ],
      "EPS": [
        0,
        50
      ],
      "ENG": [
        65,
        100
      ]
    }
  },
  {
    "id": "016",
    "name": "Evidence-Based Progressive",
    "tier": "T1",
    "frequency": 1.5,
    "description": "\"Follow the data\" as methodology for achieving progressive ends. Epistemology is instrumental but load-bearing.",
    "examples": "Nate Silver, some policy wonks",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "CD": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "EPS": {
        "pos": [
          0,
          50
        ],
        "sal": [
          60,
          90
        ]
      },
      "PRO": {
        "pos": [
          30,
          75
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "EPS": [
        55,
        100
      ],
      "AES": [
        55,
        100
      ],
      "ZS": [
        60,
        100
      ],
      "TRB": [
        60,
        100
      ]
    }
  },
  {
    "id": "017",
    "name": "Evidence-Based Free Marketer",
    "tier": "T1",
    "frequency": 1.5,
    "description": "Supports markets based on empirical evidence of efficiency; economics-first worldview grounded in data.",
    "examples": "Larry Summers, Greg Mankiw, Tyler Cowen",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          60,
          95
        ],
        "sal": [
          60,
          95
        ]
      },
      "EPS": {
        "pos": [
          0,
          55
        ],
        "sal": [
          60,
          95
        ]
      },
      "PRO": {
        "pos": [
          40,
          75
        ],
        "sal": [
          50,
          85
        ]
      },
      "CD": {
        "pos": [
          30,
          65
        ],
        "sal": [
          45,
          75
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "018",
    "name": "Movement Conservative",
    "tier": "T1",
    "frequency": 1.8,
    "description": "Committed ideological conservative active in the movement; fuses economics, culture, and nationalism with combative style.",
    "examples": "Mark Levin, Tucker Carlson (2000–2015)",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          50,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "CD": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          60,
          100
        ],
        "sal": [
          65,
          95
        ]
      },
      "ENG": {
        "pos": [
          60,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "ZS": {
        "pos": [
          50,
          90
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "PF": [
        0,
        40
      ],
      "ENG": [
        0,
        40
      ],
      "COM": [
        70,
        100
      ]
    }
  },
  {
    "id": "019",
    "name": "Expanding Pie Moderate",
    "tier": "T1",
    "frequency": 1.5,
    "description": "Believes growth can benefit everyone; seeks win-win solutions across partisan lines. Positive-sum worldview is central.",
    "examples": "Ro Khanna, Jared Polis",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          60,
          90
        ]
      },
      "ONT_H": {
        "pos": [
          50,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          50,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "PF": [
        65,
        100
      ],
      "ENG": [
        75,
        100
      ],
      "ZS": [
        55,
        100
      ],
      "ONT_H": [
        0,
        45
      ],
      "ONT_S": [
        0,
        45
      ]
    }
  },
  {
    "id": "020",
    "name": "Parish Traditionalist",
    "tier": "T1",
    "frequency": 1.5,
    "description": "Faith rooted in local community and inherited tradition; the church as anchor against a changing world. Heritage-preserving, locally focused religious voter.",
    "examples": "Traditional parish leaders, Southern Baptist community, Orthodox congregations",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          60,
          95
        ],
        "sal": [
          55,
          90
        ]
      },
      "CU": {
        "pos": [
          55,
          90
        ],
        "sal": [
          50,
          85
        ]
      },
      "MOR": {
        "pos": [
          40,
          75
        ],
        "sal": [
          55,
          90
        ]
      },
      "AES": {
        "pos": [
          25,
          90
        ],
        "sal": [
          55,
          90
        ]
      },
      "H": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          85
        ]
      },
      "ENG": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          85
        ]
      },
      "COM": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "ZS": [
        65,
        100
      ],
      "PF": [
        85,
        100
      ],
      "EPS": [
        80,
        100
      ],
      "COM": [
        70,
        100
      ]
    }
  },
  {
    "id": "021",
    "name": "Cultural Regionalist",
    "tier": "T2",
    "frequency": 1.5,
    "description": "Regional/cultural identity drives politics; \"common sense\" epistemology; suspicious of outsiders and elites.",
    "examples": "Rural identity voters; \"real America\" types",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "CU": {
        "pos": [
          35,
          80
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          50,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          45,
          85
        ],
        "sal": [
          50,
          80
        ]
      },
      "CD": {
        "pos": [
          45,
          85
        ],
        "sal": [
          45,
          75
        ]
      },
      "NAT": {
        "pos": [
          40,
          80
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "PF": [
        0,
        45
      ],
      "CU": [
        0,
        34
      ]
    }
  },
  {
    "id": "022",
    "name": "Identity-Rooted Progressive",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Lived experience and testimony are epistemically central; ethno-racial identity drives political positions.",
    "examples": "Ta-Nehisi Coates (method)",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          0,
          50
        ],
        "sal": [
          60,
          95
        ]
      },
      "CU": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "TRB": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          0,
          58
        ],
        "sal": [
          50,
          85
        ]
      },
      "MAT": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "023",
    "name": "Rationalist Libertarian",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Derives political positions from first principles and logical deduction; believes in human reason and markets.",
    "examples": "Bryan Caplan, Yaron Brook",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          65,
          100
        ],
        "sal": [
          65,
          100
        ]
      },
      "EPS": {
        "pos": [
          30,
          65
        ],
        "sal": [
          60,
          95
        ]
      },
      "ZS": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "H": {
        "pos": [
          30,
          65
        ],
        "sal": [
          50,
          85
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          90
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "024",
    "name": "Movement Progressive",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Politics is about vision and hope; the aesthetic of uplift and inspiration IS the politics.",
    "examples": "Obama (2008 campaign)",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          45
        ],
        "sal": [
          60,
          95
        ]
      },
      "CD": {
        "pos": [
          0,
          45
        ],
        "sal": [
          60,
          95
        ]
      },
      "MOR": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          90
        ]
      },
      "ZS": {
        "pos": [
          40,
          90
        ],
        "sal": [
          55,
          90
        ]
      },
      "ENG": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          95
        ]
      }
    },
    "antiTraits": {
      "ONT_H": [
        60,
        100
      ],
      "ONT_S": [
        65,
        100
      ]
    }
  },
  {
    "id": "025",
    "name": "Prophetic Progressive",
    "tier": "T2",
    "frequency": 2,
    "description": "Moral witness IS the politics; speaking truth to power regardless of effectiveness.",
    "examples": "William Barber, Cornel West (style)",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          0,
          55
        ],
        "sal": [
          65,
          100
        ]
      },
      "AES": {
        "pos": [
          30,
          95
        ],
        "sal": [
          60,
          95
        ]
      },
      "ZS": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          85
        ]
      },
      "ENG": {
        "pos": [
          48,
          100
        ],
        "sal": [
          55,
          90
        ]
      }
    }
  },
  {
    "id": "026",
    "name": "Competitive Conservative",
    "tier": "T2",
    "frequency": 1.5,
    "description": "Politics is competition; pro-market but sees economy as zero-sum race.",
    "examples": "James Carville, Rahm Emanuel",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "ZS": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "H": {
        "pos": [
          50,
          90
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "ZS": [
        0,
        50
      ],
      "COM": [
        60,
        100
      ]
    }
  },
  {
    "id": "027",
    "name": "Idealist Progressive",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Believes in human perfectibility through reason; transformative potential of collective action.",
    "examples": "Peter Singer, Rutger Bregman",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          0,
          58
        ],
        "sal": [
          60,
          95
        ]
      },
      "ZS": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "ZS": [
        55,
        100
      ],
      "TRB": [
        50,
        100
      ]
    }
  },
  {
    "id": "028",
    "name": "Entrepreneurial Conservative",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Pro-business moderate who believes entrepreneurship solves social problems; not strongly partisan.",
    "examples": "Michael Bloomberg, Mark Cuban, Howard Schultz",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      },
      "H": {
        "pos": [
          30,
          70
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          50,
          90
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "PF": [
        55,
        100
      ],
      "ZS": [
        60,
        100
      ]
    }
  },
  {
    "id": "029",
    "name": "Quiet Conservative",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Holds conservative views but avoids political engagement; votes but doesn't advocate.",
    "examples": "Clint Eastwood (pre-2012)",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "CD": {
        "pos": [
          60,
          100
        ],
        "sal": [
          50,
          74
        ]
      },
      "MOR": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "ENG": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "ENG": [
        65,
        100
      ],
      "PF": [
        70,
        100
      ],
      "H": [
        0,
        30
      ]
    }
  },
  {
    "id": "030",
    "name": "Globally Minded Social Democrat",
    "tier": "T2",
    "frequency": 2.1,
    "description": "Combines progressive economics with cosmopolitan internationalism; believes in global cooperation.",
    "examples": "Barack Obama, Justin Trudeau",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "031",
    "name": "Siege Mentality Partisan",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Sees politics as existential warfare between in-group and threatening out-groups.",
    "examples": "Marjorie Taylor Greene, Steve Bannon, Matt Gaetz",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "MOR": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "COM": {
        "pos": [
          60,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          60,
          100
        ],
        "sal": [
          65,
          95
        ]
      },
      "PF": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_H": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          60,
          100
        ],
        "sal": [
          60,
          90
        ]
      }
    },
    "antiTraits": {
      "ONT_H": [
        70,
        100
      ],
      "ONT_S": [
        70,
        100
      ],
      "PRO": [
        55,
        100
      ]
    }
  },
  {
    "id": "032",
    "name": "Neighborhood Democrat",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Progressive on economics, rooted in local community and often faith tradition.",
    "examples": "Jimmy Carter, Tulsi Gabbard (2012–2019)",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "CD": {
        "pos": [
          55,
          100
        ],
        "sal": [
          45,
          75
        ]
      },
      "MOR": {
        "pos": [
          30,
          70
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      },
      "COM": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "TRB": [
        0,
        29
      ],
      "H": [
        55,
        100
      ],
      "MOR": [
        71,
        100
      ]
    }
  },
  {
    "id": "033",
    "name": "Team Player Capitalist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Strongly pro-business but primarily motivated by partisan team loyalty.",
    "examples": "Sheldon Adelson †, Harold Hamm",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      },
      "PF": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "TRB": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "PF": [
        0,
        45
      ],
      "TRB": [
        0,
        45
      ]
    }
  },
  {
    "id": "034",
    "name": "Rising Tide Social Democrat",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Believes redistribution can happen through growth, not conflict; abundance mentality.",
    "examples": "Jason Furman, Brad DeLong",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          40
        ],
        "sal": [
          75,
          100
        ]
      },
      "MOR": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "PRO": {
        "pos": [
          50,
          80
        ],
        "sal": [
          55,
          85
        ]
      },
      "EPS": {
        "pos": [
          20,
          55
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "ZS": [
        50,
        100
      ],
      "ONT_S": [
        0,
        50
      ],
      "AES": [
        75,
        100
      ]
    }
  },
  {
    "id": "035",
    "name": "Free-Thinking Moderate",
    "tier": "T2",
    "frequency": 2.6,
    "description": "Takes positions from both parties; resists ideological conformity and tribal pressure. Actually has no partisan lean; evaluates each election independently.",
    "examples": "Bill Maher, Joe Rogan (2015–2020), Angus King",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "PF": {
        "pos": [
          0,
          30
        ],
        "sal": [
          60,
          90
        ]
      },
      "TRB": {
        "pos": [
          0,
          30
        ],
        "sal": [
          60,
          90
        ]
      },
      "ENG": {
        "pos": [
          45,
          75
        ],
        "sal": [
          55,
          85
        ]
      },
      "EPS": {
        "pos": [
          25,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "MAT": {
        "pos": [
          35,
          65
        ],
        "sal": [
          40,
          70
        ]
      },
      "CD": {
        "pos": [
          35,
          65
        ],
        "sal": [
          40,
          70
        ]
      }
    },
    "antiTraits": {
      "COM": [
        80,
        100
      ],
      "ENG": [
        0,
        35
      ],
      "TRB": [
        60,
        100
      ]
    }
  },
  {
    "id": "036",
    "name": "Optimistic Progressive",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Culturally liberal with genuine optimism about human nature and social progress.",
    "examples": "Cory Booker, Oprah Winfrey",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "ZS": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          0,
          58
        ],
        "sal": [
          55,
          90
        ]
      },
      "ENG": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          85
        ]
      }
    }
  },
  {
    "id": "037",
    "name": "Deliberative Centrist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "The quality of democratic conversation IS the value; civility matters intrinsically.",
    "examples": "Arthur Brooks",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "AES": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      },
      "PF": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          85
        ]
      },
      "COM": {
        "pos": [
          55,
          95
        ],
        "sal": [
          60,
          90
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "COM": [
        0,
        45
      ],
      "AES": [
        70,
        100
      ],
      "TRB": [
        55,
        100
      ],
      "CD": [
        60,
        100
      ]
    }
  },
  {
    "id": "038",
    "name": "Cosmopolitan Centrist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Globally-oriented moderate who values international institutions and cultural openness. Non-partisan with universalist values; heterodox on most issues.",
    "examples": "Fareed Zakaria, Thomas Friedman, Steven Pinker",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MOR": {
        "pos": [
          0,
          58
        ],
        "sal": [
          55,
          85
        ]
      },
      "CU": {
        "pos": [
          0,
          35
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "ZS": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          75
        ]
      },
      "H": {
        "pos": [
          30,
          70
        ],
        "sal": [
          40,
          70
        ]
      }
    }
  },
  {
    "id": "039",
    "name": "Rooted Centrist",
    "tier": "T2",
    "frequency": 1.2,
    "description": "Strong attachment to local community and civic institutions but centrist on economics/culture.",
    "examples": "Robert Putnam",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          35,
          65
        ],
        "sal": [
          50,
          80
        ]
      },
      "CD": {
        "pos": [
          35,
          65
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          45,
          75
        ],
        "sal": [
          55,
          90
        ]
      },
      "ENG": {
        "pos": [
          40,
          75
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "040",
    "name": "Win-Win Centrist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Believes most political problems have solutions that benefit everyone; actively seeks compromise.",
    "examples": "Larry Hogan, Charlie Baker, Jon Huntsman",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "ZS": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "041",
    "name": "All-In Traditionalist",
    "tier": "T2",
    "frequency": 2,
    "description": "Maximum commitment to traditional values, hierarchy, and in-group boundaries; no compromise.",
    "examples": "Mike Johnson, Josh Hawley",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          62,
          100
        ],
        "sal": [
          65,
          100
        ]
      },
      "CU": {
        "pos": [
          65,
          100
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          90
        ]
      },
      "H": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          85
        ]
      },
      "PF": {
        "pos": [
          55,
          90
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "042",
    "name": "Borderless Moderate",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Skeptical of national boundaries and in-group preferences; believes in universal humanity.",
    "examples": "Kofi Annan †",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MOR": {
        "pos": [
          0,
          45
        ],
        "sal": [
          60,
          90
        ]
      },
      "TRB": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "CU": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      },
      "NAT": {
        "pos": [
          0,
          35
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "MOR": [
        55,
        100
      ],
      "NAT": [
        50,
        100
      ],
      "TRB": [
        51,
        100
      ]
    }
  },
  {
    "id": "043",
    "name": "Common Ground Seeker",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Actively seeks compromise across partisan divides; frustrated by tribalism on both sides.",
    "examples": "Will Marshall (PPI)",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "ZS": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "COM": {
        "pos": [
          60,
          100
        ],
        "sal": [
          65,
          95
        ]
      },
      "PF": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "TRB": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "ENG": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          85
        ]
      }
    },
    "antiTraits": {
      "COM": [
        0,
        50
      ],
      "ZS": [
        55,
        100
      ],
      "TRB": [
        60,
        100
      ]
    }
  },
  {
    "id": "044",
    "name": "Neoliberal Progressive",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Socially liberal, economically market-friendly; believes markets and social progress are compatible.",
    "examples": "Matt Yglesias, Noah Smith, Elon Musk (2012–2020)",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          55,
          95
        ],
        "sal": [
          50,
          85
        ]
      },
      "ENG": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          85
        ]
      }
    },
    "antiTraits": {
      "ONT_H": [
        75,
        100
      ],
      "ONT_S": [
        96,
        100
      ]
    }
  },
  {
    "id": "045",
    "name": "Policy Over Party",
    "tier": "T2",
    "frequency": 2.3,
    "description": "Evaluates policies on merits rather than party affiliation; frustrated with partisan tribalism.",
    "examples": "Mitt Romney (2019–), Liz Cheney (2021–), Kyrsten Sinema (2020–)",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "PF": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "EPS": {
        "pos": [
          15,
          55
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          75,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "COM": {
        "pos": [
          65,
          100
        ],
        "sal": [
          60,
          90
        ]
      }
    }
  },
  {
    "id": "046",
    "name": "Solutions-Oriented Moderate",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Focuses on practical problem-solving rather than ideological purity.",
    "examples": "Mike DeWine",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "ZS": {
        "pos": [
          0,
          40
        ],
        "sal": [
          65,
          95
        ]
      },
      "ONT_S": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "EPS": {
        "pos": [
          20,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "COM": {
        "pos": [
          50,
          90
        ],
        "sal": [
          55,
          85
        ]
      },
      "ENG": {
        "pos": [
          55,
          90
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "TRB": [
        50,
        100
      ]
    }
  },
  {
    "id": "047",
    "name": "Hardline Movement Conservative",
    "tier": "T2",
    "frequency": 2.0,
    "description": "Combines aggressive capitalism with authoritarian cultural conservatism; outcomes justify means.",
    "examples": "Stephen Miller",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          60,
          95
        ],
        "sal": [
          60,
          95
        ]
      },
      "CD": {
        "pos": [
          65,
          100
        ],
        "sal": [
          65,
          100
        ]
      },
      "ZS": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          90
        ]
      },
      "PF": {
        "pos": [
          65,
          100
        ],
        "sal": [
          60,
          95
        ]
      },
      "ENG": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          95
        ]
      }
    }
  },
  {
    "id": "049",
    "name": "Global Markets Libertarian",
    "tier": "T2",
    "frequency": 2,
    "description": "Believes in free markets and free trade across borders; economically libertarian globalist.",
    "examples": "Johan Norberg, Deirdre McCloskey",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          55,
          100
        ],
        "sal": [
          65,
          95
        ]
      },
      "CU": {
        "pos": [
          0,
          55
        ],
        "sal": [
          50,
          80
        ]
      },
      "ZS": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "MOR": {
        "pos": [
          0,
          55
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "050",
    "name": "Data-Driven Democrat",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Left-leaning but epistemology is load-bearing; follows evidence to progressive conclusions.",
    "examples": "Some policy wonks, data journalists",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      },
      "EPS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          65,
          95
        ]
      },
      "H": {
        "pos": [
          30,
          70
        ],
        "sal": [
          55,
          85
        ]
      },
      "AES": {
        "pos": [
          0,
          35
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "EPS": [
        55,
        100
      ],
      "AES": [
        50,
        100
      ],
      "MOR": [
        0,
        29
      ],
      "ZS": [
        55,
        100
      ],
      "H": [
        0,
        29
      ]
    }
  },
  {
    "id": "051",
    "name": "Working-Class Traditionalist",
    "tier": "T2",
    "frequency": 2.3,
    "description": "Economically left, culturally conservative working-class; wants redistribution but distrusts cultural outsiders. The 'Obama-Trump' crossover type.",
    "examples": "Robert Casey Sr. †, Huey Long †, Father Coughlin †",
    "ontLevel": "Var",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "CD": {
        "pos": [
          60,
          95
        ],
        "sal": [
          45,
          80
        ]
      },
      "CU": {
        "pos": [
          55,
          90
        ],
        "sal": [
          45,
          80
        ]
      },
      "ZS": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          90
        ]
      },
      "TRB": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          85
        ]
      },
      "H": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "052",
    "name": "Cosmopolitan Libertarian",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Socially liberal, economically libertarian, globally oriented; dislikes both parties equally.",
    "examples": "Nick Gillespie, Bryan Caplan",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          60,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "CU": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      },
      "MOR": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "H": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "CD": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "CD": [
        55,
        100
      ],
      "CU": [
        50,
        100
      ],
      "TRB": [
        55,
        100
      ]
    }
  },
  {
    "id": "053",
    "name": "Culturally Cautious Centrist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Centrist on economics but cautious about rapid cultural change.",
    "examples": "Suburban moderates uneasy with cultural progressivism",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          35,
          65
        ],
        "sal": [
          50,
          80
        ]
      },
      "CD": {
        "pos": [
          55,
          85
        ],
        "sal": [
          55,
          85
        ]
      },
      "CU": {
        "pos": [
          50,
          80
        ],
        "sal": [
          50,
          80
        ]
      },
      "PF": {
        "pos": [
          0,
          35
        ],
        "sal": [
          50,
          80
        ]
      },
      "MOR": {
        "pos": [
          45,
          75
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "PF": [
        65,
        100
      ],
      "TRB": [
        65,
        100
      ],
      "ENG": [
        65,
        100
      ]
    }
  },
  {
    "id": "055",
    "name": "Conflict-Minded Progressive",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Believes fundamental transformation requires confrontation with entrenched power.",
    "examples": "Chris Hedges",
    "ontLevel": "Var",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "ZS": {
        "pos": [
          55,
          90
        ],
        "sal": [
          60,
          95
        ]
      },
      "TRB": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          90
        ]
      },
      "ENG": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          90
        ]
      }
    }
  },
  {
    "id": "056",
    "name": "Structure and Community",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Values social order, hierarchy, and strong community bonds.",
    "examples": "Rod Dreher",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          60,
          100
        ],
        "sal": [
          45,
          75
        ]
      },
      "CU": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          30,
          70
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          30,
          70
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "PRO": [
        55,
        100
      ]
    }
  },
  {
    "id": "058",
    "name": "Community-Rooted Progressive",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Progressive values rooted in strong community or faith tradition.",
    "examples": "Dorothy Day †, Shane Claiborne",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "TRB": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          35,
          70
        ],
        "sal": [
          50,
          85
        ]
      },
      "ENG": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "059",
    "name": "Independent Social Democrat",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Supports social democratic policies but dislikes Democratic Party establishment.",
    "examples": "Left-independents frustrated with Dems",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          45
        ],
        "sal": [
          60,
          90
        ]
      },
      "PF": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          40,
          90
        ],
        "sal": [
          50,
          80
        ]
      },
      "AES": {
        "pos": [
          20,
          50
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "MAT": [
        55,
        100
      ],
      "PF": [
        41,
        100
      ],
      "TRB": [
        55,
        100
      ],
      "CU": [
        55,
        100
      ],
      "AES": [
        60,
        100
      ],
      "ONT_H": [
        60,
        100
      ]
    }
  },
  {
    "id": "060",
    "name": "Mutual Aid Progressive",
    "tier": "T2",
    "frequency": 1.5,
    "description": "Focuses on being a good community member; believes in local cooperation and mutual aid.",
    "examples": "Mutual aid organizers",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "COM": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          0,
          60
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          45,
          90
        ],
        "sal": [
          50,
          80
        ]
      },
      "ZS": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "AES": {
        "pos": [
          0,
          35
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "ZS": [
        50,
        100
      ],
      "AES": [
        50,
        100
      ]
    }
  },
  {
    "id": "061",
    "name": "Neoliberal",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Free markets plus social liberalism; globalist, pro-immigration, optimistic about growth.",
    "examples": "Matt Yglesias, Noah Smith",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          65,
          95
        ],
        "sal": [
          60,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      },
      "ZS": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          90
        ]
      },
      "EPS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "062",
    "name": "Ordoliberal",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Social market economy; markets need strong rules and institutions to function fairly.",
    "examples": "German economic tradition",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          85
        ]
      },
      "PRO": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "MOR": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      },
      "H": {
        "pos": [
          35,
          75
        ],
        "sal": [
          45,
          75
        ]
      },
      "CD": {
        "pos": [
          20,
          50
        ],
        "sal": [
          40,
          70
        ]
      }
    },
    "antiTraits": {
      "PRO": [
        0,
        50
      ],
      "MAT": [
        0,
        50
      ],
      "CD": [
        55,
        100
      ],
      "TRB": [
        50,
        100
      ],
      "MOR": [
        71,
        100
      ]
    }
  },
  {
    "id": "063",
    "name": "Christian Democrat",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Center-right with religious moral framework; supports welfare state within traditional values.",
    "examples": "European Christian Democratic parties",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          35,
          65
        ],
        "sal": [
          50,
          80
        ]
      },
      "CD": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          40,
          75
        ],
        "sal": [
          55,
          85
        ]
      },
      "COM": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "064",
    "name": "Market Socialist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Worker ownership combined with market mechanisms; anti-capitalist but not anti-market.",
    "examples": "Worker cooperative advocates",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          40,
          85
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "H": [
        55,
        100
      ],
      "MAT": [
        60,
        100
      ],
      "ONT_S": [
        55,
        100
      ]
    }
  },
  {
    "id": "065",
    "name": "Georgist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Land value tax as primary policy; believes unearned land rents are the source of inequality.",
    "examples": "Henry George followers",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          25,
          65
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          20,
          60
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          50,
          95
        ],
        "sal": [
          50,
          80
        ]
      },
      "ZS": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          0,
          35
        ],
        "sal": [
          55,
          85
        ]
      },
      "AES": {
        "pos": [
          25,
          55
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "TRB": [
        50,
        100
      ],
      "AES": [
        60,
        100
      ],
      "PF": [
        40,
        100
      ]
    }
  },
  {
    "id": "066",
    "name": "Civic Republican",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Active citizenship and civic virtue are essential; constitutional process is sacred. Freedom through participation; popular sovereignty within constitutional bounds.",
    "examples": "Hannah Arendt tradition, Federalist Society members, Larry Kramer",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "PRO": {
        "pos": [
          55,
          90
        ],
        "sal": [
          60,
          90
        ]
      },
      "MOR": {
        "pos": [
          50,
          85
        ],
        "sal": [
          60,
          90
        ]
      },
      "H": {
        "pos": [
          40,
          70
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          50,
          100
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          35,
          65
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "TRB": [
        65,
        100
      ],
      "PF": [
        60,
        100
      ],
      "MOR": [
        0,
        40
      ],
      "PRO": [
        0,
        45
      ]
    }
  },
  {
    "id": "067",
    "name": "Communitarian Centrist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Strong communities over individual rights; moderate on economics and culture.",
    "examples": "Amitai Etzioni",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MOR": {
        "pos": [
          45,
          80
        ],
        "sal": [
          55,
          85
        ]
      },
      "COM": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          40,
          75
        ],
        "sal": [
          50,
          80
        ]
      },
      "MAT": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      },
      "ENG": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "ENG": [
        0,
        40
      ],
      "ONT_S": [
        0,
        40
      ],
      "PF": [
        60,
        100
      ]
    }
  },
  {
    "id": "068",
    "name": "Third Way Democrat",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Triangulation between left and right; market-friendly progressivism. Pro-business, socially liberal, pragmatic.",
    "examples": "1990s Clinton Democrats, DLC Democrats",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          40,
          70
        ],
        "sal": [
          55,
          85
        ]
      },
      "CD": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          60,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "PF": {
        "pos": [
          50,
          90
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "MAT": [
        0,
        35
      ],
      "ZS": [
        60,
        100
      ],
      "MOR": [
        60,
        100
      ]
    }
  },
  {
    "id": "070",
    "name": "Rockefeller Republican",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Fiscally conservative, socially moderate; old-school northeastern Republican.",
    "examples": "Pre-Reagan GOP moderates",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          65,
          95
        ],
        "sal": [
          60,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      },
      "MOR": {
        "pos": [
          30,
          60
        ],
        "sal": [
          55,
          85
        ]
      },
      "PRO": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "071",
    "name": "Catholic Worker",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Radical Catholic social teaching; pacifist, pro-poor, anti-state.",
    "examples": "Dorothy Day",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          30,
          75
        ],
        "sal": [
          55,
          85
        ]
      },
      "COM": {
        "pos": [
          50,
          95
        ],
        "sal": [
          50,
          80
        ]
      },
      "H": {
        "pos": [
          0,
          60
        ],
        "sal": [
          45,
          75
        ]
      },
      "AES": {
        "pos": [
          0,
          35
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          25
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "MAT": [
        56,
        100
      ],
      "AES": [
        50,
        100
      ],
      "ONT_H": [
        60,
        100
      ]
    }
  },
  {
    "id": "072",
    "name": "Distributist",
    "tier": "T2",
    "frequency": 1.5,
    "description": "Widespread property ownership; against both big business and big government.",
    "examples": "G.K. Chesterton, Belloc",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          30,
          65
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          30,
          65
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          40,
          75
        ],
        "sal": [
          55,
          85
        ]
      },
      "CD": {
        "pos": [
          50,
          90
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "PRO": [
        60,
        100
      ],
      "COM": [
        55,
        100
      ]
    }
  },
  {
    "id": "073",
    "name": "Agrarian Populist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Rural-focused; suspicious of banks, corporations, and urban elites.",
    "examples": "Historical Populist Party",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          20,
          65
        ],
        "sal": [
          45,
          75
        ]
      },
      "CD": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          80
        ]
      },
      "ZS": {
        "pos": [
          50,
          95
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "ENG": [65, 100],
      "AES": [65, 100]
    }
  },
  {
    "id": "074",
    "name": "Localist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Local self-governance is paramount; skeptical of all distant authority.",
    "examples": "Buy local movements, decentralists",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "TRB": {
        "pos": [
          55,
          90
        ],
        "sal": [
          60,
          95
        ]
      },
      "MOR": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          90
        ]
      },
      "MAT": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      },
      "H": {
        "pos": [
          40,
          70
        ],
        "sal": [
          50,
          85
        ]
      },
      "ENG": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "075",
    "name": "Mutualist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Market anarchism; free markets without capitalism, mutual credit.",
    "examples": "Proudhon tradition",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          20,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "PRO": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "CD": [
        45,
        100
      ]
    }
  },
  {
    "id": "076",
    "name": "Guild Socialist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Worker control through trade guilds or councils; decentralized socialism with workplace democracy.",
    "examples": "G.D.H. Cole, Anton Pannekoek",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          20,
          60
        ],
        "sal": [
          45,
          75
        ]
      },
      "PRO": {
        "pos": [
          35,
          80
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          50,
          95
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "EPS": [
        0,
        35
      ],
      "CU": [
        55,
        100
      ],
      "AES": [
        70,
        100
      ],
      "PF": [
        40,
        100
      ]
    }
  },
  {
    "id": "077",
    "name": "Conservative Socialist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Economic leftism combined with cultural conservatism; working-class traditionalist.",
    "examples": "Blue Labour",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          60,
          95
        ]
      },
      "CD": {
        "pos": [
          60,
          95
        ],
        "sal": [
          60,
          95
        ]
      },
      "MOR": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          85
        ]
      },
      "H": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          85
        ]
      },
      "TRB": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "078",
    "name": "National Conservative",
    "tier": "T2",
    "frequency": 2,
    "description": "Nation-state as primary unit; cultural preservation, skeptical of globalism.",
    "examples": "Yoram Hazony",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          65,
          95
        ],
        "sal": [
          60,
          90
        ]
      },
      "CU": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          80
        ]
      },
      "MAT": {
        "pos": [
          45,
          75
        ],
        "sal": [
          45,
          75
        ]
      },
      "NAT": {
        "pos": [
          60,
          100
        ],
        "sal": [
          65,
          95
        ]
      }
    },
    "antiTraits": {
      "NAT": [
        0,
        40
      ],
      "CU": [
        0,
        35
      ]
    }
  },
  {
    "id": "079",
    "name": "Civic Nationalist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "National identity based on civic values, not ethnicity; patriotic liberal.",
    "examples": "Civic nationalism advocates",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "CU": {
        "pos": [
          55,
          90
        ],
        "sal": [
          60,
          95
        ]
      },
      "TRB": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          45,
          75
        ],
        "sal": [
          50,
          85
        ]
      },
      "CD": {
        "pos": [
          40,
          75
        ],
        "sal": [
          50,
          85
        ]
      },
      "H": {
        "pos": [
          40,
          70
        ],
        "sal": [
          45,
          80
        ]
      }
    }
  },
  {
    "id": "081",
    "name": "Minarchist",
    "tier": "T2",
    "frequency": 2,
    "description": "Minimal state; only police, courts, military. Night-watchman state.",
    "examples": "Robert Nozick tradition",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          70,
          100
        ],
        "sal": [
          60,
          95
        ]
      },
      "H": {
        "pos": [
          30,
          65
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          0,
          58
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "082",
    "name": "Anarcho-Communist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Abolish state and capitalism; mutual aid and gift economy.",
    "examples": "Kropotkin tradition",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          42
        ],
        "sal": [
          65,
          95
        ]
      },
      "H": {
        "pos": [
          0,
          45
        ],
        "sal": [
          60,
          95
        ]
      },
      "ZS": {
        "pos": [
          40,
          90
        ],
        "sal": [
          50,
          85
        ]
      },
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          85
        ]
      },
      "MOR": {
        "pos": [
          0,
          58
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "084",
    "name": "Syndicalist",
    "tier": "T2",
    "frequency": 1.3,
    "description": "Revolutionary trade unionism; workers control through direct action.",
    "examples": "IWW tradition",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          60,
          95
        ]
      },
      "H": {
        "pos": [
          0,
          58
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          40,
          90
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          85
        ]
      },
      "AES": {
        "pos": [
          25,
          90
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "085",
    "name": "Primitivist",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Civilization is the problem; return to pre-industrial or pre-agricultural life.",
    "examples": "John Zerzan",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "ONT_S": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "MAT": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          0,
          60
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      },
      "CD": {
        "pos": [
          60,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "CU": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      },
      "AES": {
        "pos": [
          0,
          30
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "H": [
        70,
        100
      ],
      "ONT_H": [
        65,
        100
      ],
      "PF": [
        75,
        100
      ]
    }
  },
  {
    "id": "086",
    "name": "Transhumanist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Technology will transcend human limitations; embrace enhancement.",
    "examples": "Ray Kurzweil, Nick Bostrom",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "ONT_H": {
        "pos": [
          60,
          100
        ],
        "sal": [
          65,
          95
        ]
      },
      "ONT_S": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "EPS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "COM": [
        60,
        100
      ],
      "ONT_H": [
        0,
        50
      ],
      "ONT_S": [
        0,
        50
      ],
      "EPS": [
        55,
        100
      ]
    }
  },
  {
    "id": "087",
    "name": "Post-Ideological Technocrat",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Expert rule; policy should be determined by technical knowledge.",
    "examples": "Technocracy movement",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "EPS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          60,
          90
        ]
      },
      "H": {
        "pos": [
          50,
          90
        ],
        "sal": [
          60,
          90
        ]
      },
      "PRO": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "TRB": {
        "pos": [
          0,
          55
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "H": [
        0,
        45
      ],
      "EPS": [
        55,
        100
      ],
      "TRB": [
        56,
        100
      ]
    }
  },
  {
    "id": "088",
    "name": "Meritocrat",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Reward talent and effort; inequality is acceptable if earned.",
    "examples": "Singapore model advocates",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "H": {
        "pos": [
          45,
          80
        ],
        "sal": [
          65,
          95
        ]
      },
      "MAT": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "EPS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "PRO": {
        "pos": [
          45,
          85
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "089",
    "name": "Elitist Democrat",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Democracy needs competent leadership; not all opinions equal on technical matters.",
    "examples": "Jason Brennan",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          20,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "H": {
        "pos": [
          55,
          90
        ],
        "sal": [
          60,
          95
        ]
      },
      "EPS": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          90
        ]
      },
      "PF": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "091",
    "name": "Fortress Traditionalist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Scarcity-driven authoritarianism; zero-sum resource thinking, hierarchical traditionalism, siege mentality.",
    "examples": "Pentti Linkola",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          50,
          95
        ],
        "sal": [
          50,
          80
        ]
      },
      "ZS": {
        "pos": [
          50,
          100
        ],
        "sal": [
          50,
          80
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          55
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "092",
    "name": "National Bolshevik",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Synthesis of far-left economics and far-right nationalism.",
    "examples": "Limonov's NBP",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "CD": {
        "pos": [
          60,
          100
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          55,
          100
        ],
        "sal": [
          45,
          75
        ]
      },
      "ZS": {
        "pos": [
          70,
          100
        ],
        "sal": [
          65,
          95
        ]
      },
      "AES": {
        "pos": [
          60,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "COM": [
        55,
        100
      ],
      "PRO": [
        55,
        100
      ],
      "ZS": [
        0,
        55
      ],
      "AES": [
        0,
        45
      ],
      "ONT_S": [
        50,
        100
      ]
    }
  },
  {
    "id": "093",
    "name": "Traditional Cosmopolitan",
    "tier": "T2",
    "frequency": 1.6,
    "description": "Holds traditional values but applies them universally to all humans, not just their own tribe. Believes in timeless moral truths that transcend cultural and national boundaries. May be religious universalist or natural law adherent.",
    "examples": "Catholic social teaching adherents, natural law philosophers, some religious humanitarians, cosmopolitan conservatives",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "CD": {
        "pos": [
          60,
          90
        ],
        "sal": [
          55,
          90
        ]
      },
      "TRB": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "CU": {
        "pos": [
          30,
          60
        ],
        "sal": [
          45,
          75
        ]
      },
      "H": {
        "pos": [
          40,
          70
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "094",
    "name": "Post-Left Anarchist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Beyond traditional anarchism; individualist, anti-organizational.",
    "examples": "Bob Black, Hakim Bey",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "H": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "PRO": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          0,
          55
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "PF": [55, 100],
      "CD": [55, 100]
    }
  },
  {
    "id": "095",
    "name": "Dark Enlightenment",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Neoreaction; democracy is a failed experiment, return to traditional authority.",
    "examples": "Curtis Yarvin (Moldbug)",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "H": {
        "pos": [
          65,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "PRO": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "EPS": {
        "pos": [
          15,
          65
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "MOR": [0, 35],
      "CD": [0, 35]
    }
  },
  {
    "id": "096",
    "name": "Radical Centrist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Synthesize best ideas from all sides; reject tribal politics.",
    "examples": "Andrew Yang style",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "TRB": {
        "pos": [
          0,
          55
        ],
        "sal": [
          50,
          80
        ]
      },
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          60,
          100
        ],
        "sal": [
          65,
          95
        ]
      },
      "ENG": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          85
        ]
      },
      "AES": {
        "pos": [
          50,
          85
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          40,
          75
        ],
        "sal": [
          50,
          80
        ]
      },
      "ONT_H": {
        "pos": [
          40,
          70
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "TRB": [
        65,
        100
      ],
      "PF": [
        70,
        100
      ],
      "MOR": [
        70,
        100
      ]
    }
  },
  {
    "id": "097",
    "name": "Anti-Politics",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Politics itself is the problem; withdrawal, prefigurative alternatives.",
    "examples": "Disengaged cynics",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "ENG": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          0,
          45
        ],
        "sal": [
          45,
          75
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "098",
    "name": "Techno-Feudalist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Tech platform oligarchy as new feudalism; accepts this as inevitable.",
    "examples": "Peter Thiel adjacent",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          60,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          80
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "CD": [0, 40],
      "ENG": [0, 35]
    }
  },
  {
    "id": "099",
    "name": "Post-Scarcity Utopian",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Automation will eliminate scarcity; prepare for abundance.",
    "examples": "Fully automated luxury space communism memes",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "ZS": {
        "pos": [
          0,
          35
        ],
        "sal": [
          65,
          95
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          60,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      },
      "AES": {
        "pos": [
          40,
          70
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "ZS": [
        60,
        100
      ],
      "ONT_S": [
        0,
        40
      ],
      "TRB": [
        60,
        100
      ],
      "CU": [
        70,
        100
      ],
      "PF": [
        65,
        100
      ]
    }
  },
  {
    "id": "100",
    "name": "Fully Automated Luxury Communist",
    "tier": "T2",
    "frequency": 2.0,
    "description": "FALC; technology enables communist utopia without sacrifice.",
    "examples": "Aaron Bastani",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          42
        ],
        "sal": [
          65,
          95
        ]
      },
      "H": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "ONT_S": {
        "pos": [
          70,
          100
        ],
        "sal": [
          60,
          95
        ]
      },
      "ZS": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          85
        ]
      },
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "G01",
    "name": "Survival Pragmatist",
    "tier": "GATE",
    "frequency": 3.5,
    "description": "Too focused on economic survival to engage in politics; sees politics as zero-sum but irrelevant to daily life.",
    "examples": "Working multiple jobs; politics is a luxury",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "ENG": {
        "pos": [
          0,
          30
        ],
        "sal": [
          70,
          100
        ]
      },
      "ZS": {
        "pos": [
          60,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      },
      "MAT": {
        "pos": [
          25,
          65
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "G04",
    "name": "Private-Life Progressive",
    "tier": "GATE",
    "frequency": 2.2,
    "description": "Progressive values but not politically engaged; lives values privately.",
    "examples": "Socially liberal professionals who avoid politics",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "ENG": {
        "pos": [
          0,
          45
        ],
        "sal": [
          60,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          40,
          70
        ]
      },
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          55
        ],
        "sal": [
          45,
          75
        ]
      },
      "MOR": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "G06",
    "name": "Identity Networker",
    "tier": "GATE",
    "frequency": 1.8,
    "description": "Politics is primarily social; votes how their community votes.",
    "examples": "James Michael Curley †",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "PF": {
        "pos": [
          60,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "ENG": {
        "pos": [
          40,
          75
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          35,
          75
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "G07",
    "name": "Rule-Following Citizen",
    "tier": "GATE",
    "frequency": 1.8,
    "description": "Participates through proper channels; believes in following rules and procedures.",
    "examples": "Sandra Day O'Connor †",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "PRO": {
        "pos": [
          60,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "ENG": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      },
      "H": {
        "pos": [
          50,
          90
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          45,
          90
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "TRB": [
        60,
        100
      ],
      "MOR": [
        60,
        100
      ],
      "ZS": [
        60,
        100
      ]
    }
  },
  {
    "id": "G10",
    "name": "Online Spectator",
    "tier": "GATE",
    "frequency": 1.8,
    "description": "Highly engaged online but doesn't participate offline; politics as entertainment.",
    "examples": "Twitter power users who never vote",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "ENG": {
        "pos": [
          45,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "AES": {
        "pos": [
          25,
          95
        ],
        "sal": [
          50,
          80
        ]
      },
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      },
      "TRB": {
        "pos": [
          40,
          85
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "G11",
    "name": "Quiet Dissident",
    "tier": "GATE",
    "frequency": 1.8,
    "description": "Silently disagrees with both parties; keeps head down and disengages.",
    "examples": "Philip Roth † (2000s)",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "ENG": {
        "pos": [
          0,
          35
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          0,
          55
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "M02",
    "name": "Constitutional Purist",
    "tier": "MEANS",
    "frequency": 1.8,
    "description": "Constitutional process is sacred; outcomes are legitimate only if process is. Will oppose \"their side\" on procedural grounds.",
    "examples": "Ron Paul (civil liberties), some ACLU types",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "PRO": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "COM": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      },
      "ENG": {
        "pos": [
          50,
          95
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "M03",
    "name": "Norm Guardian",
    "tier": "MEANS",
    "frequency": 1.3,
    "description": "Institutionalist who cares about norms above outcomes; \"how we do things\" defines political identity.",
    "examples": "Adam Kinzinger, David French, Liz Cheney (J6 focus)",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "PRO": {
        "pos": [
          0,
          35
        ],
        "sal": [
          60,
          95
        ]
      },
      "AES": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "ENG": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          85
        ]
      },
      "CD": {
        "pos": [
          40,
          75
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          20,
          55
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "M06",
    "name": "Technocratic Free Marketer",
    "tier": "MEANS",
    "frequency": 1.5,
    "description": "Markets + evidence + proper process; technocratic governance as ideal. Depoliticization is the goal.",
    "examples": "Bloomberg (governance style)",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "PRO": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "EPS": {
        "pos": [
          35,
          80
        ],
        "sal": [
          55,
          85
        ]
      },
      "MAT": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          35,
          80
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "CD": [
        55,
        100
      ],
      "TRB": [
        50,
        100
      ],
      "MOR": [
        55,
        100
      ]
    }
  },
  {
    "id": "M07",
    "name": "Rationalist Technocrat",
    "tier": "MEANS",
    "frequency": 1.5,
    "description": "First-principles reasoning + technical competence; believes rational analysis should drive policy.",
    "examples": "Some EA-adjacent policy types",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "PRO": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "EPS": {
        "pos": [
          35,
          90
        ],
        "sal": [
          55,
          85
        ]
      },
      "MAT": {
        "pos": [
          45,
          95
        ],
        "sal": [
          50,
          80
        ]
      },
      "H": {
        "pos": [
          30,
          85
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "M09",
    "name": "Street Advocate",
    "tier": "MEANS",
    "frequency": 1.8,
    "description": "Protest-oriented activist; believes in direct action and movement politics; prophetic style in the streets.",
    "examples": "DeRay Mckesson, John Lewis †, Dolores Huerta",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "COM": {
        "pos": [
          50,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "CD": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "ENG": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "AES": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "H": [65, 100],
      "PRO": [65, 100]
    }
  },
  {
    "id": "M10",
    "name": "Burkean Epistemicist",
    "tier": "MEANS",
    "frequency": 1.8,
    "description": "Tradition is *how we know*, not just *what we prefer*; reason is limited; accumulated wisdom trumps abstract theory.",
    "examples": "Yuval Levin, Michael Oakeshott tradition",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "EPS": {
        "pos": [
          45,
          80
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          35,
          80
        ],
        "sal": [
          45,
          75
        ]
      },
      "PRO": {
        "pos": [
          50,
          85
        ],
        "sal": [
          45,
          75
        ]
      },
      "CD": {
        "pos": [
          50,
          95
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "ZS": [0, 25],
      "ENG": [75, 100]
    }
  },
  {
    "id": "M11",
    "name": "Armchair Analyst",
    "tier": "MEANS",
    "frequency": 1.5,
    "description": "Loves analyzing politics but never participates; pundit mindset without action.",
    "examples": "Larry Sabato",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "ENG": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          85
        ]
      },
      "EPS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          35,
          75
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "M12",
    "name": "Deliberative Moderate",
    "tier": "MEANS",
    "frequency": 1.5,
    "description": "HOW we engage is the core political issue; incivility and polarization are the primary problems.",
    "examples": "Some \"No Labels\" types",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "AES": {
        "pos": [
          0,
          40
        ],
        "sal": [
          60,
          95
        ]
      },
      "COM": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          90
        ]
      },
      "MAT": {
        "pos": [
          35,
          65
        ],
        "sal": [
          45,
          75
        ]
      },
      "CD": {
        "pos": [
          35,
          65
        ],
        "sal": [
          45,
          75
        ]
      },
      "PF": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "M15",
    "name": "Evidence-First Reformer",
    "tier": "MEANS",
    "frequency": 1.8,
    "description": "Progressive goals, evidence-based methods, principled about process; reform must be both effective and sound.",
    "examples": "Some good-government progressives",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "EPS": {
        "pos": [
          0,
          55
        ],
        "sal": [
          65,
          95
        ]
      },
      "PRO": {
        "pos": [
          15,
          50
        ],
        "sal": [
          55,
          90
        ]
      },
      "COM": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          85
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          85
        ]
      },
      "ENG": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          85
        ]
      }
    }
  },
  {
    "id": "N01",
    "name": "Nonpartisan Activist",
    "tier": "T2",
    "frequency": 2.2,
    "description": "Highly engaged in politics but refuses partisan identity; advocates for issues rather than parties. Believes both parties are captured by special interests.",
    "examples": "Ralph Nader, some civic reform advocates, League of Women Voters activists",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "ENG": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          0,
          55
        ],
        "sal": [
          45,
          75
        ]
      },
      "PRO": {
        "pos": [
          55,
          100
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "N02",
    "name": "Issue-First Independent",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Votes based on specific issues rather than party loyalty; highly engaged but switches parties based on candidates and issues.",
    "examples": "Split-ticket voters, some suburban independents",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "ENG": {
        "pos": [
          55,
          90
        ],
        "sal": [
          60,
          90
        ]
      },
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          45
        ],
        "sal": [
          45,
          75
        ]
      },
      "EPS": {
        "pos": [
          20,
          60
        ],
        "sal": [
          55,
          85
        ]
      },
      "PRO": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "EPS": [
        0,
        19
      ],
      "ENG": [
        10,
        45
      ],
      "TRB": [
        65,
        100
      ]
    }
  },
  {
    "id": "N03",
    "name": "Civic Engagement Maximalist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Believes participation itself is the highest political value; votes, volunteers, attends meetings regardless of party. Process-focused independent.",
    "examples": "Town hall regulars, PTA-to-politics pipeline",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "ENG": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      },
      "PRO": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "AES": {
        "pos": [
          25,
          75
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "N04",
    "name": "Digital Warrior",
    "tier": "GATE",
    "frequency": 2,
    "description": "Extremely combative online but rarely participates offline. Politics as spectator sport and identity performance. High engagement online, zero offline.",
    "examples": "Twitter/Reddit political posters who never vote, reply guys",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "COM": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "ENG": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "AES": {
        "pos": [
          25,
          75
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          55,
          100
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "N05",
    "name": "Armchair Combatant",
    "tier": "GATE",
    "frequency": 1.5,
    "description": "Loves political arguments and debate but sees voting as pointless. High conflict engagement, low civic participation.",
    "examples": "Political podcast addicts who don't vote, debate club alumni",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "COM": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "ENG": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      },
      "EPS": {
        "pos": [
          30,
          75
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          50,
          100
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "N08",
    "name": "Reluctant Partisan",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Would prefer to be independent but feels forced to choose sides by polarization. High engagement, uncomfortable with party identity.",
    "examples": "'I'm not a Democrat, I just always vote for them', Never-Trumpers",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "ENG": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          30,
          70
        ],
        "sal": [
          55,
          85
        ]
      },
      "TRB": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      }
    }
  },
  {
    "id": "N09",
    "name": "Social Liberal Moderate",
    "tier": "T2",
    "frequency": 1.8,
    "description": "Fiscally centrist but socially progressive; open to cultural change while pragmatic on economics. Common among educated suburbanites.",
    "examples": "Suburban moderates who vote on social issues, 'socially liberal, fiscally moderate' types",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          35,
          65
        ],
        "sal": [
          45,
          75
        ]
      },
      "CD": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          0,
          50
        ],
        "sal": [
          45,
          75
        ]
      },
      "MOR": {
        "pos": [
          10,
          50
        ],
        "sal": [
          50,
          80
        ]
      }
    }
  },
  {
    "id": "N10",
    "name": "Social Conservative Moderate",
    "tier": "T2",
    "frequency": 1.5,
    "description": "Fiscally centrist but culturally traditional; values stability and tradition while pragmatic on economics. Common in rural and religious communities.",
    "examples": "Rural moderates, church-going centrists uncomfortable with both parties",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          42,
          58
        ],
        "sal": [
          45,
          70
        ]
      },
      "CD": {
        "pos": [
          65,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "PF": {
        "pos": [
          0,
          45
        ],
        "sal": [
          35,
          60
        ]
      },
      "MOR": {
        "pos": [
          50,
          80
        ],
        "sal": [
          50,
          80
        ]
      },
      "COM": {
        "pos": [
          60,
          90
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          45,
          75
        ],
        "sal": [
          40,
          70
        ]
      }
    }
  },
  {
    "id": "N11",
    "name": "Progressive Civic Nationalist",
    "tier": "T1",
    "frequency": 1.6,
    "description": "Progressive economics framed through American civic identity; believes in shared national purpose, worker solidarity, and cross-partisan coalition building. Patriotic framing of progressive goals. Visionary rather than technocratic.",
    "examples": "Ro Khanna, Tim Ryan (economic focus), some Bernie coalition members",
    "ontLevel": "High",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          5,
          55
        ],
        "sal": [
          40,
          76
        ]
      },
      "CD": {
        "pos": [
          10,
          60
        ],
        "sal": [
          40,
          75
        ]
      },
      "CU": {
        "pos": [
          35,
          75
        ],
        "sal": [
          50,
          85
        ]
      },
      "MOR": {
        "pos": [
          5,
          45
        ],
        "sal": [
          58,
          88
        ]
      },
      "AES": {
        "pos": [
          30,
          85
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          15,
          60
        ],
        "sal": [
          45,
          80
        ]
      },
      "ONT_H": {
        "pos": [
          45,
          95
        ],
        "sal": [
          45,
          80
        ]
      }
    },
    "antiTraits": {
      "ZS": [
        70,
        100
      ],
      "AES": [
        10,
        29
      ],
      "ENG": [
        10,
        40
      ],
      "PF": [
        10,
        14
      ]
    }
  },
  {
    "id": "N12",
    "name": "Social Civic Nationalist",
    "tier": "T1",
    "frequency": 2,
    "description": "Social democratic economics combined with civic nationalism. Believes in rebuilding American identity around civic participation, shared democratic values, and economic solidarity. Policy-focused rather than populist; sees national cohesion through inclusive institutions.",
    "examples": "Union Democrats, civic renewal advocates, some New Deal coalition inheritors",
    "ontLevel": "Mid",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          95
        ]
      },
      "NAT": {
        "pos": [
          25,
          60
        ],
        "sal": [
          35,
          90
        ]
      },
      "CD": {
        "pos": [
          10,
          50
        ],
        "sal": [
          50,
          95
        ]
      },
      "AES": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          95
        ]
      },
      "ENG": {
        "pos": [
          55,
          95
        ],
        "sal": [
          50,
          90
        ]
      },
      "PF": {
        "pos": [
          50,
          95
        ],
        "sal": [
          50,
          90
        ]
      }
    },
    "antiTraits": {
      "TRB": [
        40,
        100
      ],
      "H": [
        50,
        100
      ]
    }
  },
  {
    "id": "N13",
    "name": "Vigilant Democrat",
    "tier": "T1",
    "frequency": 2.3,
    "description": "Worried about democratic backsliding, climate crisis, or authoritarian threats; votes with urgency and alarm. Sees elections as existential battles.",
    "examples": "Rachel Maddow viewers, Democracy-in-peril activists",
    "ontLevel": "Low",
    "baseId": "001",
    "traits": {
      "MAT": {
        "pos": [
          0,
          48
        ],
        "sal": [
          75,
          100
        ]
      },
      "CD": {
        "pos": [
          0,
          48
        ],
        "sal": [
          50,
          74
        ]
      },
      "MOR": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "H": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "TRB": {
        "pos": [
          34,
          66
        ],
        "sal": [
          75,
          100
        ]
      },
      "PF": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          74
        ]
      },
      "ONT_H": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "ONT_H": [
        70,
        100
      ]
    }
  },
  {
    "id": "N14",
    "name": "Fortress Conservative",
    "tier": "T1",
    "frequency": 1.9,
    "description": "Feels traditional America is under siege from cultural and demographic change; votes defensively to preserve what remains of the country they knew.",
    "examples": "Laura Ingraham listeners, cultural anxiety voters",
    "ontLevel": "Low",
    "baseId": "002",
    "traits": {
      "MAT": {
        "pos": [
          58,
          100
        ],
        "sal": [
          75,
          100
        ]
      },
      "MOR": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "H": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          74
        ]
      },
      "TRB": {
        "pos": [
          34,
          66
        ],
        "sal": [
          60,
          90
        ]
      },
      "ONT_H": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          50,
          90
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "ONT_H": [
        75,
        100
      ],
      "ONT_S": [
        75,
        100
      ]
    }
  },
  {
    "id": "N15",
    "name": "Fighting-Class Democrat",
    "tier": "T1",
    "frequency": 1.8,
    "description": "Sees economics as zero-sum struggle between workers and the powerful; combative 'fighting for working families' framing. Economic combat, not wonkery.",
    "examples": "Sherrod Brown supporters, union Democrats, populist left",
    "ontLevel": "Mid",
    "baseId": "007",
    "traits": {
      "MAT": {
        "pos": [
          0,
          45
        ],
        "sal": [
          75,
          100
        ]
      },
      "PF": {
        "pos": [
          50,
          95
        ],
        "sal": [
          50,
          80
        ]
      },
      "MOR": {
        "pos": [
          30,
          70
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          50,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "H": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "ZS": [
        0,
        45
      ],
      "MAT": [
        55,
        100
      ]
    }
  },
  {
    "id": "N16",
    "name": "Social Gospel Voter",
    "tier": "T1",
    "frequency": 1.5,
    "description": "Faith calls them to universal justice—welcoming the stranger, caring for the poor, healing the world. Cosmopolitan, interfaith-friendly, progressive religious tradition.",
    "examples": "William Barber, Jim Wallis, liberation theology Catholics, progressive evangelicals",
    "ontLevel": "High",
    "baseId": "020",
    "traits": {
      "CD": {
        "pos": [
          40,
          80
        ],
        "sal": [
          50,
          80
        ]
      },
      "CU": {
        "pos": [
          30,
          70
        ],
        "sal": [
          45,
          75
        ]
      },
      "MOR": {
        "pos": [
          55,
          100
        ],
        "sal": [
          65,
          95
        ]
      },
      "H": {
        "pos": [
          20,
          60
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          50,
          90
        ],
        "sal": [
          55,
          85
        ]
      },
      "COM": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "COM": [
        0,
        45
      ],
      "MAT": [
        60,
        100
      ]
    }
  },
  {
    "id": "O04",
    "name": "Doomer Leftist",
    "tier": "T2",
    "frequency": 1.8,
    "description": "\"It's all rigged.\" Disengaged or purely expressive politics.",
    "examples": "Amber A'Lee Frost",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "ENG": {
        "pos": [
          15,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "ONT_H": {
        "pos": [
          0,
          40
        ],
        "sal": [
          60,
          90
        ]
      }
    },
    "antiTraits": {
      "ONT_H": [
        65,
        100
      ],
      "CU": [
        70,
        100
      ],
      "AES": [
        70,
        100
      ]
    }
  },
  {
    "id": "O13",
    "name": "Reform-Optimist Progressive",
    "tier": "ONT",
    "frequency": 1.6,
    "description": "Institutions can be reformed to achieve transformative goals.",
    "examples": "Stacey Abrams",
    "ontLevel": "High",
    "baseId": "008",
    "traits": {
      "MAT": {
        "pos": [
          0,
          45
        ],
        "sal": [
          45,
          75
        ]
      },
      "CD": {
        "pos": [
          0,
          45
        ],
        "sal": [
          45,
          75
        ]
      },
      "PRO": {
        "pos": [
          35,
          70
        ],
        "sal": [
          35,
          65
        ]
      },
      "EPS": {
        "pos": [
          30,
          65
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          80
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "ONT_S": {
        "pos": [
          55,
          95
        ],
        "sal": [
          60,
          90
        ]
      }
    },
    "antiTraits": {
      "H": [60, 100],
      "TRB": [60, 100]
    },
    "_inheritedFrom": "008"
  },
  {
    "id": "O14",
    "name": "Pragmatic Establishmentarian",
    "tier": "T2",
    "frequency": 2.6,
    "description": "Works within institutions because that's what works; no illusions about transformation.",
    "examples": "Rahm Emanuel",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "ONT_H": {
        "pos": [
          15,
          45
        ],
        "sal": [
          65,
          95
        ]
      },
      "ONT_S": {
        "pos": [
          20,
          50
        ],
        "sal": [
          65,
          95
        ]
      },
      "COM": {
        "pos": [
          60,
          95
        ],
        "sal": [
          60,
          90
        ]
      },
      "H": {
        "pos": [
          60,
          95
        ],
        "sal": [
          60,
          90
        ]
      }
    },
    "antiTraits": {
      "CD": [
        0,
        30
      ],
      "ENG": [
        70,
        100
      ],
      "TRB": [
        70,
        100
      ]
    }
  },
  {
    "id": "O17",
    "name": "Progress Capitalist",
    "tier": "ONT",
    "frequency": 0.9,
    "description": "Markets plus progress can solve everything; techno-optimist.",
    "examples": "Patrick Collison (Stripe)",
    "ontLevel": "High",
    "baseId": "044",
    "traits": {
      "MAT": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          90
        ]
      },
      "CD": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "ZS": {
        "pos": [
          0,
          45
        ],
        "sal": [
          50,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          60,
          100
        ],
        "sal": [
          60,
          90
        ]
      },
      "ENG": {
        "pos": [
          50,
          85
        ],
        "sal": [
          50,
          85
        ]
      },
      "ONT_H": {
        "pos": [
          60,
          100
        ],
        "sal": [
          65,
          95
        ]
      }
    },
    "_inheritedFrom": "044"
  },
  {
    "id": "O18",
    "name": "Pragmatic Neoliberal",
    "tier": "ONT",
    "frequency": 1.5,
    "description": "Markets are the least bad option; no illusions about perfection.",
    "examples": "Sebastian Mallaby",
    "ontLevel": "Low",
    "baseId": "044",
    "traits": {
      "ONT_S": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "MAT": {
        "pos": [
          55,
          100
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          35,
          80
        ],
        "sal": [
          45,
          75
        ]
      },
      "CD": {
        "pos": [
          25,
          55
        ],
        "sal": [
          35,
          65
        ]
      }
    },
    "antiTraits": {
      "CD": [
        60,
        100
      ],
      "TRB": [
        50,
        100
      ],
      "MOR": [
        55,
        100
      ]
    }
  },
  {
    "id": "O19",
    "name": "Institutional Skeptic",
    "tier": "ONT",
    "frequency": 1.5,
    "description": "Believes in human potential but distrusts institutions. Sees bureaucracies, corporations, and governments as corrupting forces that stifle human goodness. Prefers grassroots, community-based, and direct approaches over institutional channels.",
    "examples": "Some localists, mutual aid organizers, back-to-land movement, skeptical community activists",
    "ontLevel": "Low",
    "baseId": "075",
    "traits": {
      "ONT_S": {
        "pos": [
          0,
          55
        ],
        "sal": [
          55,
          85
        ]
      },
      "H": {
        "pos": [
          0,
          58
        ],
        "sal": [
          50,
          80
        ]
      },
      "PRO": {
        "pos": [
          0,
          58
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      }
    },
    "antiTraits": {
      "TRB": [
        55,
        100
      ],
      "MOR": [
        55,
        100
      ],
      "ENG": [
        60,
        100
      ]
    }
  },
  {
    "id": "O24",
    "name": "Siege Mentality Conservative",
    "tier": "ONT",
    "frequency": 1.9,
    "description": "Traditional values are under permanent attack from hostile forces; defensive, embattled, sees betrayal everywhere.",
    "examples": "Culture war conservatives, Benedict Option types",
    "ontLevel": "Low",
    "baseId": "003",
    "traits": {
      "CD": {
        "pos": [
          65,
          100
        ],
        "sal": [
          60,
          95
        ]
      },
      "MOR": {
        "pos": [
          34,
          66
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          60,
          95
        ],
        "sal": [
          60,
          95
        ]
      },
      "H": {
        "pos": [
          34,
          66
        ],
        "sal": [
          50,
          80
        ]
      },
      "TRB": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          90
        ]
      },
      "ONT_H": {
        "pos": [
          0,
          40
        ],
        "sal": [
          55,
          90
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          58
        ],
        "sal": [
          55,
          90
        ]
      }
    },
    "antiTraits": {
      "ONT_H": [
        45,
        100
      ],
      "ONT_S": [
        60,
        100
      ],
      "COM": [
        60,
        100
      ]
    },
    "_inheritedFrom": "003"
  },
  {
    "id": "O25",
    "name": "Aspirational Kitchen Table Democrat",
    "tier": "ONT",
    "frequency": 1.3,
    "description": "Believes hard work leads to prosperity; optimistic about economic mobility and the American Dream.",
    "examples": "Upwardly mobile working families",
    "ontLevel": "High",
    "baseId": "007",
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "PF": {
        "pos": [
          50,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "MOR": {
        "pos": [
          30,
          70
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          45,
          90
        ],
        "sal": [
          50,
          80
        ]
      },
      "ONT_H": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          55,
          95
        ],
        "sal": [
          55,
          85
        ]
      },
      "ZS": {
        "pos": [
          0,
          55
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "CD": [
        0,
        35
      ],
      "EPS": [
        55,
        100
      ],
      "PRO": [
        55,
        100
      ]
    },
    "_inheritedFrom": "007"
  },
  {
    "id": "O26",
    "name": "Anxious Kitchen Table Democrat",
    "tier": "ONT",
    "frequency": 1.6,
    "description": "Worried about economic security and falling behind; needs reassurance that the system hasn't forgotten them.",
    "examples": "Economically anxious swing voters",
    "ontLevel": "Low",
    "baseId": "007",
    "traits": {
      "MAT": {
        "pos": [
          0,
          50
        ],
        "sal": [
          65,
          95
        ]
      },
      "PF": {
        "pos": [
          55,
          90
        ],
        "sal": [
          55,
          90
        ]
      },
      "MOR": {
        "pos": [
          30,
          70
        ],
        "sal": [
          50,
          80
        ]
      },
      "ENG": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          58
        ],
        "sal": [
          55,
          90
        ]
      },
      "CD": {
        "pos": [
          30,
          65
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "PRO": [
        55,
        100
      ],
      "H": [
        0,
        30
      ],
      "TRB": [
        65,
        100
      ]
    },
    "_inheritedFrom": "007"
  },
  {
    "id": "R01",
    "name": "Grievance-Activated Populist",
    "tier": "REALITY",
    "frequency": 2.5,
    "description": "No coherent ideology; activated by zero-sum framing and anti-elite messaging. Votes AGAINST system, not FOR policy. First-time Trump voter archetype.",
    "examples": "2016 Obama→Trump voters; non-voters activated by Trump",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "ZS": {
        "pos": [
          55,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_H": {
        "pos": [
          0,
          45
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          50
        ],
        "sal": [
          55,
          85
        ]
      },
      "ENG": {
        "pos": [
          0,
          40
        ],
        "sal": [
          45,
          75
        ]
      }
    },
    "antiTraits": {
      "PF": [
        65,
        100
      ],
      "EPS": [
        0,
        20
      ]
    }
  },
  {
    "id": "R03",
    "name": "Decline-Anxious Swing Voter",
    "tier": "REALITY",
    "frequency": 1.8,
    "description": "High threat sensitivity; responds to \"things are getting worse\" messaging. Swings based on which party seems more threatening. No coherent ideology.",
    "examples": "Anxious swing voters in Rust Belt",
    "ontLevel": "Low",
    "baseId": null,
    "traits": {
      "ZS": {
        "pos": [
          50,
          100
        ],
        "sal": [
          55,
          85
        ]
      },
      "ONT_H": {
        "pos": [
          0,
          50
        ],
        "sal": [
          50,
          80
        ]
      },
      "ONT_S": {
        "pos": [
          0,
          55
        ],
        "sal": [
          50,
          80
        ]
      },
      "PF": {
        "pos": [
          25,
          75
        ],
        "sal": [
          45,
          75
        ]
      },
      "ENG": {
        "pos": [
          45,
          80
        ],
        "sal": [
          50,
          80
        ]
      }
    },
    "antiTraits": {
      "MAT": [
        45,
        55
      ],
      "CD": [
        43,
        57
      ],
      "ENG": [
        35,
        44
      ]
    }
  }
];

// ============================================================================
// MATCHING FUNCTIONS (from v155/v157 — Bayesian posterior with tier hierarchy)
// ============================================================================

function getBaseArchetypes() {
  return ARCHETYPES.filter(a => a.tier !== 'ONT');
}

function getOntVariants(baseId) {
  return ARCHETYPES.filter(a => a.tier === 'ONT' && a.baseId === baseId);
}

function computeArchetypeFitScore(profile, archetype) {
  const traits = archetype.traits || {};
  let fitScore = 1;
  let hardFail = false;

  // Scale decay constants by trait count so high-trait archetypes aren't
  // obliterated by compound exponential decay (Phase 4 fix)
  const traitCount = Object.keys(traits).length;
  const posDecayConstant = 25 + Math.max(0, (traitCount - 4) * 5);
  const salDecayConstant = 30 + Math.max(0, (traitCount - 4) * 5);

  for (const [node, spec] of Object.entries(traits)) {
    const profileNode = profile[node];
    if (!profileNode || !spec.pos) continue;

    const position = profileNode.position;
    const salience = profileNode.salience;
    const posMin = spec.pos[0];
    const posMax = spec.pos[1];
    const salMin = spec.sal ? spec.sal[0] : 0;
    const salMax = spec.sal ? spec.sal[1] : 100;
    const salCenter = (salMin + salMax) / 2;
    const isHardConstraint = salCenter > 70;

    // Position matching
    if (position >= posMin && position <= posMax) {
      fitScore *= 1;
    } else {
      const posDistance = position < posMin ? posMin - position : position - posMax;
      if (isHardConstraint && posDistance > 20) hardFail = true;
      fitScore *= Math.exp(-posDistance / posDecayConstant);
    }

    // Salience matching
    if (spec.sal) {
      if (salience >= salMin && salience <= salMax) {
        fitScore *= 1;
      } else {
        const salDistance = salience < salMin ? salMin - salience : salience - salMax;
        fitScore *= Math.exp(-salDistance / salDecayConstant);
        if (isHardConstraint && salDistance > 35) hardFail = true;
      }
    }
  }

  // Anti-trait checking: graded penalty based on penetration depth
  // (replaces binary kill-switch that zeroed fitScore on any violation)
  const antiTraits = archetype.antiTraits || {};
  let antiTraitPenalty = 1.0;
  for (const [node, range] of Object.entries(antiTraits)) {
    const profileNode = profile[node];
    if (!profileNode || typeof profileNode.position !== 'number') continue;
    const position = profileNode.position;
    if (position >= range[0] && position <= range[1]) {
      const rangeWidth = range[1] - range[0];
      const rangeCenter = (range[0] + range[1]) / 2;
      const penetration = 1 - Math.abs(position - rangeCenter) / (rangeWidth / 2);
      // penetration: 0 at edges, 1 at center
      // penalty: 0.3 at edge (mild), ~0.0 at center (severe)
      antiTraitPenalty *= 0.3 * (1 - penetration);
    }
  }
  fitScore *= antiTraitPenalty;
  if (antiTraitPenalty < 0.01) hardFail = true;

  // Trait-count specificity bonus (traitCount already computed above)
  // Increased from 0.05 to 0.08 per trait to help specific archetypes compete
  fitScore *= 1 + Math.max(0, (traitCount - 2) * 0.08);

  // Unexplained intensity penalty — penalize archetypes that leave
  // extreme profile nodes unaccounted for. Increased from 0.12 to 0.18
  // per node so that sparse archetypes (few traits) can't win by ignoring
  // most of a directional profile.
  const archetypeNodes = new Set(Object.keys(traits));
  let unexplainedPenalty = 1.0;
  for (const [node, nodeData] of Object.entries(profile)) {
    if (archetypeNodes.has(node)) continue;
    if (!nodeData || typeof nodeData.position !== 'number') continue;
    const distanceFromCenter = Math.abs(nodeData.position - 50);
    if (distanceFromCenter > 20 && (nodeData.salience || 50) > 55) {
      const extremity = (distanceFromCenter - 20) / 30;
      const salienceWeight = ((nodeData.salience || 50) - 55) / 45;
      unexplainedPenalty *= (1 - 0.18 * extremity * salienceWeight);
    }
  }
  fitScore *= unexplainedPenalty;

  if (hardFail) return { fitScore: 0, hardFail: true };
  return { fitScore, hardFail: false, traitCount, specificityBonus: 1 + Math.max(0, (traitCount - 2) * 0.05), unexplainedPenalty };
}

function findBestArchetype(profile, options = {}) {
  const { deterministic = true } = options;
  const baseArchetypes = getBaseArchetypes();

  const TIER_CONFIG = {
    'T1':     { priority: 1, minFit: 0.40, minSalience: 45 },
    'MEANS':  { priority: 2, minFit: 0.35, minSalience: 40 },
    'T2':     { priority: 3, minFit: 0.15, minSalience: 30 },
    'GATE':   { priority: 4, minFit: 0.08, minSalience: 0  },
    'ONT':    { priority: 5, minFit: 0.05, minSalience: 0  },
    'REALITY':{ priority: 3, minFit: 0.20, minSalience: 30 }
  };

  const salienceValues = Object.values(profile).map(n => n.salience || 0);
  const avgSalience = salienceValues.length > 0
    ? salienceValues.reduce((a, b) => a + b, 0) / salienceValues.length : 0;

  const allScored = baseArchetypes.map(arch => {
    const { fitScore, hardFail } = computeArchetypeFitScore(profile, arch);
    if (hardFail) return { arch, probability: 0, fitScore: 0, prior: arch.frequency / 100, tier: arch.tier };
    const prior = arch.frequency / 100;
    return { arch, probability: prior * fitScore, fitScore, prior, tier: arch.tier };
  });

  let eligibleArchetypes = [];
  let highTierBest = 0;
  const tierOrder = ['T1', 'MEANS', 'T2', 'REALITY', 'GATE'];
  for (const tier of tierOrder) {
    const config = TIER_CONFIG[tier] || { minFit: 0.15, minSalience: 0 };
    if (avgSalience < config.minSalience) continue;
    const tierArchetypes = allScored.filter(p => p.tier === tier && p.fitScore >= config.minFit && p.probability > 0);
    if (tierArchetypes.length > 0) {
      const tierBest = Math.max(...tierArchetypes.map(a => a.fitScore));
      if (eligibleArchetypes.length === 0) {
        // First tier with matches — use all of them
        eligibleArchetypes = tierArchetypes;
        highTierBest = tierBest;
      } else {
        // Lower tier: only include if best score >= 70% of higher tier's best
        const threshold = highTierBest * 0.70;
        const strongLowerTier = tierArchetypes.filter(a => a.fitScore >= threshold);
        eligibleArchetypes = eligibleArchetypes.concat(strongLowerTier);
      }
    }
  }

  if (eligibleArchetypes.length === 0) eligibleArchetypes = allScored.filter(p => p.probability > 0);
  if (eligibleArchetypes.length === 0) { eligibleArchetypes = allScored; eligibleArchetypes.forEach(p => p.probability = 1); }

  const totalProb = eligibleArchetypes.reduce((sum, p) => sum + p.probability, 0);
  eligibleArchetypes.forEach(p => p.normalizedProb = totalProb > 0 ? p.probability / totalProb : 1 / eligibleArchetypes.length);

  eligibleArchetypes.sort((a, b) => b.probability - a.probability);
  let selectedArch = eligibleArchetypes[0]?.arch || baseArchetypes[0];
  let selectedProb = eligibleArchetypes[0]?.normalizedProb || 0;

  // ONT variant resolution
  const ontVariants = getOntVariants(selectedArch.id);
  if (ontVariants.length > 0) {
    const ontS = profile.ONT_S ? profile.ONT_S.position : 50;
    const variant = ontVariants.find(v => v.ontLevel === (ontS > 60 ? 'High' : 'Low'));
    if (variant) {
      const { fitScore: vFit, hardFail: vFail } = computeArchetypeFitScore(profile, variant);
      if (!vFail && vFit >= 0.08) {
        return { archetype: variant, score: vFit * 100, baseArchetype: selectedArch, matchConfidence: vFit };
      }
    }
  }

  return { archetype: selectedArch, score: selectedProb * 100, baseArchetype: null, matchConfidence: selectedProb };
}

function findTopArchetypes(profile, options = {}) {
  const { maxResults = 3, minFitScore = 0.5, minRelativeScore = 0.6 } = options;
  const baseArchetypes = getBaseArchetypes();

  const scores = baseArchetypes.map(arch => {
    const { fitScore, hardFail } = computeArchetypeFitScore(profile, arch);
    if (hardFail) return { arch, fitScore: 0, posterior: 0 };
    const prior = arch.frequency / 100;
    return { arch, fitScore, posterior: prior * fitScore, prior };
  }).filter(s => s.fitScore > 0)
    .sort((a, b) => b.posterior - a.posterior);

  if (scores.length === 0) return { matches: [], primary: null };

  const bestFitScore = Math.max(...scores.map(s => s.fitScore));
  const strongMatches = scores.filter(s =>
    s.fitScore >= minFitScore && s.fitScore >= bestFitScore * minRelativeScore
  ).slice(0, maxResults);

  const resolvedMatches = strongMatches.map(s => {
    const ontVariants = getOntVariants(s.arch.id);
    let finalArch = s.arch;
    let finalFitScore = s.fitScore;

    if (ontVariants.length > 0) {
      const ontS = profile.ONT_S ? profile.ONT_S.position : 50;
      const variant = ontVariants.find(v => v.ontLevel === (ontS > 60 ? 'High' : 'Low'));
      if (variant) {
        const { fitScore: vFit, hardFail: vFail } = computeArchetypeFitScore(profile, variant);
        if (!vFail && vFit >= 0.08) { finalArch = variant; finalFitScore = vFit; }
      }
    }

    return {
      archetype: finalArch,
      baseArchetype: finalArch !== s.arch ? s.arch : null,
      fitScore: finalFitScore,
      posterior: s.posterior,
      matchPercent: Math.round(finalFitScore * 100)
    };
  });

  return { matches: resolvedMatches, primary: resolvedMatches[0] || null, hasMultiple: resolvedMatches.length > 1 };
}

if (typeof module !== "undefined") module.exports = { ARCHETYPES, getBaseArchetypes, getOntVariants, computeArchetypeFitScore, findTopArchetypes, findBestArchetype };