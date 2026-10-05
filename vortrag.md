# Datensystem-Architektur für weltweite Kassendaten

## Einleitung

**▶ Folie 01 · Weltweite Kassendaten**

Guten Tag, mein Name ist Benito Zenz und ich bearbeite Aufgabenstellung 1.

Unser heutiges Ziel ist der Entwurf einer Datenarchitektur, die weltweit
anfallende Kassendaten in Echtzeit für lokale Berichte in den Filialen und auch
weltweit periodisch für Nachfrageprognosen bereitstellt.

**▶ Folie 02 · Die Größenordnung bestimmt den Entwurf**

Weltweit bedeutet, dass wir von etwa 10.000 Filialen ausgehen können, die
jeweils mehrere Kassen zeitgleich im Betrieb haben können. So könnten zu
Spitzenzeiten jede Sekunde schätzungsweise bis zu 20.000 Kassen-Events anfallen,
die wir verarbeiten wollen.

Dabei sollen die Dashboards für die lokalen Berichte möglichst aktuell sein,
sagen wir p99 < 10 s bei einer Verfügbarkeit von 99,9 %. Der Verlust von
Events soll gegen 0 gehen. Das sind aber erstmal nur unsere Entwurfsziele.

## Grundprinzipien

**▶ Folie 03 · Zuverlässig, skalierbar und wartbar**

Wir wollen unser System also zuverlässig, skalierbar und wartbar gestalten. Ich
möchte kurz erklären, was damit gemeint ist.

Zuverlässigkeit ist die Wahrscheinlichkeit, dass eine Software über einen
bestimmten Zeitraum in einer bestimmten Umgebung fehlerfrei funktioniert. Wir
wollen uns also auf unser Daten-System verlassen können.

Skalierbarkeit ist die Fähigkeit einer Anwendung, mit der Zeit zu wachsen oder
zu schrumpfen und an den Load angepasst effizient zu arbeiten. Das bedeutet, wir
können wachsende Nachfrage bedienen.

Und zuletzt Wartbarkeit, das ist die Leichtigkeit, mit der ein Softwaresystem
angepasst werden kann. Wir können davon ausgehen, dass in Zukunft Änderungen
vorgenommen werden müssen. Wenn wir das schon jetzt bedenken, kann das später
viel Arbeit sparen.

## Architekturüberblick

**▶ Folie 04 · Ein Ereignisstrom, zwei Auswertungswege**

Sehen wir uns an, wie wir eine solche Architektur gestalten können.

Als Quelle der Wahrheit für die Auswertung verwenden wir den Kafka-Ereignisstrom.
Aus ihm entstehen sowohl die Echtzeit-Filialberichte als auch die Daten für die
spätere Nachfrageprognose. Jede Filiale sendet ihre Ereignisse an einen
regionalen Kafka-Cluster.

APAC, EMEA und AMER bilden drei Regionen mit gleichem Aufbau. In jeder Region
empfängt ein Kafka-Cluster mit drei Brokern die Nachrichten der Filialen. Von
dort führen zwei Wege weiter: ein regionaler Pfad für zeitnahe Filialberichte
und ein zentraler Pfad für historische Analysen und Prognosen.

**▶ Folie 05 · Edge-Agent und lokaler Puffer**

Der Kafka-Producer in jeder Filiale ist ein sogenannter Edge-Agent. Das ist ein
leichtgewichtiger Prozess, der lokal auf einem Filial-Rechner oder direkt an der
Kasse läuft. Er nimmt die Kassen-Events entgegen und puffert sie lokal, falls
die Internetverbindung vorübergehend unterbrochen ist.

Sobald die Verbindung steht, sendet er die gespeicherten Events an den
regionalen Kafka-Cluster nach. Eindeutige Event-IDs und Deduplizierung begrenzen
Doppelzählungen und die Reihenfolge wird pro Kafka-Partition erhalten. Als
Technologie bietet sich dabei Kafka-Producer mit lokaler Datei-Queue an.

## Echtzeit- und Batchpfad

**▶ Folie 06 · Spark bereinigt regional**

Ich möchte die regionalen und zentralen Abläufe technisch genauer beschreiben:

Der regionale Pfad ist ein Echtzeit-Pfad und verarbeitet die Ereignisse, sobald sie ankommen. Spark
Structured Streaming prüft die Daten aus dem regionalen Kafka-Cluster,
entfernt Duplikate und pseudonymisiert Kundenkarten-IDs. Die bereinigten,
pseudonymisierten Ereignisse schreibt Spark in das regionale Topic
`pos.transactions.clean`. Daneben berechnet Spark Aggregate für die
Filialberichte. Der Clean-Strom und diese Aggregate sind unterschiedliche
Ausgaben.

