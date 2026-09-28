# Datensystem-Architektur für weltweite Kassendaten

## Einleitung

Guten Tag, mein Name ist Benito Zenz und ich bearbeite Aufgabenstellung 1.

Unser heutiges Ziel ist der Entwurf einer Datenarchitektur, die weltweit
anfallende Kassendaten in Echtzeit für lokale Berichte in den Filialen und auch
weltweit periodisch für Nachfrageprognosen bereitstellt.

Weltweit bedeutet, dass wir von etwa 10.000 Filialen ausgehen können, die
jeweils mehrere Kassen zeitgleich im Betrieb haben können. So könnten zu
Spitzenzeiten jede Sekunde schätzungsweise bis zu 20.000 Kassen-Events anfallen,
die wir verarbeiten wollen.

Dabei sollen die Dashboards für die lokalen Berichte möglichst aktuell sein,
sagen wir p99 < 10 s bei einer Verfügbarkeit von 99,9 %. Der Verlust verlorener
Events soll gegen 0 gehen.

## Grundprinzipien

Wir wollen unser System also zuverlässig, skalierbar und wartbar gestalten. Ich
möchte kurz erklären, was damit gemeint ist.

Zuverlässigkeit ist die Wahrscheinlichkeit, dass eine Software über einen
bestimmten Zeitraum in einer bestimmten Umgebung fehlerfrei funktioniert (Lyu,
1995). Wir wollen uns also auf unser Daten-System verlassen können.

Skalierbarkeit ist die Fähigkeit einer Anwendung, mit der Zeit zu wachsen oder
zu schrumpfen und an den Load angepasst effizient zu arbeiten. Das bedeutet, wir
können wachsende Nachfrage bedienen.

Und zuletzt Wartbarkeit, das ist die Leichtigkeit, mit der ein Softwaresystem
angepasst werden kann. Wir können davon ausgehen, dass in Zukunft Änderungen
vorgenommen werden müssen. Wenn wir das schon jetzt bedenken, kann das später
viel Arbeit sparen.

## Architekturüberblick

Sehen wir uns an, wie wir eine solche Architektur gestalten können.

Als Quelle der Wahrheit verwenden wir einen Apache Kafka Stream, aus dem sowohl
die Echtzeit-Filialberichte als auch die Batch-Abfragen für die
Nachfrageprognosen gezogen werden. Jede Filiale hat einen Kafka-Producer, der an
einen regionalen Kafka-Cluster streamt.

Der Kafka-Producer in jeder Filiale ist ein sogenannter Edge-Agent. Das ist ein
leichtgewichtiger Prozess, der lokal auf einem Filial-Rechner oder direkt an der
Kasse läuft. Er nimmt die Kassen-Events entgegen und puffert sie lokal, falls
die Internetverbindung vorübergehend unterbrochen ist.

Sobald die Verbindung steht, sendet er die gespeicherten Events an den
regionalen Kafka-Cluster nach. Eindeutige Event-IDs und Deduplizierung begrenzen
Doppelzählungen und die Reihenfolge wird pro Kafka-Partition erhalten. Als
Technologie bietet sich dabei Kafka-Producer mit lokaler Datei-Queue an.

Jeden der drei üblichen Weltwirtschaftsräume definieren wir als eigene Region,
also APAC, EMEA und AMER. Diese Regionen sind strukturell aber gleich aufgebaut.
In jeder Region erhält ein Kafka-Cluster (bestehend aus je drei Brokern)
Nachrichten von den Kafka-Producern aus den Filialen der Region.
Da wir eine moderne Version von Kafka verwenden, sind wir nicht länger auf
Zookeeper als externen Service angewiesen. Stattdessen wird der KRaft-Modus
verwendet.

An dem Punkt spalten sich zwei Pfade ab, nämlich der Echtzeit-Pfad und der
Batch-Pfad.

Der Echtzeit-Pfad verarbeitet die Daten, sobald sie reinkommen. Er
pseudonymisiert sie und bereitet sie für das Dashboard der Filialleitung vor.

Der Batchpfad läuft jede Nacht und sammelt die vom Echtzeit-Pfad
pseudonymisierten Daten zentral. Sie werden dann regionenübergreifend
gesammelt und für die ML-Pipelines vorbereitet.


## Echtzeit- und Batchpfad

Ich möchte diese beiden Abläufe technisch genauer beschreiben:

Für die Echtzeit-Verarbeitung werden vom regionalen Kafka-Cluster die Daten
mittels Spark Structured Streaming geprüft, Duplikate entfernt, Kundenkarten-IDs
pseudonymisiert und aggregiert.

Spark Structured Streaming prüft, bereinigt und aggregiert die Daten. Die
bereinigten und pseudonymisierten Daten werden zurück in den regionalen
Kafka-Cluster nach `pos.transactions.clean` geschrieben. Dann müssen die
Zusammenfassungen aber auch für die Filialleitung abrufbar sein. Dafür schreibt
Spark die fertigen Aggregate kontinuierlich in Apache Cassandra.

Cassandra ist ein spaltenorientierter Serving-Store, der für sehr hohe
Schreibraten und Punktabfragen (z.B. "alle Umsätze der Filiale X von heute")
optimiert ist. Das ist genau das, was ein Dashboard braucht. Die Filialleitung
ruft die Daten dann über eine Reporting-API ab, die die Kennzahlen aus
Cassandra liest und im Dashboard anzeigt. Die Latenz vom Kassiervorgang bis zur
Anzeige liegt bei bestehender Netzwerk-Verbindung bei etwa 5–10 Sekunden.

