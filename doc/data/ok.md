# Datas

## Plant

Pflanze ist eine Abbildung der realen Pflanze.

| Field    | Value      |
|----------|------------|
| id       | 123456     |
| art      | Spuckpalme |
| min-mois | 30         |
| max-mois | 70         |
| mess-int | 30min      |

| Field    | Value      |
|----------|------------|
| id       | 18765      |
| art      | Petersilie |
| min-mois | 50         |
| max-mois | 80         |
| mess-int | 10min      |

| Field           | Value   |
|-----------------|---------|
| id              | 98765   |
| art             | Seerose |
| min-water-level | 50cm    |
| max-water-level | 80cm    |
| mess-int        | 60min   |

## Gerät

| Field     | Value                       |
|-----------|-----------------------------|
| id        | 213-4-324-234-354           |
| standort  | Keller                      |
| name      | Heiliger Geist              |
| sensoren  | {Sensor1, Sensor2, Sensor3} |
| plants    | {123.., 187..}              |
| actuators | {Act1, Act2}                |

## Messwerte

| Field          | Value   |
|----------------|---------|
| timestamp      | Jetzt   |
| plantId        | 123...  |
| temperature    | 20C     |
| soil-moissture | 40%     |
| humidity       | 102%    |
| light          | 300 Mux |

| Field       | Value   |
|-------------|---------|
| timestamp   | Jetzt   |
| plantId     | 98765   |
| temperature | 20C     |
| water-level | 70cm    |
| light       | 250 Mux |

## Sensor

| Field    | Value        |
|----------|--------------|
| id       | Sensor1      |
| name     | BFS-3000     |
| type     | rel. Feuchte |
| unit     | percent      |
| accuracy | 10%          |
| min      | 0%           |
| max      | 90%          |

| Field    | Value       |
|----------|-------------|
| id       | Sensor2     |
| name     | Temp3000    |
| type     | temperature |
| unit     | c           |
| accuracy | 2C          |
| min      | -20C        |
| max      | 50C         |

| Field    | Value        |
|----------|--------------|
| id       | Sensor4      |
| name     | WaterLevel10 |
| type     | distance     |
| unit     | cm           |
| accuracy | 2cm          |
| min      | 1cm          |
| max      | 100cm        |

## Actuator

| Field      | Value      |
|------------|------------|
| id         | 12345-8765 |
| name       | small-pump |
| type       | pump       |
| flussmenge | 1l/min     |

| Field      | Value       |
|------------|-------------|
| id         | 12345-8765  |
| name       | smart-light |
| type       | lamp        |
| brightness | 1000 lumen  |