**▶ Folie 07 · Aggregate für Filialberichte**

Dann müssen die Zusammenfassungen aber auch für die Filialleitung abrufbar
sein. Dafür schreibt Spark die fertigen Aggregate kontinuierlich in Apache
Cassandra.

Cassandra ist ein Wide-Column-Serving-Store, der für sehr hohe
Schreibraten und Punktabfragen (z.B. "alle Umsätze der Filiale X von heute")
optimiert ist. Das ist genau das, was ein Dashboard braucht. Die Filialleitung
ruft die Daten dann über eine Reporting-API ab, die die Kennzahlen aus
Cassandra liest und im Dashboard anzeigt. Die Latenz vom Kassiervorgang bis zur
Anzeige soll bei bestehender Netzwerk-Verbindung für 99 Prozent der betrachteten
Ereignisse unter zehn Sekunden liegen.

**▶ Folie 08 · Pseudonymisierten Clean-Strom replizieren**

Der zentrale Pfad beginnt mit kontinuierlicher Replikation. Dafür nutzen wir
keine Rohdaten, sondern das bereinigte und pseudonymisierte Topic
`pos.transactions.clean` aus dem Echtzeitpfad. Kafka MirrorMaker 2 repliziert
dieses Topic asynchron in den zentralen Kafka-Cluster. Wir beschränken die
Replikation auf pseudonymisierte Clean-Topics, damit keine Rohdaten die Region
verlassen.

**▶ Folie 09 · Vom Ereignisstrom zur Nachfrageprognose**

Vom zentralen Kafka-Cluster werden die Daten über Kafka Connect in den Data Lake
geschrieben. Da nutzen wir einen S3-Objektspeicher im Parquet-Format. Der Data
Lake ist in drei Zonen gegliedert: landing, clean und curated. Jede Nacht startet
Apache Airflow einen Workflow, der Spark-Batch-Jobs anstößt. Wir verwenden der
Einfachheit halber wieder Spark, wie schon im Echtzeitpfad. Diese erzeugen aus
den bereits pseudonymisierten Eingangsdaten und externen Daten wie Feiertagen
oder Wetterdaten die gewünschten Feature-Tabellen, zum Beispiel den Absatz pro
Filiale, Artikel und Tag. Diese Tabellen sind dann die Grundlage für die
Nachfrageprognose.

Die Data Scientists greifen auf diese Feature-Tabellen zu, explorieren die Daten
in Jupyter und trainieren ihre Nachfrageprognose-Modelle. Das Training läuft in
Kubeflow-Pipelines ab, MLflow dokumentiert Läufe und Modelle. Mit versionierten
Daten, Code und Umgebungen können wir das Training reproduzieren. Optional
können die fertigen Prognosen über ein Kafka-Topic zurück an die Filialen gehen.

**▶ Folie 10 · OLTP und OLAP trennen**

An welchen Stellen finden nun OLTP und OLAP statt? OLTP steht für "Online
Transactional Processing". An den Kassen werden einzelne Verkäufe
als Geschäftstransaktionen erfasst. Diese operative Verarbeitung soll nicht
durch Berichte oder Prognosen belastet werden.

Die Auswertung findet deshalb in getrennten Datenpfaden statt. Spark Structured
Streaming berechnet fortlaufend Kennzahlen für die Filialberichte. Cassandra
speichert diese bereits vorberechneten Ergebnisse, damit die Reporting-API sie
schnell für das Dashboard abrufen kann. Cassandra ist hier also ein
Serving-Store für analytische Ergebnisse, nicht die Datenbank, in der der
Verkauf abgewickelt wird.

Für umfangreichere OLAP-Analysen liegen die Daten im zentralen Data Lake. OLAP
steht für "Online Analytical Processing". Spark-Batch-Jobs und die Data
Scientists untersuchen dort größere historische Datenbestände und erstellen
Features für die Nachfrageprognose. So bleiben die analytischen Lasten vom
Kassiervorgang entkoppelt.

## Prinzipien in der Architektur

**▶ Folie 11 · Asynchrone Replikation und Datenstände**

Das CAP-Theorem beschreibt einen Konflikt bei Netzpartitionen: Ein
verteilter Speicher kann nicht gleichzeitig starke Konsistenz und
Verfügbarkeit für dieselbe Operation garantieren.

