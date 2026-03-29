# Benutzerhandbuch – Olympia 2026 Ergebnisverwaltungssystem

**Version:** 1.0
**Stand:** März 2026

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Systemzugang & Authentifizierung](#2-systemzugang--authentifizierung)
3. [Öffentlicher Bereich](#3-öffentlicher-bereich)
4. [Kampfrichter-Bereich](#4-kampfrichter-bereich)
5. [Administrator-Bereich](#5-administrator-bereich)
6. [Ergebnis-Workflow](#6-ergebnis-workflow)
7. [Mehrsprachigkeit](#7-mehrsprachigkeit)
8. [Technische Informationen](#8-technische-informationen)

---

## 1. Projektübersicht

Das **Olympia 2026 Ergebnisverwaltungssystem** ist eine mehrsprachige Webanwendung zur Erfassung, Genehmigung und Veröffentlichung von Wettkampfergebnissen der Milano-Cortina 2026 Olympischen Winterspiele.

### Benutzerrollen

| Rolle | Zugang | Beschreibung |
|-------|--------|--------------|
| **Öffentlicher Besucher** | Ohne Anmeldung | Veröffentlichte Ergebnisse, Medaillenspiegel, Sportler- und Länderdaten einsehen |
| **Kampfrichter (Judge)** | Mit Anmeldung + 2FA | Ergebnisse erfassen, einreichen und gegenseitig prüfen |
| **Administrator** | Mit Anmeldung + 2FA | Vollzugriff auf alle Bereiche, Benutzerverwaltung, Systemkonfiguration |

### Unterstützte Sprachen

- Deutsch (`/de/`)
- Bairisch-Deutsch / Boarisch (`/de-BA/`)
- Englisch (`/en-GB/`)
- Französisch (`/fr-FR/`)

Die Sprache wird automatisch anhand der Browsereinstellungen gewählt und kann jederzeit über den Sprachschalter in der Fußzeile geändert werden.

---

## 2. Systemzugang & Authentifizierung

### 2.1 Anmeldung

1. Rufen Sie die Seite `/de/login` auf.
2. Geben Sie Ihre **E-Mail-Adresse** und Ihr **Passwort** ein.
3. Klicken Sie auf **Anmelden**.

> **Hinweis:** Nach 5 fehlgeschlagenen Anmeldeversuchen wird das Konto für 15 Minuten gesperrt.

### 2.2 Zwei-Faktor-Authentifizierung (2FA)

Kampfrichter und Administratoren **müssen** die Zwei-Faktor-Authentifizierung (TOTP) einrichten, bevor sie auf ihren Bereich zugreifen können.

**Erstmalige Einrichtung:**

1. Nach der ersten Anmeldung werden Sie zur 2FA-Einrichtungsseite weitergeleitet.
2. Scannen Sie den QR-Code mit einer Authenticator-App (z. B. Google Authenticator, Authy).
3. Geben Sie den sechsstelligen Code aus der App ein, um die Einrichtung abzuschließen.

**Tägliche Anmeldung mit 2FA:**

1. E-Mail und Passwort eingeben → Sie erhalten ein temporäres Token.
2. Auf der 2FA-Seite den aktuellen Code aus der Authenticator-App eingeben.
3. Sie sind nun angemeldet.

### 2.3 Passwort zurücksetzen

1. Klicken Sie auf der Anmeldeseite auf **Passwort vergessen**.
2. Geben Sie Ihre E-Mail-Adresse ein.
3. Sie erhalten eine E-Mail mit einem Link zum Zurücksetzen des Passworts.
4. Folgen Sie dem Link und legen Sie ein neues Passwort fest.

### 2.4 Abmelden

Klicken Sie in der Navigation oder im Profil-Menü auf **Abmelden**. Ihre Sitzung wird beendet und das Refresh-Token wird ungültig gemacht.

---

## 3. Öffentlicher Bereich

Der öffentliche Bereich ist ohne Anmeldung zugänglich und bietet Besuchern alle relevanten Informationen zu den Wettkämpfen.

### 3.1 Startseite (`/de/`)

Die Startseite bietet:

- **Suchfeld**: Schnellsuche nach Sportlern, Ländern, Sportarten und Veranstaltungen.
- **Live-Ergebnisse**: Vorschau der aktuellsten Wettkampfergebnisse.
- **Medaillenspiegel**: Die Top-10-Nationen nach Goldmedaillen.
- **Highlights**: Links zu besonderen Momenten der Spiele.

### 3.2 Ergebnisse (`/de/results`)

Die Ergebnisseite zeigt alle veröffentlichten Wettkampfergebnisse.

**Filtermöglichkeiten:**

| Filter | Beschreibung |
|--------|--------------|
| Sportart | Alle Ergebnisse einer bestimmten Sportart anzeigen |
| Land | Ergebnisse nach Nationalkennzeichen filtern |
| Datum | Ergebnisse eines bestimmten Wettkampftages anzeigen |
| Suche | Freitextsuche nach Sportlername, Veranstaltung, Sportart oder Land |

Die Ergebnisse werden seitenweise angezeigt (20 pro Seite). Über die Seitennavigation unten kann zwischen den Seiten gewechselt werden.

**Ergebnisdetail (`/de/results/{id}`):**

Ein Klick auf eine Tabellenzeile öffnet die Detailansicht mit:

- Rang und Medaille (Gold, Silber, Bronze mit SVG-Abzeichen)
- Erzielte Leistung (Wert und Einheit)
- Sportlerinformationen (Name, Land)
- Veranstaltungsinformationen (Name, Datum, Ort, Sportart)
- Weitere Ergebnisse derselben Veranstaltung (paginiert)

### 3.3 Medaillenspiegel (`/de/medals`)

Zeigt die Medaillenrangliste aller teilnehmenden Nationen:

- Sortierung nach Goldmedaillen (olympische Wertungsregel)
- Anzeige von Gold-, Silber- und Bronzemedaillen
- Klick auf ein Land öffnet die Länderdetailseite

**Länderdetail (`/de/medals/{countryCode}`):**

- Gesamtübersicht der Medaillen
- Liste der medaillengewinnenden Ergebnisse mit Links zu Details

### 3.4 Sportarten (`/de/sports`)

Übersicht aller 15 Olympischen Wintersportarten:

- Suchfeld für Sportarten
- Anzahl der Disziplinen und Medaillen pro Sport
- Klick auf eine Sportart öffnet die Detailseite

**Sportdetail (`/de/sports/{sport}`):**

- Beschreibung der Sportart
- Liste aller Wettkämpfe mit Status (Geplant, Live, Final)
- **Ergebnisse**-Button bei laufenden oder abgeschlossenen Wettkämpfen → öffnet gefilterte Ergebnisliste für diesen Wettkampf

### 3.5 Nationen (`/de/nations`)

Liste aller teilnehmenden Länder mit:

- Länderflaggen und -namen
- Klick öffnet das Länderprofil

**Länderprofil (`/de/nations/{countryCode}`):**

- Medaillenübersicht
- Top-Sportler des Landes
- Medaillenzeitstrahl

### 3.6 Sportlerprofil (`/de/athletes/{id}`)

- Name, Nationalität, Geburtsdatum, Alter
- Disziplinen
- Alle veröffentlichten Ergebnisse des Sportlers

---

## 4. Kampfrichter-Bereich

Der Kampfrichter-Bereich ist ausschließlich für angemeldete Kampfrichter (und Administratoren) zugänglich.

### 4.1 Dashboard (`/de/judge/dashboard`)

Das Dashboard zeigt eine Übersicht der eigenen Aktivitäten:

| Kennzahl | Beschreibung |
|----------|--------------|
| Entwürfe | Noch nicht eingereichte Ergebnisse |
| Zur Prüfung | Eingereichte Ergebnisse, die auf Genehmigung warten |
| Veröffentlicht | Genehmigte und veröffentlichte Ergebnisse |
| Einsprüche | Eingelegte Einsprüche gegen veröffentlichte Ergebnisse |
| Ungültig | Als ungültig markierte Ergebnisse |

Außerdem werden direkt auf dem Dashboard die aktuellen **Entwürfe** und die **Prüfwarteschlange** angezeigt.

### 4.2 Eigene Ergebnisse (`/de/judge/results`)

Liste aller eigenen Ergebnisse mit Statusfilter:

- **Entwurf**: In Bearbeitung, noch nicht eingereicht
- **Zur Prüfung**: Eingereicht, wartet auf Genehmigung
- **Veröffentlicht**: Durch zwei Prüfer genehmigt
- **Abgelehnt**: Vom Prüfer zurückgewiesen
- **Ungültig**: Als ungültig markiert
- **Einspruch**: Einspruch gegen das veröffentlichte Ergebnis wurde eingereicht

### 4.3 Neues Ergebnis erfassen (`/de/judge/results/new`)

Ergebnisse werden in einem mehrstufigen Formular erfasst:

**Schritt 1: Veranstaltung auswählen**
- Über das Suchfeld die Sportart oder Disziplin eingeben
- Aus der Dropdown-Liste eine Veranstaltung auswählen

**Schritt 2: Sportler auswählen**
- Name des Sportlers eingeben (Dropdown erscheint nach Eingabe der ersten Zeichen oder bei Klick ins Feld)
- Sportler aus der Liste auswählen

**Schritt 3: Ergebnis eingeben**
- Formularfelder gemäß dem Sport-Template ausfüllen (z. B. Zeit, Punkte, Weite)
- Rang eingeben (optional)
- Medaille auswählen (Gold / Silber / Bronze / Keine)

**Schritt 4: Überprüfen und speichern**
- Eingaben prüfen
- **Entwurf speichern**: Ergebnis bleibt als Entwurf, kann später bearbeitet werden
- **Einreichen**: Ergebnis wird zur Prüfung eingereicht (Status wechselt zu „Zur Prüfung")

> **Hinweis:** Gespeicherte Entwürfe können jederzeit unter „Meine Ergebnisse" → Entwurf weiterbearbeitet werden.

### 4.4 Ergebnis bearbeiten (`/de/judge/results/{id}/edit`)

Nur Ergebnisse im Status **Entwurf** oder **Abgelehnt** können bearbeitet werden. Alle Änderungen werden in der Versionshistorie festgehalten.

### 4.5 Ergebnisdetail (`/de/judge/results/{id}`)

- Vollständige Ergebnisdetails
- **Versionshistorie**: Alle Änderungen mit Zeitstempel und ausführender Person
- **Einspruch einlegen**: Gegen veröffentlichte Ergebnisse kann ein Einspruch mit Begründung eingereicht werden

### 4.6 Prüfwarteschlange (`/de/judge/review`)

Liste aller von anderen Kampfrichtern eingereichten Ergebnisse, die auf Prüfung warten.

**Vieraugenprinzip:**

- Jedes Ergebnis muss von **zwei verschiedenen** Kampfrichtern genehmigt werden.
- Der Kampfrichter, der das Ergebnis eingereicht hat, darf **nicht** einer der Prüfer sein.
- Bei der ersten Genehmigung durch einen Prüfer wechselt der Status zu „Erste Genehmigung".
- Nach der zweiten Genehmigung durch einen anderen Prüfer wird das Ergebnis **veröffentlicht**.

**Prüfdetail (`/de/judge/review/{id}`):**

Anzeige aller relevanten Informationen:

- Ergebnisdetails (Sportler, Veranstaltung, Leistung)
- Eingereicht von (Name des Kampfrichters)
- Eingereicht am (Zeitstempel)
- **Genehmigen**: Ergebnis bestätigen → bei zweiter Genehmigung sofort veröffentlicht
- **Ablehnen**: Ergebnis mit Begründung zurückweisen → Status wechselt zu „Abgelehnt"

---

## 5. Administrator-Bereich

Der Administrator-Bereich ist ausschließlich für Administratoren zugänglich und bietet vollständige Kontrolle über das System.

### 5.1 Dashboard (`/de/admin/dashboard`)

Systemübersicht mit:

- Gesamtanzahl Benutzer / aktive Kampfrichter
- Anzahl ausstehender Ergebnisse / offener Einsprüche
- **Warnungen**: Anzeige von verdächtigen Force-Publish-Aktionen

### 5.2 Benutzerverwaltung (`/de/admin/users`)

#### Benutzer anlegen

1. Klicken Sie auf **Neuer Benutzer**.
2. Geben Sie E-Mail-Adresse und Rolle (Kampfrichter oder Administrator) ein.
3. Das System generiert ein temporäres Passwort, das dem Benutzer mitgeteilt werden muss.
4. Der Benutzer muss beim ersten Login die 2FA einrichten.

#### Benutzer bearbeiten

- E-Mail-Adresse und Rolle können geändert werden.
- Änderungen werden im Audit-Log festgehalten.

#### Konto sperren / entsperren

- **Sperren**: Konto sofort sperren und alle aktiven JWT-Token ungültig machen. Der Benutzer kann sich nicht mehr anmelden.
- **Entsperren**: Gesperrtes Konto wieder aktivieren.

#### Vertretungsrechte (Delegation)

Temporäre Prüferrechte können an Benutzer vergeben werden:

1. Benutzerdetail öffnen (`/de/admin/users/{id}`)
2. **Vertretung vergeben** klicken
3. Zeitraum und Berechtigungsumfang festlegen
4. Mit **Vertretung entziehen** können die Rechte wieder entzogen werden

### 5.3 Ergebnisverwaltung (`/de/admin/results`)

Der Administrator hat Zugriff auf **alle** Ergebnisse, unabhängig vom Status oder Kampfrichter.

#### Filteroptionen

- Status (Entwurf, Zur Prüfung, Veröffentlicht, Ungültig, Einspruch)
- Sportart, Land, Datum
- Freitextsuche

#### Ergebnisdetail (`/de/admin/results/{id}`)

Zusätzliche Admin-Aktionen:

| Aktion | Beschreibung | Voraussetzung |
|--------|--------------|---------------|
| **Force-Publish** | Ergebnis ohne Prüfprozess sofort veröffentlichen | Ergebnis im Status „Zur Prüfung" |
| **Wiederherstellen** | Ungültiges Ergebnis auf „Veröffentlicht" zurücksetzen | Ergebnis im Status „Ungültig" |
| **Endgültig löschen** | Ergebnis permanent aus der Datenbank entfernen | Nur im Wartungsmodus, Begründung ≥ 10 Zeichen erforderlich |

> **Warnung:** Die endgültige Löschung ist **nicht umkehrbar** und erfordert die Eingabe des Bestätigungstexts. Diese Aktion ist nur im Wartungsmodus des Systems verfügbar.

### 5.4 Sport-Templates (`/de/admin/templates`)

Sport-Templates definieren die Eingabefelder für Ergebnisse einer bestimmten Sportart.

#### Template erstellen

1. **Neues Template** klicken.
2. Sportart auswählen.
3. Felder hinzufügen:
   - **Feldname**: Bezeichnung des Felds (z. B. „Zeit", „Punkte")
   - **Feldtyp**: Text / Zahl / Zeit (HH:MM:SS.ms) / Dropdown
   - **Pflichtfeld**: Ja/Nein
4. Template speichern.

#### Template bearbeiten (`/de/admin/templates/{id}/edit`)

- Jede Änderung erstellt automatisch eine neue **Version** des Templates.
- Bestehende Ergebnisse behalten die Version, mit der sie erstellt wurden.
- Die aktuelle Version wird für alle neuen Ergebniserfassungen verwendet.

### 5.5 Audit-Log (`/de/admin/audit`)

Vollständiges Protokoll aller Systemaktionen:

**Filteroptionen:**

- Benutzer (wer hat die Aktion ausgeführt)
- Aktion (z. B. Login, Ergebnis erstellt, Benutzer gesperrt)
- Entitätstyp (Ergebnis, Benutzer, Template, usw.)
- Datumsbereich

**CSV-Export:**

Klicken Sie auf **Exportieren**, um das gefilterte Audit-Log als CSV-Datei herunterzuladen.

### 5.6 Medaillen-Assets (`/de/admin/assets`)

Verwalten der SVG-Grafiken für Gold-, Silber- und Bronzemedaillen:

1. Klicken Sie bei der gewünschten Medaille auf **Hochladen**.
2. Wählen Sie eine SVG-Datei aus.
3. Das Asset wird sofort im System aktiv und in allen Ergebnisanzeigen verwendet.

> **Hinweis:** Es werden ausschließlich SVG-Dateien akzeptiert.

### 5.7 Athletenverwaltung (`/de/admin/athletes`)

#### Sportler anlegen

1. **Neuer Sportler** klicken.
2. Name, Nationalität und Geburtsdatum eingeben.
3. Disziplinen zuweisen.
4. Speichern.

#### Sportler bearbeiten / löschen

- Alle Felder können bearbeitet werden.
- Beim Löschen wird der Sportler **soft-deleted** (logisch gelöscht, bleibt in der Datenbank mit Zeitstempel erhalten).

---

## 6. Ergebnis-Workflow

### 6.1 Normaler Ablauf

```
Kampfrichter erstellt Ergebnis
         ↓
    [ENTWURF]
         ↓ (einreichen)
  [ZUR PRÜFUNG]
         ↓ (1. Prüfer genehmigt)
[ERSTE GENEHMIGUNG]
         ↓ (2. anderer Prüfer genehmigt)
   [VERÖFFENTLICHT]
```

### 6.2 Ablehnungsablauf

```
  [ZUR PRÜFUNG]
         ↓ (Prüfer lehnt ab mit Begründung)
    [ABGELEHNT]
         ↓ (Kampfrichter bearbeitet und reicht erneut ein)
  [ZUR PRÜFUNG]
```

### 6.3 Einspruchsablauf

```
 [VERÖFFENTLICHT]
         ↓ (Kampfrichter legt Einspruch ein)
[EINSPRUCH EINGEREICHT]
         ↓ (Admin entscheidet)
  [VERÖFFENTLICHT] oder [UNGÜLTIG]
```

### 6.4 Admin-Override

Administratoren können den normalen Workflow umgehen:

- **Force-Publish**: Ergebnis direkt veröffentlichen (wird im Audit-Log als Admin-Override vermerkt und im Dashboard als Warnung angezeigt).
- **Wiederherstellen**: Ungültiges Ergebnis wieder veröffentlichen.
- **Endgültig löschen**: Ergebnis permanent entfernen (nur im Wartungsmodus).

---

## 7. Mehrsprachigkeit

### Sprache wechseln

- In der **Fußzeile** befindet sich ein Sprachschalter.
- Die Sprache ist Teil der URL (z. B. `/de/results`, `/en-GB/results`).
- Beim Wechsel der Sprache bleiben Sie auf der aktuellen Seite.

### Verfügbare Sprachen

| Kürzel | Sprache | URL-Pfad |
|--------|---------|----------|
| de | Deutsch | `/de/` |
| de-BA | Bairisch-Deutsch / Boarisch | `/de-BA/` |
| en-GB | Englisch (Britisch) | `/en-GB/` |
| fr-FR | Französisch | `/fr-FR/` |

---

## 8. Technische Informationen

### 8.1 Systemarchitektur

| Komponente | Technologie |
|------------|-------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | ASP.NET Core 10, C#, XPO ORM |
| Datenbank | Relationale Datenbank (via XPO) |
| Authentifizierung | JWT Bearer Tokens + TOTP 2FA + httpOnly Refresh-Cookies |
| Caching | ASP.NET Response Caching (60 Sekunden, nach Query-Parametern variiert) |
| Statische Assets | Vom Backend unter `/assets/` ausgeliefert |

### 8.2 API-Basis-URL

```
http://localhost:5184/api/
```

Alle API-Endpunkte (außer Auth) erfordern einen gültigen JWT Bearer Token:

```
Authorization: Bearer <token>
```

### 8.3 Wichtige API-Endpunkte (Übersicht)

| Bereich | Endpunkt | Methode | Zugang |
|---------|----------|---------|--------|
| Login | `/api/auth/login` | POST | Öffentlich |
| Ergebnisse | `/api/results` | GET | Öffentlich |
| Medaillenspiegel | `/api/medals` | GET | Öffentlich |
| Sportarten | `/api/sports` | GET | Öffentlich |
| Sportler | `/api/athletes` | GET | Öffentlich |
| Länder | `/api/countries` | GET | Öffentlich |
| Ergebnis einreichen | `/api/judge/results/{id}/submit` | POST | Kampfrichter |
| Ergebnis genehmigen | `/api/reviewer/results/{id}/approve` | POST | Kampfrichter |
| Benutzer verwalten | `/api/admin/users` | GET/POST/PUT | Admin |
| Audit-Log | `/api/admin/audit` | GET | Admin |
| Medaillen-Assets | `/api/admin/assets/medals/{type}` | PUT | Admin |

### 8.4 Statuswerte für Ergebnisse

Die folgenden Statuswerte werden vom API zurückgegeben (PascalCase):

| Status | Wert | Beschreibung |
|--------|------|--------------|
| Entwurf | `Draft` | In Bearbeitung oder nach Ablehnung zurückgesetzt |
| Zur Prüfung | `PendingReview` | Eingereicht, wartet auf erste oder zweite Genehmigung |
| Veröffentlicht | `Published` | Beide Prüfungen abgeschlossen, für die Öffentlichkeit sichtbar |
| Ungültig | `Invalid` | Vom Administrator als ungültig markiert |
| Einspruch | `ProtestFiled` | Einspruch gegen veröffentlichtes Ergebnis wurde eingereicht |

> **Hinweis:** Ergebnisse im Status `PendingReview` können intern den Zusatz „Erste Genehmigung erfolgt“ tragen, wenn bereits ein Prüfer zugestimmt hat. Dies ist jedoch kein eigener technischer Statuswert.

### 8.5 Medaillentypen

| Wert | Anzeige |
|------|---------|
| `gold` | Goldmedaille |
| `silver` | Silbermedaille |
| `bronze` | Bronzemedaille |
| `none` | Keine Medaille |

---

*Dieses Handbuch beschreibt den Funktionsumfang des Systems zum Zeitpunkt der Erstellung (März 2026). Bei Fragen oder Problemen wenden Sie sich an den Systemadministrator.*