Parallel zum Echtzeitpfad läuft der Batchpfad. Dafür nutzen wir nicht die
Rohdaten, sondern das bereits bereinigte und pseudonymisierte Topic, das Spark
im Echtzeitpfad erzeugt hat. Spark hat die Daten nämlich in das Topic
`pos.transactions.clean` zurückgeschrieben. Mit Kafka MirrorMaker 2 wird dieses
Topic dann asynchron in den zentralen Kafka-Cluster repliziert. So stellen wir
sicher, dass nur pseudonymisierte Daten die Region verlassen.

Vom zentralen Kafka-Cluster werden die Daten über Kafka Connect in den Data Lake
geschrieben. Da nutzen wir einen S3-Objektspeicher im Parquet-Format. Der Data
Lake ist in drei Zonen gegliedert: landing, clean und curated. Jede Nacht startet
Apache Airflow einen Workflow, der Spark-Batch-Jobs anstößt. Wir verwenden der
Einfachheit halber wieder Spark, wie schon im Echtzeitpfad. Diese erzeugen aus
den Rohdaten und externen Daten wie Feiertagen oder Wetterdaten die gewünschten
Feature-Tabellen, zum Beispiel den Absatz pro Filiale, Artikel und Tag. Diese
Tabellen sind dann die Grundlage für die Nachfrageprognose.

Die Data Scientists greifen auf diese Feature-Tabellen zu, explorieren die Daten
in Jupyter und trainieren ihre Nachfrageprognose-Modelle. Das Training läuft in
Kubeflow-Pipelines ab, MLflow versioniert die Modelle. So ist jeder
Trainingsschritt reproduzierbar. Optional können die fertigen Prognosen über ein
Kafka-Topic zurück an die Filialen gehen.

An welchen Stellen finden nun OLTP und OLAP statt? OLTP steht für "Online
Transactional Processing". An den Kassen werden einzelne Verkäufe zuverlässig
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
> https://www.ibm.com/de-de/think/topics/olap-vs-oltp

## Prinzipien in der Architektur

Nach dem CAP-Theorem kann ein verteilter Speicher nur zwei der drei
Eigenschaften Konsistenz (C), Verfügbarkeit (A) und Ausfalltoleranz (P)
garantieren. Da die Kassen nicht warten können, haben wir uns in unserer
Architektur für Verfügbarkeit und Ausfalltoleranz entschieden (AP).
Das ist daran erkennbar, dass die Filialen stets nur in ihre Region schreiben
und es keine globalen, synchronen Transaktionen gibt. Die Synchronisation in die
zentrale Analystics-Platform findet asynchron statt, daher handelt es sich um
evantual consistency.

Die geplante Architektur ist sowohl zuverlässig als auch skalierbar und wartbar.

Zuverlässigkeit wird über folgende Maßnahmen sichergestellt: in jeder der drei
Regionen sind die Daten über die drei Broker dreifach repliziert. Durch die
Edge-Agent mit dem lokalen Puffer in jeder Filiale sind die Producer unabhängig
vom aktuellen Netzwerkzustand. Zudem hält Kafka für sieben Tage und der Data
Lake für 12 Monate die Daten zur weiteren Bearbeitung gespeichert.

Die Skalierbarkeit wird insbesondere durch die horizontale Skalierung über
Kafka-Partitionen und Consumer-Gruppen ermöglicht. Dass die Regionen je
voneinander unabhängige Bereiche darstellen hilft ebenfalls. Und der Data Lake
Speicher und die Spark-Rechenleistung sind getrennt voneinander skalierbar.

Dass wir für Stream- und Batch-Verarbeitung die gleiche Engine verwenden,
nämlich Spark, macht die ganze Struktur einfacher und damit wartbarer. Alle
Microservices laufen in Containern und werden mittels CI/CD automatisiert
ausgerollt. Und zudem monitoren wir Fehlerraten und Latenz-Perzentile.

## Zukunftstrends

Ein aktueller Trend im Data Engineering ist die Zusammenführung von Stream- und
Batch-Verarbeitung zu einem einheitlichen Modell, das nennt man dann
"streaming-first". Unsere Architektur deckt das besonders gut ab, weil jedes
Kassenereignis nur einmal in Kafka als replizierbarer Event-Log geschrieben
wird. Von dieser einen Quelle aus versorgen wir dann den Echtzeitpfad für die
Filialberichte und auch den Batchpfad für die zentralen Nachfrageprognosen. Und
wenn später neue Anwendungsfälle dazukommen, müssen wir keine neuen
Schnittstellen an den Kassen anlegen, sondern wir docken einfach eine weitere
Consumer-Gruppe an Kafka an.

Der Betrieb ist cloud-nativ gehalten, ein weiterer Trend im Data Engineering und
der Software Entwicklung. Kafka läuft im KRaft-Modus ohne ZooKeeper und alle
Komponenten können als Managed Services in der Cloud laufen, was den
Betriebsaufwand senkt und die Skalierung vereinfacht. 

Die Bereitstellung von DataOps und DevOps Praktiken in Pipelines für
maschinelles Lernen stellt einen Trend namens MLOps dar. Da wir
Kubeflow-Pipelines und MLflow für die Nachfrageprognose-Modelle nutzen, steht
dem nichts im Weg.

## Fazit

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
begründeter Kompromiss: geringe Latenz für die Filialen, getrennte analytische
Verarbeitung und eine Architektur, die sich für neue Anforderungen
weiterentwickeln lässt. Ob die gesetzten Ziele tatsächlich erreicht werden,
müssten anschließend Last- und Ausfalltests zeigen.