Die Filialen schreiben nur in ihre Region; globale synchrone Transaktionen sind
nicht Teil dieses Entwurfs. Das Clean-Topic wird asynchron zur zentralen
Analyseplattform repliziert. Deshalb können der regionale Bericht und der
zentrale Datenstand zeitweise voneinander abweichen. Nach erfolgreicher
Nachlieferung können sie sich aber wieder annähern. Wir haben hier also eventual
consistency.

**▶ Folie 12 · Betriebsmaßnahmen für die Ziele**

Die geplante Architektur soll zuverlässig, skalierbar und wartbar sein.

Für Zuverlässigkeit planen wir in jeder Region drei Kafka-Broker mit einem
Replikationsfaktor von drei. Der lokale Puffer des Edge-Agents kann
Verbindungsunterbrechungen überbrücken, solange seine Kapazität reicht. Kafka
soll die Ereignisse sieben Tage und der Data Lake zwölf Monate vorhalten.

Die Skalierbarkeit wird insbesondere durch die horizontale Skalierung über
Kafka-Partitionen und Consumer-Gruppen ermöglicht. Dass die Regionen je
voneinander unabhängige Bereiche darstellen hilft ebenfalls. Und der Data Lake
Speicher und die Spark-Rechenleistung sind getrennt voneinander skalierbar.

Dass wir für Stream- und Batch-Verarbeitung die gleiche Engine verwenden,
nämlich Spark, macht die ganze Struktur einfacher und damit wartbarer. Alle
Microservices laufen in Containern und werden mittels CI/CD automatisiert
ausgerollt. Und zudem monitoren wir Fehlerraten und Latenz-Perzentile.

## Zukunftstrends

**▶ Folie 13 · Zukunftstrends im Daten- und Modellbetrieb**

Ein aktueller Trend im Data Engineering ist die Zusammenführung von Stream- und
Batch-Verarbeitung zu einem einheitlichen Modell, das nennt man dann
"streaming-first". Unsere Architektur deckt das besonders gut ab, weil die
Kassenereignisse als logischer Strom in regionalen Kafka-Logs landen. Von
dieser Quelle aus versorgen wir dann den Echtzeitpfad für die
Filialberichte und auch den Batchpfad für die zentralen Nachfrageprognosen. Und
wenn später neue Anwendungsfälle dazukommen, müssen wir keine neuen
Schnittstellen an den Kassen anlegen, sondern wir docken einfach eine weitere
Consumer-Gruppe an Kafka an.

Der Betrieb ist cloud-nativ gehalten, ein weiterer Trend im Data Engineering und
der Software Entwicklung. Kafka läuft im KRaft-Modus ohne ZooKeeper. Geeignete
Komponenten könnten als Managed Services in der Cloud laufen.

Die Verbindung von Datenverarbeitung und Modellbetrieb nennen wir MLOps. Die
genannten Kubeflow-Pipelines und MLflow unterstützen diesen Ansatz; für einen
reproduzierbaren Betrieb brauchen wir dann zusätzlich noch versionierte Daten, Code und
Umgebungen.

## Fazit

**▶ Folie 14 · Fazit und nächste Nachweise**

Was leistet dieser Entwurf also? Er entkoppelt den Kassiervorgang von der
Analyse: Die Filialen erfassen Ereignisse lokal, regionale Datenpfade berechnen
zeitnahe Kennzahlen, und ein separater Batchpfad stellt bereinigte Daten für die
Nachfrageprognose bereit. Damit können wir kurze Wege für Filialberichte
schaffen, ohne globale Analysen auf Kosten des Kassierbetriebs auszuführen.

Der entscheidende Architekturgedanke ist der gemeinsame Ereignisstrom. Aus ihm
lassen sich sowohl heutige Berichte als auch spätere Anwendungsfälle ableiten,
ohne die Kassen jedes Mal neu anzubinden. Der Preis dafür ist, dass Berichte bei
Verbindungsstörungen oder verspäteten Ereignissen vorläufig sein können und der
Betrieb mehrerer regionaler Komponenten sorgfältig abgesichert werden muss.

Mein Ergebnis ist deshalb kein Versprechen absoluter Echtzeit, sondern ein
Kompromiss: geringe Latenz für die Filialen, getrennte analytische
Verarbeitung und eine Architektur, die sich für neue Anforderungen
weiterentwickeln lässt. Ob die gesetzten Ziele tatsächlich erreicht werden,
müssten anschließend Last-, Ausfall- und Wiederanlauftests zeigen.

Weitere Informationen bezüglich meiner Quellen finden Sie im Anhang.

Ich bedanke mich sehr für Ihre Zeit und wünsche Ihnen nun einen angenehmen Tag.

