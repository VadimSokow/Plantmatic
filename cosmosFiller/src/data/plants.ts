import {user} from "./user";

export type Plant = {
    id: string
    userId: string
    name: string
    latName: string
}

export const plants: Plant[] = [
    {
        id: "plant-1",
        userId: user,
        name: "Grüner Freund",
        latName: "Monstera deliciosa"
    },
    {
        id: "plant-2",
        userId: user,
        name: "Blattwerk",
        latName: "Sansevieria trifasciata"
    },
    {
        id: "plant-3",
        userId: user,
        name: "Hängefee",
        latName: "Pothos epipremnum aureum"
    },
    {
        id: "plant-4",
        userId: user,
        name: "Weiße Blüte",
        latName: "Spathiphyllum wallisii"
    },
    {
        id: "plant-5",
        userId: user,
        name: "Baumfreund",
        latName: "Ficus lyrata"
    },
    {
        id: "plant-6",
        userId: user,
        name: "Wüstenkönigin",
        latName: "Aloe vera"
    },
    {
        id: "plant-7",
        userId: user,
        name: "Küchenwürze",
        latName: "Rosmarinus officinalis"
    },
    {
        id: "plant-8",
        userId: user,
        name: "Minzduft",
        latName: "Mentha spicata"
    },
    {
        id: "plant-9",
        userId: user,
        name: "Dschungelstar",
        latName: "Monstera deliciosa"
    },
    {
        id: "plant-10",
        userId: user,
        name: "Säulenwächter",
        latName: "Sansevieria trifasciata"
    },
    {
        id: "plant-11",
        userId: user,
        name: "Ampelpflanze",
        latName: "Pothos epipremnum aureum"
    },
    {
        id: "plant-12",
        userId: user,
        name: "Friedliche Seele",
        latName: "Spathiphyllum wallisii"
    },
    {
        id: "plant-13",
        userId: user,
        name: "Großes Blatt",
        latName: "Ficus lyrata"
    },
    {
        id: "plant-14",
        userId: user,
        name: "Heilkraut",
        latName: "Aloe vera"
    },
    {
        id: "plant-15",
        userId: user,
        name: "Mediterraner Traum",
        latName: "Rosmarinus officinalis"
    },
    {
        id: "plant-16",
        userId: user,
        name: "Frischekick",
        latName: "Mentha spicata"
    }
];