# El Pollo Loco

**Ein 2D Jump & Run Browsergame — entwickelt mit HTML, CSS und Vanilla JavaScript.**

[➡ Live ansehen](https://elpolloloco.andreas-kissner.cloud/)

---

## Über das Spiel

El Pollo Loco ist ein selbst entwickeltes Browsergame ohne externe Frameworks oder Libraries. Der Spieler steuert Pepe durch ein scrollendes Level, sammelt Items, weicht Gegnern aus und besiegt am Ende den Endboss.

---

## Features

**Gameplay**
- Vollständiges 2D-Canvas-Spiel mit eigener Game-Loop-Struktur
- Spielercharakter mit Lauf-, Sprung-, Hurt- und Idle-Animationen
- Gegner: Chickens, Mini-Chickens und ein Endboss
- Flaschenwurf mit Flug-, Rotations- und Zersplitterungsanimation
- Coin- und Bottle-Sammelsystem
- Plattformen für vertikalen Levelaufbau

**UI & Sound**
- Statusbars für Gesundheit, Coins, Bottles und Endboss-Leben
- Schnittszenen (Cutscenes) mit Videounterstützung
- Soundmanager für Musik und Soundeffekte
- Vollbildmodus

**Steuerung**
- Touch-Steuerung für mobile Geräte (On-Screen Buttons)
- Keyboard-Steuerung für Desktop

---

## Steuerung

### Desktop

| Taste | Aktion |
|---|---|
| `←` / `→` | Bewegen |
| `↑` oder `Space` | Springen |
| `D` | Flasche werfen |

### Mobile

On-Screen Buttons für Laufen, Springen und Werfen.

---

## Ziel des Spiels

Sammle Flaschen und Coins, weiche Gegnern aus oder besiege sie. Sobald Pepe den hinteren Bereich des Levels erreicht, wird der Endboss aktiviert. Nach dem Bosskampf endet das Spiel mit einer Cutscene.

---

## Installation & Start

Keine Installation nötig.

1. Repository herunterladen oder clonen:
   ```bash
   git clone https://github.com/AndreasKissner/Gib-Nicht-auf.git
   ```
2. `index.html` im Browser öffnen — fertig.

---

## Projektstruktur

```
El-Pollo-Loco/
├── index.html              # Einstiegspunkt
├── style.css               # Layout, Touch-Buttons, UI
├── img/                    # Grafiken, Spritesheets, Animationen
├── audio/                  # Sounds und Hintergrundmusik
└── js/
    ├── models/             # Klassen für Charaktere, Gegner, Objekte
    ├── world/              # World- und Game-Logik
    └── ui/                 # Statusbars, Touch-Buttons, Video-System
```

---

## Technologien

| Technologie | Verwendung |
|---|---|
| HTML5 Canvas | Spielrendering |
| CSS3 | Layout & UI |
| Vanilla JavaScript | Spiellogik, OOP |

---

## Hinweise

- Läuft in allen modernen Browsern
- Keine externen Libraries oder Frameworks verwendet
- Mobile-optimiert mit eigener Touch-Steuerung
