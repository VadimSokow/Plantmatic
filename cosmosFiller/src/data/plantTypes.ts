export type PlantType = {
    latname: string
    commonName: string
    description: string
    configFields: Array<{
        fieldName: string
        unit: string
        description: string
        defaultValue: number
    }>
}

export const plantTypes: PlantType[] = [
    {
        latname: "Monstera deliciosa",
        commonName: "Fensterblatt",
        description: "Eine beliebte Zimmerpflanze mit großen, gelappten Blättern, die Löcher entwickeln. Sie bevorzugt helles, indirektes Licht und mäßige Bewässerung.",
        configFields: [
            {
                fieldName: "minTemperature",
                unit: "celsius",
                description: "Minimum temperature for Monstera",
                defaultValue: 18
            },
            {
                fieldName: "maxTemperature",
                unit: "celsius",
                description: "Maximum temperature for Monstera",
                defaultValue: 28
            },
            {
                fieldName: "minSoilMoisture",
                unit: "percent",
                description: "Minimum soil moisture for Monstera",
                defaultValue: 40
            },
            {
                fieldName: "maxSoilMoisture",
                unit: "percent",
                description: "Maximum soil moisture for Monstera",
                defaultValue: 70
            }
        ]
    },
    {
        latname: "Sansevieria trifasciata",
        commonName: "Bogenhanf",
        description: "Eine pflegeleichte Zimmerpflanze mit aufrechten, schwertförmigen Blättern. Sie ist sehr trockenheitstolerant und ideal für Anfänger.",
        configFields: [
            {
                fieldName: "minTemperature",
                unit: "celsius",
                description: "Minimum temperature for Snake Plant",
                defaultValue: 10
            },
            {
                fieldName: "maxTemperature",
                unit: "celsius",
                description: "Maximum temperature for Snake Plant",
                defaultValue: 35
            },
            {
                fieldName: "minSoilMoisture",
                unit: "percent",
                description: "Minimum soil moisture for Snake Plant",
                defaultValue: 20
            },
            {
                fieldName: "maxSoilMoisture",
                unit: "percent",
                description: "Maximum soil moisture for Snake Plant",
                defaultValue: 50
            }
        ]
    },
    {
        latname: "Pothos epipremnum aureum",
        commonName: "Efeutute",
        description: "Eine robuste Rankpflanze mit herzförmigen Blättern. Sie ist sehr anpassungsfähig und verträgt verschiedene Lichtverhältnisse.",
        configFields: [
            {
                fieldName: "minTemperature",
                unit: "celsius",
                description: "Minimum temperature for Pothos",
                defaultValue: 15
            },
            {
                fieldName: "maxTemperature",
                unit: "celsius",
                description: "Maximum temperature for Pothos",
                defaultValue: 30
            },
            {
                fieldName: "minSoilMoisture",
                unit: "percent",
                description: "Minimum soil moisture for Pothos",
                defaultValue: 30
            },
            {
                fieldName: "maxSoilMoisture",
                unit: "percent",
                description: "Maximum soil moisture for Pothos",
                defaultValue: 60
            }
        ]
    },
    {
        latname: "Spathiphyllum wallisii",
        commonName: "Friedenslilie",
        description: "Eine elegante Zimmerpflanze mit glänzenden Blättern und weißen Blüten. Sie ist bekannt für ihre luftreinigenden Eigenschaften.",
        configFields: [
            {
                fieldName: "minTemperature",
                unit: "celsius",
                description: "Minimum temperature for Peace Lily",
                defaultValue: 18
            },
            {
                fieldName: "maxTemperature",
                unit: "celsius",
                description: "Maximum temperature for Peace Lily",
                defaultValue: 27
            },
            {
                fieldName: "minSoilMoisture",
                unit: "percent",
                description: "Minimum soil moisture for Peace Lily",
                defaultValue: 50
            },
            {
                fieldName: "maxSoilMoisture",
                unit: "percent",
                description: "Maximum soil moisture for Peace Lily",
                defaultValue: 80
            }
        ]
    },
    {
        latname: "Ficus lyrata",
        commonName: "Geigenfeige",
        description: "Eine auffällige Zimmerpflanze mit großen, geigenförmigen Blättern. Sie benötigt helles Licht und eine konstante Feuchtigkeit.",
        configFields: [
            {
                fieldName: "minTemperature",
                unit: "celsius",
                description: "Minimum temperature for Fiddle-leaf Fig",
                defaultValue: 18
            },
            {
                fieldName: "maxTemperature",
                unit: "celsius",
                description: "Maximum temperature for Fiddle-leaf Fig",
                defaultValue: 29
            },
            {
                fieldName: "minSoilMoisture",
                unit: "percent",
                description: "Minimum soil moisture for Fiddle-leaf Fig",
                defaultValue: 40
            },
            {
                fieldName: "maxSoilMoisture",
                unit: "percent",
                description: "Maximum soil moisture for Fiddle-leaf Fig",
                defaultValue: 70
            }
        ]
    },
    {
        latname: "Aloe vera",
        commonName: "Echte Aloe",
        description: "Eine Sukkulente mit fleischigen Blättern, die für ihre medizinischen Eigenschaften bekannt ist. Sie bevorzugt viel Sonnenlicht und wenig Wasser.",
        configFields: [
            {
                fieldName: "minTemperature",
                unit: "celsius",
                description: "Minimum temperature for Aloe Vera",
                defaultValue: 13
            },
            {
                fieldName: "maxTemperature",
                unit: "celsius",
                description: "Maximum temperature for Aloe Vera",
                defaultValue: 30
            },
            {
                fieldName: "minSoilMoisture",
                unit: "percent",
                description: "Minimum soil moisture for Aloe Vera",
                defaultValue: 10
            },
            {
                fieldName: "maxSoilMoisture",
                unit: "percent",
                description: "Maximum soil moisture for Aloe Vera",
                defaultValue: 30
            }
        ]
    },
    {
        latname: "Rosmarinus officinalis",
        commonName: "Rosmarin",
        description: "Ein aromatisches Kraut, das in der Küche und als Zierpflanze verwendet wird. Er benötigt viel Sonne und gut durchlässigen Boden.",
        configFields: [
            {
                fieldName: "minTemperature",
                unit: "celsius",
                description: "Minimum temperature for Rosemary",
                defaultValue: 5
            },
            {
                fieldName: "maxTemperature",
                unit: "celsius",
                description: "Maximum temperature for Rosemary",
                defaultValue: 25
            },
            {
                fieldName: "minSoilMoisture",
                unit: "percent",
                description: "Minimum soil moisture for Rosemary",
                defaultValue: 25
            },
            {
                fieldName: "maxSoilMoisture",
                unit: "percent",
                description: "Maximum soil moisture for Rosemary",
                defaultValue: 55
            }
        ]
    },
    {
        latname: "Mentha spicata",
        commonName: "Grüne Minze",
        description: "Eine beliebte Minzart mit frischem, süßem Geschmack. Sie wächst schnell und benötigt feuchten Boden und etwas Sonne.",
        configFields: [
            {
                fieldName: "minTemperature",
                unit: "celsius",
                description: "Minimum temperature for Spearmint",
                defaultValue: 10
            },
            {
                fieldName: "maxTemperature",
                unit: "celsius",
                description: "Maximum temperature for Spearmint",
                defaultValue: 28
            },
            {
                fieldName: "minSoilMoisture",
                unit: "percent",
                description: "Minimum soil moisture for Spearmint",
                defaultValue: 60
            },
            {
                fieldName: "maxSoilMoisture",
                unit: "percent",
                description: "Maximum soil moisture for Spearmint",
                defaultValue: 90
            }
        ]
    }
];