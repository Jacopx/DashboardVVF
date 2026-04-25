DROP TABLE staff;

CREATE TABLE
    staff (
        ID int,
        name varchar(100),
        surname varchar(100),
        role varchar(4),
        status int,
        photo varchar(255),
        phone varchar(20),
        radio int,
        birthday date,
        start date,
        license int,
        license_exp date,
        medical date,
        address varchar(255),
        weekend_shift int,
        week_shift int,
        PRIMARY KEY (ID)
    );

CREATE OR REPLACE VIEW
    staffExp AS
SELECT
    s.ID,
    s.name,
    s.surname,
    s.role,
    s.photo,
    s.phone,
    s.radio,
    s.birthday,
    s.start,
    s.license,
    s.license_exp,
    s.medical,
    s.address,
    CASE
        WHEN s.status = 0 THEN 'RITIRATO'
        ELSE 'ATTIVO'
    END AS status_label,
    DATE_ADD (
        DATE_ADD (s.medical, INTERVAL 2 YEAR),
        INTERVAL 6 MONTH
    ) AS medical_exp,
    CONCAT(
        CASE s.week_shift
            WHEN 1 THEN 'Lunedì'
            WHEN 2 THEN 'Martedì'
            WHEN 3 THEN 'Mercoledì'
            WHEN 4 THEN 'Giovedì'
            WHEN 5 THEN 'Venerdì'
            ELSE 'Sconosciuto'
        END,
        ' - ',
        COALESCE(
            (
                SELECT
                    GROUP_CONCAT (
                        CONCAT(o.surname, ' ', LEFT (o.name, 1), '.')
                        ORDER BY
                            o.surname SEPARATOR ' / '
                    )
                FROM
                    staff o
                WHERE
                    o.week_shift = s.week_shift
                    AND o.id != s.id
            ),
            '—'
        )
    ) AS week_shift_members,
    CONCAT(
        'Turno ',
        s.weekend_shift,
        ' - ',
        COALESCE(
            (
                SELECT
                    GROUP_CONCAT (
                        CONCAT(o.surname, ' ', LEFT (o.name, 1), '.')
                        ORDER BY
                            o.surname SEPARATOR ' / '
                    )
                FROM
                    staff o
                WHERE
                    o.weekend_shift = s.weekend_shift
                    AND o.id != s.id
            ),
            '—'
        )
    ) AS weekend_shift_members
FROM
    staff s;

DROP TABLE vehicles;

CREATE TABLE
    vehicles (
        plate varchar(9),
        name varchar(255),
        brand varchar(30),
        model varchar(30),
        type varchar(255),
        status_label varchar(10),
        photo varchar(255),
        weight int,
        description varchar(255),
        data_reg date,
        data_acquire date,
        seats int,
        limitations varchar(255),
        PRIMARY KEY (plate)
    );

create view shift_members as
select 'week'                             AS `shift_type`,
       `VVF_Trivero`.`staff`.`week_shift` AS `shift_name`,
       `VVF_Trivero`.`staff`.`ID`         AS `ID`,
       `VVF_Trivero`.`staff`.`name`       AS `name`,
       `VVF_Trivero`.`staff`.`surname`    AS `surname`,
       `VVF_Trivero`.`staff`.`role`       AS `role`,
       `VVF_Trivero`.`staff`.`license`    AS `license`
from `VVF_Trivero`.`staff`
where `VVF_Trivero`.`staff`.`week_shift` is not null
union all
select 'weekend'                             AS `shift_type`,
       `VVF_Trivero`.`staff`.`weekend_shift` AS `shift_name`,
       `VVF_Trivero`.`staff`.`ID`            AS `ID`,
       `VVF_Trivero`.`staff`.`name`          AS `name`,
       `VVF_Trivero`.`staff`.`surname`       AS `surname`,
       `VVF_Trivero`.`staff`.`role`          AS `role`,
       `VVF_Trivero`.`staff`.`license`       AS `license`
from `VVF_Trivero`.`staff`
where `VVF_Trivero`.`staff`.`weekend_shift` is not null;

