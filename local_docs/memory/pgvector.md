Directory Structure:

└── ./
    └── pgvector-master
        ├── .github
        │   └── workflows
        │       └── build.yml
        ├── test
        │   ├── sql
        │   │   ├── bit.sql
        │   │   ├── btree.sql
        │   │   ├── cast.sql
        │   │   ├── copy.sql
        │   │   ├── halfvec.sql
        │   │   ├── hnsw_bit.sql
        │   │   ├── hnsw_halfvec.sql
        │   │   ├── hnsw_sparsevec.sql
        │   │   ├── hnsw_vector.sql
        │   │   ├── ivfflat_bit.sql
        │   │   ├── ivfflat_halfvec.sql
        │   │   ├── ivfflat_vector.sql
        │   │   ├── sparsevec.sql
        │   │   └── vector_type.sql
        │   └── t
        │       ├── 001_ivfflat_wal.pl
        │       ├── 002_ivfflat_vacuum.pl
        │       ├── 003_ivfflat_vector_build_recall.pl
        │       ├── 004_ivfflat_vector_insert_recall.pl
        │       ├── 005_ivfflat_query_recall.pl
        │       ├── 006_ivfflat_lists.pl
        │       ├── 007_ivfflat_inserts.pl
        │       ├── 008_ivfflat_centers.pl
        │       ├── 009_ivfflat_filtering.pl
        │       ├── 010_hnsw_wal.pl
        │       ├── 011_hnsw_vacuum.pl
        │       ├── 012_hnsw_vector_build_recall.pl
        │       ├── 013_hnsw_vector_insert_recall.pl
        │       ├── 014_hnsw_vector_vacuum_recall.pl
        │       ├── 015_hnsw_vector_duplicates.pl
        │       ├── 016_hnsw_inserts.pl
        │       ├── 017_hnsw_filtering.pl
        │       ├── 018_aggregates.pl
        │       ├── 019_storage.pl
        │       ├── 020_hnsw_bit_build_recall.pl
        │       ├── 021_hnsw_bit_insert_recall.pl
        │       ├── 022_hnsw_bit_vacuum_recall.pl
        │       ├── 023_hnsw_bit_duplicates.pl
        │       ├── 024_hnsw_halfvec_build_recall.pl
        │       ├── 025_hnsw_halfvec_insert_recall.pl
        │       ├── 026_hnsw_halfvec_vacuum_recall.pl
        │       ├── 027_hnsw_halfvec_duplicates.pl
        │       ├── 028_hnsw_sparsevec_build_recall.pl
        │       ├── 029_hnsw_sparsevec_insert_recall.pl
        │       ├── 030_hnsw_sparsevec_vacuum_recall.pl
        │       ├── 031_hnsw_sparsevec_duplicates.pl
        │       ├── 032_ivfflat_halfvec_build_recall.pl
        │       ├── 033_comparison.pl
        │       ├── 034_distance_functions.pl
        │       ├── 035_ivfflat_bit_build_recall.pl
        │       ├── 036_ivfflat_bit_centers.pl
        │       ├── 037_inputs.pl
        │       ├── 038_hnsw_sparsevec_vacuum_insert.pl
        │       ├── 039_hnsw_cost.pl
        │       ├── 040_ivfflat_cost.pl
        │       ├── 041_ivfflat_iterative_scan.pl
        │       ├── 042_ivfflat_iterative_scan_recall.pl
        │       ├── 043_hnsw_iterative_scan.pl
        │       └── 044_hnsw_iterative_scan_recall.pl
        ├── CHANGELOG.md
        ├── Dockerfile
        ├── Makefile.win
        ├── META.json
        └── README.md



---
File: /pgvector-master/.github/workflows/build.yml
---

name: build
on: [push, pull_request]
jobs:
  ubuntu:
    runs-on: ${{ matrix.os }}
    if: ${{ !startsWith(github.ref_name, 'mac') && !startsWith(github.ref_name, 'windows') }}
    strategy:
      fail-fast: false
      matrix:
        include:
          - postgres: 18
            os: ubuntu-24.04
          - postgres: 17
            os: ubuntu-24.04
          - postgres: 16
            os: ubuntu-22.04
          - postgres: 15
            os: ubuntu-22.04
          - postgres: 14
            os: ubuntu-20.04
          - postgres: 13
            os: ubuntu-20.04
    steps:
      - uses: actions/checkout@v4
      - uses: ankane/setup-postgres@v1
        with:
          postgres-version: ${{ matrix.postgres }}
          dev-files: true
      - run: make
        env:
          PG_CFLAGS: -DUSE_ASSERT_CHECKING -Wall -Wextra -Werror -Wno-unused-parameter -Wno-sign-compare
      - run: |
          export PG_CONFIG=`which pg_config`
          sudo --preserve-env=PG_CONFIG make install
      - run: make installcheck
      - if: ${{ failure() }}
        run: cat regression.diffs
      - run: |
          sudo apt-get update
          sudo apt-get install libipc-run-perl
      - run: make prove_installcheck
  mac:
    runs-on: ${{ matrix.os }}
    if: ${{ !startsWith(github.ref_name, 'windows') }}
    strategy:
      fail-fast: false
      matrix:
        include:
          - postgres: 16
            os: macos-14
          - postgres: 14
            os: macos-13
    steps:
      - uses: actions/checkout@v4
      - uses: ankane/setup-postgres@v1
        with:
          postgres-version: ${{ matrix.postgres }}
      - run: make
        env:
          PG_CFLAGS: -DUSE_ASSERT_CHECKING -Wall -Wextra -Werror -Wno-unused-parameter
      - run: make install
      - run: make installcheck
      - if: ${{ failure() }}
        run: cat regression.diffs
      # Homebrew Postgres does not enable TAP tests, so need to download
      - run: |
          brew install cpanm
          cpanm --notest IPC::Run
          wget -q https://github.com/postgres/postgres/archive/refs/tags/$TAG.tar.gz
          tar xf $TAG.tar.gz
          mv postgres-$TAG postgres
        env:
          TAG: ${{ matrix.postgres == 16 && 'REL_16_2' || 'REL_14_11' }}
      - run: make prove_installcheck PROVE_FLAGS="-I ./postgres/src/test/perl -I ./test/perl"
        env:
          PERL5LIB: /Users/runner/perl5/lib/perl5
      - run: make clean && $(brew --prefix llvm@15)/bin/scan-build --status-bugs make
        env:
          PG_CFLAGS: -DUSE_ASSERT_CHECKING
  windows:
    runs-on: windows-latest
    if: ${{ !startsWith(github.ref_name, 'mac') }}
    steps:
      - uses: actions/checkout@v4
      - uses: ankane/setup-postgres@v1
        with:
          postgres-version: 14
      - run: |
          call "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\VC\Auxiliary\Build\vcvars64.bat" && ^
          nmake /NOLOGO /F Makefile.win && ^
          nmake /NOLOGO /F Makefile.win install && ^
          nmake /NOLOGO /F Makefile.win installcheck && ^
          nmake /NOLOGO /F Makefile.win clean && ^
          nmake /NOLOGO /F Makefile.win uninstall
        shell: cmd
      - if: ${{ failure() }}
        run: cat regression.diffs
  i386:
    if: ${{ !startsWith(github.ref_name, 'mac') && !startsWith(github.ref_name, 'windows') }}
    runs-on: ubuntu-latest
    container:
      image: debian:12
      options: --platform linux/386
    steps:
      - run: apt-get update && apt-get install -y build-essential git libipc-run-perl postgresql-15 postgresql-server-dev-15 sudo
      - run: service postgresql start
      - run: |
          git clone https://github.com/${{ github.repository }}.git pgvector
          cd pgvector
          git fetch origin ${{ github.ref }}
          git reset --hard FETCH_HEAD
          make
          make install
          chown -R postgres .
          sudo -u postgres make installcheck
          sudo -u postgres make prove_installcheck
        env:
          PG_CFLAGS: -DUSE_ASSERT_CHECKING -Wall -Wextra -Werror -Wno-unused-parameter -Wno-sign-compare
      - if: ${{ failure() }}
        run: cat pgvector/regression.diffs
  valgrind:
    if: ${{ !startsWith(github.ref_name, 'mac') && !startsWith(github.ref_name, 'windows') }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ankane/setup-postgres-valgrind@v1
        with:
          postgres-version: 16
          check-ub: yes
      - run: make OPTFLAGS=""
      - run: sudo --preserve-env=PG_CONFIG make install
      - run: make installcheck



---
File: /pgvector-master/test/sql/bit.sql
---

SELECT hamming_distance('111', '111');
SELECT hamming_distance('111', '110');
SELECT hamming_distance('111', '100');
SELECT hamming_distance('111', '000');
SELECT hamming_distance('10101010101010101010', '01010101010101010101');
SELECT hamming_distance('101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101', '101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101');
SELECT hamming_distance('101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101', '010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010');
SELECT hamming_distance('110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011', '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
SELECT hamming_distance('', '');
SELECT hamming_distance('111', '00');
SELECT hamming_distance('111', '000'::varbit(4));
SELECT hamming_distance('111', '0000'::varbit(4));

SELECT jaccard_distance('1111', '1111');
SELECT jaccard_distance('1111', '1110');
SELECT jaccard_distance('1111', '1100');
SELECT jaccard_distance('1111', '1000');
SELECT jaccard_distance('1111', '0000');
SELECT jaccard_distance('1100', '1000');
SELECT jaccard_distance('10101010101010101010', '01010101010101010101');
SELECT jaccard_distance('101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101', '101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101');
SELECT jaccard_distance('101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101', '010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010');
SELECT jaccard_distance('110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011', '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
SELECT jaccard_distance('', '');
SELECT jaccard_distance('1111', '000');
SELECT jaccard_distance('1111', '0000'::varbit(5));
SELECT jaccard_distance('1111', '00000'::varbit(5));



---
File: /pgvector-master/test/sql/btree.sql
---

SET enable_seqscan = off;

-- vector

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t (val);

SELECT * FROM t WHERE val = '[1,2,3]';
SELECT * FROM t ORDER BY val;

DROP TABLE t;

-- halfvec

CREATE TABLE t (val halfvec(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t (val);

SELECT * FROM t WHERE val = '[1,2,3]';
SELECT * FROM t ORDER BY val;

DROP TABLE t;

-- sparsevec

CREATE TABLE t (val sparsevec(3));
INSERT INTO t (val) VALUES ('{}/3'), ('{1:1,2:2,3:3}/3'), ('{1:1,2:1,3:1}/3'), (NULL);
CREATE INDEX ON t (val);

SELECT * FROM t WHERE val = '{1:1,2:2,3:3}/3';
SELECT * FROM t ORDER BY val;

DROP TABLE t;



---
File: /pgvector-master/test/sql/cast.sql
---

SELECT ARRAY[1,2,3]::vector;
SELECT ARRAY[1.0,2.0,3.0]::vector;
SELECT ARRAY[1,2,3]::float4[]::vector;
SELECT ARRAY[1,2,3]::float8[]::vector;
SELECT ARRAY[1,2,3]::numeric[]::vector;

SELECT '[1,2,3]'::vector::real[];

SELECT '{1,2,3}'::real[]::vector;
SELECT '{1,2,3}'::real[]::vector(3);
SELECT '{1,2,3}'::real[]::vector(2);
SELECT '{NULL}'::real[]::vector;
SELECT '{NaN}'::real[]::vector;
SELECT '{Infinity}'::real[]::vector;
SELECT '{-Infinity}'::real[]::vector;
SELECT '{}'::real[]::vector;
SELECT '{{1}}'::real[]::vector;

SELECT '{1,2,3}'::double precision[]::vector;
SELECT '{1,2,3}'::double precision[]::vector(3);
SELECT '{1,2,3}'::double precision[]::vector(2);
SELECT '{4e38,-4e38}'::double precision[]::vector;
SELECT '{1e-46,-1e-46}'::double precision[]::vector;

SELECT '[1,2,3]'::vector::halfvec;
SELECT '[1,2,3]'::vector::halfvec(3);
SELECT '[1,2,3]'::vector::halfvec(2);
SELECT '[65520]'::vector::halfvec;
SELECT '[1e-8]'::vector::halfvec;

SELECT '[1,2,3]'::halfvec::vector;
SELECT '[1,2,3]'::halfvec::vector(3);
SELECT '[1,2,3]'::halfvec::vector(2);

SELECT '{1,2,3}'::real[]::halfvec;
SELECT '{1,2,3}'::real[]::halfvec(3);
SELECT '{1,2,3}'::real[]::halfvec(2);
SELECT '{65520,-65520}'::real[]::halfvec;
SELECT '{1e-8,-1e-8}'::real[]::halfvec;

SELECT '[0,1.5,0,3.5,0]'::vector::sparsevec;
SELECT '[0,1.5,0,3.5,0]'::vector::sparsevec(5);
SELECT '[0,1.5,0,3.5,0]'::vector::sparsevec(4);

SELECT '{2:1.5,4:3.5}/5'::sparsevec::vector;
SELECT '{2:1.5,4:3.5}/5'::sparsevec::vector(5);
SELECT '{2:1.5,4:3.5}/5'::sparsevec::vector(4);
SELECT '{}/16001'::sparsevec::vector;

SELECT '[0,1.5,0,3.5,0]'::halfvec::sparsevec;
SELECT '[0,1.5,0,3.5,0]'::halfvec::sparsevec(5);
SELECT '[0,1.5,0,3.5,0]'::halfvec::sparsevec(4);

SELECT '{2:1.5,4:3.5}/5'::sparsevec::halfvec;
SELECT '{2:1.5,4:3.5}/5'::sparsevec::halfvec(5);
SELECT '{2:1.5,4:3.5}/5'::sparsevec::halfvec(4);
SELECT '{}/16001'::sparsevec::halfvec;
SELECT '{1:65520}/1'::sparsevec::halfvec;
SELECT '{1:1e-8}/1'::sparsevec::halfvec;

SELECT ARRAY[1,0,2,0,3,0]::sparsevec;
SELECT ARRAY[1.0,0.0,2.0,0.0,3.0,0.0]::sparsevec;
SELECT ARRAY[1,0,2,0,3,0]::float4[]::sparsevec;
SELECT ARRAY[1,0,2,0,3,0]::float8[]::sparsevec;
SELECT ARRAY[1,0,2,0,3,0]::numeric[]::sparsevec;

SELECT '{1,0,2,0,3,0}'::real[]::sparsevec;
SELECT '{1,0,2,0,3,0}'::real[]::sparsevec(6);
SELECT '{1,0,2,0,3,0}'::real[]::sparsevec(5);
SELECT '{NULL}'::real[]::sparsevec;
SELECT '{NaN}'::real[]::sparsevec;
SELECT '{Infinity}'::real[]::sparsevec;
SELECT '{-Infinity}'::real[]::sparsevec;
SELECT '{}'::real[]::sparsevec;
SELECT '{{1}}'::real[]::sparsevec;

SELECT array_agg(n)::vector FROM generate_series(1, 16001) n;
SELECT array_to_vector(array_agg(n), 16001, false) FROM generate_series(1, 16001) n;

-- ensure no error
SELECT ARRAY[1,2,3] = ARRAY[1,2,3];



---
File: /pgvector-master/test/sql/copy.sql
---

-- vector

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);

CREATE TABLE t2 (val vector(3));

\copy t TO 'results/vector.bin' WITH (FORMAT binary)
\copy t2 FROM 'results/vector.bin' WITH (FORMAT binary)

SELECT * FROM t2 ORDER BY val;

DROP TABLE t;
DROP TABLE t2;

-- halfvec

CREATE TABLE t (val halfvec(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);

CREATE TABLE t2 (val halfvec(3));

\copy t TO 'results/halfvec.bin' WITH (FORMAT binary)
\copy t2 FROM 'results/halfvec.bin' WITH (FORMAT binary)

SELECT * FROM t2 ORDER BY val;

DROP TABLE t;
DROP TABLE t2;

-- sparsevec

CREATE TABLE t (val sparsevec(3));
INSERT INTO t (val) VALUES ('{}/3'), ('{1:1,2:2,3:3}/3'), ('{1:1,2:1,3:1}/3'), (NULL);

CREATE TABLE t2 (val sparsevec(3));

\copy t TO 'results/sparsevec.bin' WITH (FORMAT binary)
\copy t2 FROM 'results/sparsevec.bin' WITH (FORMAT binary)

SELECT * FROM t2 ORDER BY val;

DROP TABLE t;
DROP TABLE t2;



---
File: /pgvector-master/test/sql/halfvec.sql
---

SELECT '[1,2,3]'::halfvec;
SELECT '[-1,-2,-3]'::halfvec;
SELECT '[1.,2.,3.]'::halfvec;
SELECT ' [ 1,  2 ,    3  ] '::halfvec;
SELECT '[1.23456]'::halfvec;
SELECT '[hello,1]'::halfvec;
SELECT '[NaN,1]'::halfvec;
SELECT '[Infinity,1]'::halfvec;
SELECT '[-Infinity,1]'::halfvec;
SELECT '[65519,-65519]'::halfvec;
SELECT '[65520,-65520]'::halfvec;
SELECT '[1e-8,-1e-8]'::halfvec;
SELECT '[4e38,1]'::halfvec;
SELECT '[1e-46,1]'::halfvec;
SELECT '[1,2,3'::halfvec;
SELECT '[1,2,3]9'::halfvec;
SELECT '1,2,3'::halfvec;
SELECT ''::halfvec;
SELECT '['::halfvec;
SELECT '[ '::halfvec;
SELECT '[,'::halfvec;
SELECT '[]'::halfvec;
SELECT '[ ]'::halfvec;
SELECT '[,]'::halfvec;
SELECT '[1,]'::halfvec;
SELECT '[1a]'::halfvec;
SELECT '[1,,3]'::halfvec;
SELECT '[1, ,3]'::halfvec;

SELECT '[1,2,3]'::halfvec(3);
SELECT '[1,2,3]'::halfvec(2);
SELECT '[1,2,3]'::halfvec(3, 2);
SELECT '[1,2,3]'::halfvec('a');
SELECT '[1,2,3]'::halfvec(0);
SELECT '[1,2,3]'::halfvec(16001);

SELECT unnest('{"[1,2,3]", "[4,5,6]"}'::halfvec[]);
SELECT '{"[1,2,3]"}'::halfvec(2)[];

SELECT '[1,2,3]'::halfvec + '[4,5,6]';
SELECT '[65519]'::halfvec + '[65519]';
SELECT '[1,2]'::halfvec + '[3]';

SELECT '[1,2,3]'::halfvec - '[4,5,6]';
SELECT '[-65519]'::halfvec - '[65519]';
SELECT '[1,2]'::halfvec - '[3]';

SELECT '[1,2,3]'::halfvec * '[4,5,6]';
SELECT '[65519]'::halfvec * '[65519]';
SELECT '[1e-7]'::halfvec * '[1e-7]';
SELECT '[1,2]'::halfvec * '[3]';

SELECT '[1,2,3]'::halfvec || '[4,5]';
SELECT array_fill(0, ARRAY[16000])::halfvec || '[1]';

SELECT '[1,2,3]'::halfvec < '[1,2,3]';
SELECT '[1,2,3]'::halfvec < '[1,2]';
SELECT '[1,2,3]'::halfvec <= '[1,2,3]';
SELECT '[1,2,3]'::halfvec <= '[1,2]';
SELECT '[1,2,3]'::halfvec = '[1,2,3]';
SELECT '[1,2,3]'::halfvec = '[1,2]';
SELECT '[1,2,3]'::halfvec != '[1,2,3]';
SELECT '[1,2,3]'::halfvec != '[1,2]';
SELECT '[1,2,3]'::halfvec >= '[1,2,3]';
SELECT '[1,2,3]'::halfvec >= '[1,2]';
SELECT '[1,2,3]'::halfvec > '[1,2,3]';
SELECT '[1,2,3]'::halfvec > '[1,2]';

SELECT halfvec_cmp('[1,2,3]', '[1,2,3]');
SELECT halfvec_cmp('[1,2,3]', '[0,0,0]');
SELECT halfvec_cmp('[0,0,0]', '[1,2,3]');
SELECT halfvec_cmp('[1,2]', '[1,2,3]');
SELECT halfvec_cmp('[1,2,3]', '[1,2]');
SELECT halfvec_cmp('[1,2]', '[2,3,4]');
SELECT halfvec_cmp('[2,3]', '[1,2,3]');

SELECT vector_dims('[1,2,3]'::halfvec);

SELECT round(l2_norm('[1,1]'::halfvec)::numeric, 5);
SELECT l2_norm('[3,4]'::halfvec);
SELECT l2_norm('[0,1]'::halfvec);
SELECT l2_norm('[0,0]'::halfvec);
SELECT l2_norm('[2]'::halfvec);

SELECT l2_distance('[0,0]'::halfvec, '[3,4]');
SELECT l2_distance('[0,0]'::halfvec, '[0,1]');
SELECT l2_distance('[1,2]'::halfvec, '[3]');
SELECT l2_distance('[1,1,1,1,1,1,1,1,1]'::halfvec, '[1,1,1,1,1,1,1,4,5]');
SELECT '[0,0]'::halfvec <-> '[3,4]';

SELECT inner_product('[1,2]'::halfvec, '[3,4]');
SELECT inner_product('[1,2]'::halfvec, '[3]');
SELECT inner_product('[65504]'::halfvec, '[65504]');
SELECT inner_product('[1,1,1,1,1,1,1,1,1]'::halfvec, '[1,2,3,4,5,6,7,8,9]');
SELECT '[1,2]'::halfvec <#> '[3,4]';

SELECT cosine_distance('[1,2]'::halfvec, '[2,4]');
SELECT cosine_distance('[1,2]'::halfvec, '[0,0]');
SELECT cosine_distance('[1,1]'::halfvec, '[1,1]');
SELECT cosine_distance('[1,0]'::halfvec, '[0,2]');
SELECT cosine_distance('[1,1]'::halfvec, '[-1,-1]');
SELECT cosine_distance('[1,2]'::halfvec, '[3]');
SELECT cosine_distance('[1,1]'::halfvec, '[1.1,1.1]');
SELECT cosine_distance('[1,1]'::halfvec, '[-1.1,-1.1]');
SELECT cosine_distance('[1,2,3,4,5,6,7,8,9]'::halfvec, '[1,2,3,4,5,6,7,8,9]');
SELECT cosine_distance('[1,2,3,4,5,6,7,8,9]'::halfvec, '[-1,-2,-3,-4,-5,-6,-7,-8,-9]');
SELECT '[1,2]'::halfvec <=> '[2,4]';

SELECT l1_distance('[0,0]'::halfvec, '[3,4]');
SELECT l1_distance('[0,0]'::halfvec, '[0,1]');
SELECT l1_distance('[1,2]'::halfvec, '[3]');
SELECT l1_distance('[1,2,3,4,5,6,7,8,9]'::halfvec, '[1,2,3,4,5,6,7,8,9]');
SELECT l1_distance('[1,2,3,4,5,6,7,8,9]'::halfvec, '[0,3,2,5,4,7,6,9,8]');
SELECT '[0,0]'::halfvec <+> '[3,4]';

SELECT l2_normalize('[3,4]'::halfvec);
SELECT l2_normalize('[3,0]'::halfvec);
SELECT l2_normalize('[0,0.1]'::halfvec);
SELECT l2_normalize('[0,0]'::halfvec);
SELECT l2_normalize('[65504]'::halfvec);

SELECT binary_quantize('[1,0,-1]'::halfvec);
SELECT binary_quantize('[0,0.1,-0.2,-0.3,0.4,0.5,0.6,-0.7,0.8,-0.9,1]'::halfvec);

SELECT subvector('[1,2,3,4,5]'::halfvec, 1, 3);
SELECT subvector('[1,2,3,4,5]'::halfvec, 3, 2);
SELECT subvector('[1,2,3,4,5]'::halfvec, -1, 3);
SELECT subvector('[1,2,3,4,5]'::halfvec, 3, 9);
SELECT subvector('[1,2,3,4,5]'::halfvec, 1, 0);
SELECT subvector('[1,2,3,4,5]'::halfvec, 3, -1);
SELECT subvector('[1,2,3,4,5]'::halfvec, -1, 2);
SELECT subvector('[1,2,3,4,5]'::halfvec, 2147483647, 10);
SELECT subvector('[1,2,3,4,5]'::halfvec, 3, 2147483647);
SELECT subvector('[1,2,3,4,5]'::halfvec, -2147483644, 2147483647);

SELECT avg(v) FROM unnest(ARRAY['[1,2,3]'::halfvec, '[3,5,7]']) v;
SELECT avg(v) FROM unnest(ARRAY['[1,2,3]'::halfvec, '[3,5,7]', NULL]) v;
SELECT avg(v) FROM unnest(ARRAY[]::halfvec[]) v;
SELECT avg(v) FROM unnest(ARRAY['[1,2]'::halfvec, '[3]']) v;
SELECT avg(v) FROM unnest(ARRAY['[65504]'::halfvec, '[65504]']) v;
SELECT halfvec_avg(array_agg(n)) FROM generate_series(1, 16002) n;

SELECT sum(v) FROM unnest(ARRAY['[1,2,3]'::halfvec, '[3,5,7]']) v;
SELECT sum(v) FROM unnest(ARRAY['[1,2,3]'::halfvec, '[3,5,7]', NULL]) v;
SELECT sum(v) FROM unnest(ARRAY[]::halfvec[]) v;
SELECT sum(v) FROM unnest(ARRAY['[1,2]'::halfvec, '[3]']) v;
SELECT sum(v) FROM unnest(ARRAY['[65504]'::halfvec, '[65504]']) v;



---
File: /pgvector-master/test/sql/hnsw_bit.sql
---

SET enable_seqscan = off;

-- hamming

CREATE TABLE t (val bit(3));
INSERT INTO t (val) VALUES (B'000'), (B'100'), (B'111'), (NULL);
CREATE INDEX ON t USING hnsw (val bit_hamming_ops);

INSERT INTO t (val) VALUES (B'110');

SELECT * FROM t ORDER BY val <~> B'111';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <~> (SELECT NULL::bit)) t2;

DROP TABLE t;

-- jaccard

CREATE TABLE t (val bit(4));
INSERT INTO t (val) VALUES (B'0000'), (B'1100'), (B'1111'), (NULL);
CREATE INDEX ON t USING hnsw (val bit_jaccard_ops);

INSERT INTO t (val) VALUES (B'1110');

SELECT * FROM t ORDER BY val <%> B'1111';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <%> (SELECT NULL::bit)) t2;

DROP TABLE t;

-- varbit

CREATE TABLE t (val varbit(3));
CREATE INDEX ON t USING hnsw (val bit_hamming_ops);
CREATE INDEX ON t USING hnsw ((val::bit(3)) bit_hamming_ops);
CREATE INDEX ON t USING hnsw ((val::bit(64001)) bit_hamming_ops);
DROP TABLE t;



---
File: /pgvector-master/test/sql/hnsw_halfvec.sql
---

SET enable_seqscan = off;

-- L2

CREATE TABLE t (val halfvec(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val halfvec_l2_ops);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <-> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <-> (SELECT NULL::halfvec)) t2;
SELECT COUNT(*) FROM t;

TRUNCATE t;
SELECT * FROM t ORDER BY val <-> '[3,3,3]';

DROP TABLE t;

-- inner product

CREATE TABLE t (val halfvec(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val halfvec_ip_ops);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <#> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <#> (SELECT NULL::halfvec)) t2;

DROP TABLE t;

-- cosine

CREATE TABLE t (val halfvec(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val halfvec_cosine_ops);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <=> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <=> '[0,0,0]') t2;
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <=> (SELECT NULL::halfvec)) t2;

DROP TABLE t;

-- L1

CREATE TABLE t (val halfvec(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val halfvec_l1_ops);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <+> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <+> (SELECT NULL::halfvec)) t2;

DROP TABLE t;



---
File: /pgvector-master/test/sql/hnsw_sparsevec.sql
---

SET enable_seqscan = off;

-- L2

CREATE TABLE t (val sparsevec(3));
INSERT INTO t (val) VALUES ('{}/3'), ('{1:1,2:2,3:3}/3'), ('{1:1,2:1,3:1}/3'), (NULL);
CREATE INDEX ON t USING hnsw (val sparsevec_l2_ops);

INSERT INTO t (val) VALUES ('{1:1,2:2,3:4}/3');

SELECT * FROM t ORDER BY val <-> '{1:3,2:3,3:3}/3';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <-> (SELECT NULL::sparsevec)) t2;
SELECT COUNT(*) FROM t;

TRUNCATE t;
SELECT * FROM t ORDER BY val <-> '{1:3,2:3,3:3}/3';

DROP TABLE t;

-- inner product

CREATE TABLE t (val sparsevec(3));
INSERT INTO t (val) VALUES ('{}/3'), ('{1:1,2:2,3:3}/3'), ('{1:1,2:1,3:1}/3'), (NULL);
CREATE INDEX ON t USING hnsw (val sparsevec_ip_ops);

INSERT INTO t (val) VALUES ('{1:1,2:2,3:4}/3');

SELECT * FROM t ORDER BY val <#> '{1:3,2:3,3:3}/3';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <#> (SELECT NULL::sparsevec)) t2;

DROP TABLE t;

-- cosine

CREATE TABLE t (val sparsevec(3));
INSERT INTO t (val) VALUES ('{}/3'), ('{1:1,2:2,3:3}/3'), ('{1:1,2:1,3:1}/3'), (NULL);
CREATE INDEX ON t USING hnsw (val sparsevec_cosine_ops);

INSERT INTO t (val) VALUES ('{1:1,2:2,3:4}/3');

SELECT * FROM t ORDER BY val <=> '{1:3,2:3,3:3}/3';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <=> '{}/3') t2;
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <=> (SELECT NULL::sparsevec)) t2;

DROP TABLE t;

-- L1

CREATE TABLE t (val sparsevec(3));
INSERT INTO t (val) VALUES ('{}/3'), ('{1:1,2:2,3:3}/3'), ('{1:1,2:1,3:1}/3'), (NULL);
CREATE INDEX ON t USING hnsw (val sparsevec_l1_ops);

INSERT INTO t (val) VALUES ('{1:1,2:2,3:4}/3');

SELECT * FROM t ORDER BY val <+> '{1:3,2:3,3:3}/3';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <+> (SELECT NULL::sparsevec)) t2;

DROP TABLE t;

-- non-zero elements

CREATE TABLE t (val sparsevec(1001));
INSERT INTO t (val) VALUES (array_fill(1, ARRAY[1001])::vector::sparsevec);
CREATE INDEX ON t USING hnsw (val sparsevec_l2_ops);
TRUNCATE t;
CREATE INDEX ON t USING hnsw (val sparsevec_l2_ops);
INSERT INTO t (val) VALUES (array_fill(1, ARRAY[1001])::vector::sparsevec);
DROP TABLE t;



---
File: /pgvector-master/test/sql/hnsw_vector.sql
---

SET enable_seqscan = off;

-- L2

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val vector_l2_ops);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <-> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <-> (SELECT NULL::vector)) t2;
SELECT COUNT(*) FROM t;

TRUNCATE t;
SELECT * FROM t ORDER BY val <-> '[3,3,3]';

DROP TABLE t;

-- inner product

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val vector_ip_ops);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <#> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <#> (SELECT NULL::vector)) t2;

DROP TABLE t;

-- cosine

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val vector_cosine_ops);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <=> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <=> '[0,0,0]') t2;
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <=> (SELECT NULL::vector)) t2;

DROP TABLE t;

-- L1

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val vector_l1_ops);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <+> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <+> (SELECT NULL::vector)) t2;

DROP TABLE t;

-- iterative

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val vector_l2_ops);

SET hnsw.iterative_scan = strict_order;
SET hnsw.ef_search = 1;
SELECT * FROM t ORDER BY val <-> '[3,3,3]';

SET hnsw.iterative_scan = relaxed_order;
SELECT * FROM t ORDER BY val <-> '[3,3,3]';

RESET hnsw.iterative_scan;
RESET hnsw.ef_search;
DROP TABLE t;

-- unlogged

CREATE UNLOGGED TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val vector_l2_ops);

SELECT * FROM t ORDER BY val <-> '[3,3,3]';

DROP TABLE t;

-- options

CREATE TABLE t (val vector(3));
CREATE INDEX ON t USING hnsw (val vector_l2_ops) WITH (m = 1);
CREATE INDEX ON t USING hnsw (val vector_l2_ops) WITH (m = 101);
CREATE INDEX ON t USING hnsw (val vector_l2_ops) WITH (ef_construction = 3);
CREATE INDEX ON t USING hnsw (val vector_l2_ops) WITH (ef_construction = 1001);
CREATE INDEX ON t USING hnsw (val vector_l2_ops) WITH (m = 16, ef_construction = 31);

SHOW hnsw.ef_search;

SET hnsw.ef_search = 0;
SET hnsw.ef_search = 1001;

SHOW hnsw.iterative_scan;

SET hnsw.iterative_scan = on;

SHOW hnsw.max_scan_tuples;

SET hnsw.max_scan_tuples = 0;

SHOW hnsw.scan_mem_multiplier;

SET hnsw.scan_mem_multiplier = 0;
SET hnsw.scan_mem_multiplier = 1001;

DROP TABLE t;



---
File: /pgvector-master/test/sql/ivfflat_bit.sql
---

SET enable_seqscan = off;

-- hamming

CREATE TABLE t (val bit(3));
INSERT INTO t (val) VALUES (B'000'), (B'100'), (B'111'), (NULL);
CREATE INDEX ON t USING ivfflat (val bit_hamming_ops) WITH (lists = 1);

INSERT INTO t (val) VALUES (B'110');

SELECT * FROM t ORDER BY val <~> B'111';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <~> (SELECT NULL::bit)) t2;

DROP TABLE t;

-- varbit

CREATE TABLE t (val varbit(3));
CREATE INDEX ON t USING ivfflat (val bit_hamming_ops) WITH (lists = 1);
CREATE INDEX ON t USING ivfflat ((val::bit(3)) bit_hamming_ops) WITH (lists = 1);
CREATE INDEX ON t USING ivfflat ((val::bit(64001)) bit_hamming_ops) WITH (lists = 1);
CREATE INDEX ON t USING ivfflat ((val::bit(2)) bit_hamming_ops) WITH (lists = 5);
DROP TABLE t;



---
File: /pgvector-master/test/sql/ivfflat_halfvec.sql
---

SET enable_seqscan = off;

-- L2

CREATE TABLE t (val halfvec(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING ivfflat (val halfvec_l2_ops) WITH (lists = 1);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <-> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <-> (SELECT NULL::halfvec)) t2;
SELECT COUNT(*) FROM t;

TRUNCATE t;
SELECT * FROM t ORDER BY val <-> '[3,3,3]';

DROP TABLE t;

-- inner product

CREATE TABLE t (val halfvec(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING ivfflat (val halfvec_ip_ops) WITH (lists = 1);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <#> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <#> (SELECT NULL::halfvec)) t2;

DROP TABLE t;

-- cosine

CREATE TABLE t (val halfvec(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING ivfflat (val halfvec_cosine_ops) WITH (lists = 1);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <=> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <=> '[0,0,0]') t2;
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <=> (SELECT NULL::halfvec)) t2;

DROP TABLE t;



---
File: /pgvector-master/test/sql/ivfflat_vector.sql
---

SET enable_seqscan = off;

-- L2

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING ivfflat (val vector_l2_ops) WITH (lists = 1);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <-> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <-> (SELECT NULL::vector)) t2;
SELECT COUNT(*) FROM t;

TRUNCATE t;
SELECT * FROM t ORDER BY val <-> '[3,3,3]';

DROP TABLE t;

-- inner product

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING ivfflat (val vector_ip_ops) WITH (lists = 1);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <#> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <#> (SELECT NULL::vector)) t2;

DROP TABLE t;

-- cosine

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING ivfflat (val vector_cosine_ops) WITH (lists = 1);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <=> '[3,3,3]';
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <=> '[0,0,0]') t2;
SELECT COUNT(*) FROM (SELECT * FROM t ORDER BY val <=> (SELECT NULL::vector)) t2;

DROP TABLE t;

-- iterative

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING ivfflat (val vector_l2_ops) WITH (lists = 3);

SET ivfflat.iterative_scan = relaxed_order;
SELECT * FROM t ORDER BY val <-> '[3,3,3]';

SET ivfflat.max_probes = 1;
SELECT * FROM t ORDER BY val <-> '[3,3,3]';

SET ivfflat.max_probes = 2;
SELECT * FROM t ORDER BY val <-> '[3,3,3]';

RESET ivfflat.iterative_scan;
RESET ivfflat.max_probes;
DROP TABLE t;

-- unlogged

CREATE UNLOGGED TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING ivfflat (val vector_l2_ops) WITH (lists = 1);

SELECT * FROM t ORDER BY val <-> '[3,3,3]';

DROP TABLE t;

-- options

CREATE TABLE t (val vector(3));
CREATE INDEX ON t USING ivfflat (val vector_l2_ops) WITH (lists = 0);
CREATE INDEX ON t USING ivfflat (val vector_l2_ops) WITH (lists = 32769);

SHOW ivfflat.probes;

SET ivfflat.probes = 0;
SET ivfflat.probes = 32769;

SHOW ivfflat.iterative_scan;

SET ivfflat.iterative_scan = on;

SHOW ivfflat.max_probes;

SET ivfflat.max_probes = 0;
SET ivfflat.max_probes = 32769;

DROP TABLE t;



---
File: /pgvector-master/test/sql/sparsevec.sql
---

SELECT '{1:1.5,3:3.5}/5'::sparsevec;
SELECT '{1:-2,3:-4}/5'::sparsevec;
SELECT '{1:2.,3:4.}/5'::sparsevec;
SELECT ' { 1 : 1.5 ,  3  :  3.5  } / 5 '::sparsevec;
SELECT '{1:1.23456}/1'::sparsevec;
SELECT '{1:hello,2:1}/2'::sparsevec;
SELECT '{1:NaN,2:1}/2'::sparsevec;
SELECT '{1:Infinity,2:1}/2'::sparsevec;
SELECT '{1:-Infinity,2:1}/2'::sparsevec;
SELECT '{1:1.5e38,2:-1.5e38}/2'::sparsevec;
SELECT '{1:1.5e+38,2:-1.5e+38}/2'::sparsevec;
SELECT '{1:1.5e-38,2:-1.5e-38}/2'::sparsevec;
SELECT '{1:4e38,2:1}/2'::sparsevec;
SELECT '{1:-4e38,2:1}/2'::sparsevec;
SELECT '{1:1e-46,2:1}/2'::sparsevec;
SELECT '{1:-1e-46,2:1}/2'::sparsevec;
SELECT ''::sparsevec;
SELECT '{'::sparsevec;
SELECT '{ '::sparsevec;
SELECT '{:'::sparsevec;
SELECT '{,'::sparsevec;
SELECT '{}'::sparsevec;
SELECT '{}/'::sparsevec;
SELECT '{}/1'::sparsevec;
SELECT '{}/1a'::sparsevec;
SELECT '{ }/1'::sparsevec;
SELECT '{:}/1'::sparsevec;
SELECT '{,}/1'::sparsevec;
SELECT '{1,}/1'::sparsevec;
SELECT '{:1}/1'::sparsevec;
SELECT '{1:}/1'::sparsevec;
SELECT '{1a:1}/1'::sparsevec;
SELECT '{1:1a}/1'::sparsevec;
SELECT '{1:1,}/1'::sparsevec;
SELECT '{1:0,2:1,3:0}/3'::sparsevec;
SELECT '{2:1,1:1}/2'::sparsevec;
SELECT '{1:1,1:1}/2'::sparsevec;
SELECT '{1:1,2:1,1:1}/2'::sparsevec;
SELECT '{}/5'::sparsevec;
SELECT '{}/-1'::sparsevec;
SELECT '{}/1000000001'::sparsevec;
SELECT '{}/2147483648'::sparsevec;
SELECT '{}/-2147483649'::sparsevec;
SELECT '{}/9223372036854775808'::sparsevec;
SELECT '{}/-9223372036854775809'::sparsevec;
SELECT '{2147483647:1}/1'::sparsevec;
SELECT '{2147483648:1}/1'::sparsevec;
SELECT '{-2147483648:1}/1'::sparsevec;
SELECT '{-2147483649:1}/1'::sparsevec;
SELECT '{0:1}/1'::sparsevec;
SELECT '{2:1}/1'::sparsevec;

SELECT '{}/3'::sparsevec(3);
SELECT '{}/3'::sparsevec(2);
SELECT '{}/3'::sparsevec(3, 2);
SELECT '{}/3'::sparsevec('a');
SELECT '{}/3'::sparsevec(0);
SELECT '{}/3'::sparsevec(1000000001);

SELECT '{1:1,2:2,3:3}/3'::sparsevec < '{1:1,2:2,3:3}/3';
SELECT '{1:1,2:2,3:3}/3'::sparsevec < '{1:1,2:2}/2';
SELECT '{1:1,2:2,3:3}/3'::sparsevec <= '{1:1,2:2,3:3}/3';
SELECT '{1:1,2:2,3:3}/3'::sparsevec <= '{1:1,2:2}/2';
SELECT '{1:1,2:2,3:3}/3'::sparsevec = '{1:1,2:2,3:3}/3';
SELECT '{1:1,2:2,3:3}/3'::sparsevec = '{1:1,2:2}/2';
SELECT '{1:1,2:2,3:3}/3'::sparsevec != '{1:1,2:2,3:3}/3';
SELECT '{1:1,2:2,3:3}/3'::sparsevec != '{1:1,2:2}/2';
SELECT '{1:1,2:2,3:3}/3'::sparsevec >= '{1:1,2:2,3:3}/3';
SELECT '{1:1,2:2,3:3}/3'::sparsevec >= '{1:1,2:2}/2';
SELECT '{1:1,2:2,3:3}/3'::sparsevec > '{1:1,2:2,3:3}/3';
SELECT '{1:1,2:2,3:3}/3'::sparsevec > '{1:1,2:2}/2';

SELECT sparsevec_cmp('{1:1,2:2,3:3}/3', '{1:1,2:2,3:3}/3');
SELECT sparsevec_cmp('{1:1,2:2,3:3}/3', '{}/3');
SELECT sparsevec_cmp('{}/3', '{1:1,2:2,3:3}/3');
SELECT sparsevec_cmp('{1:1,2:2}/2', '{1:1,2:2,3:3}/3');
SELECT sparsevec_cmp('{1:1,2:2,3:3}/3', '{1:1,2:2}/2');
SELECT sparsevec_cmp('{1:1,2:2}/2', '{1:2,2:3,3:4}/3');
SELECT sparsevec_cmp('{1:2,2:3}/2', '{1:1,2:2,3:3}/3');

SELECT round(l2_norm('{1:1,2:1}/2'::sparsevec)::numeric, 5);
SELECT l2_norm('{1:3,2:4}/2'::sparsevec);
SELECT l2_norm('{2:1}/2'::sparsevec);
SELECT l2_norm('{1:3e37,2:4e37}/2'::sparsevec)::real;
SELECT l2_norm('{}/2'::sparsevec);
SELECT l2_norm('{1:2}/1'::sparsevec);

SELECT l2_distance('{}/2'::sparsevec, '{1:3,2:4}/2');
SELECT l2_distance('{1:3}/2'::sparsevec, '{2:4}/2');
SELECT l2_distance('{2:4}/2'::sparsevec, '{1:3}/2');
SELECT l2_distance('{1:3,2:4}/2'::sparsevec, '{}/2');
SELECT l2_distance('{}/2'::sparsevec, '{2:1}/2');
SELECT '{}/2'::sparsevec <-> '{1:3,2:4}/2';

SELECT inner_product('{1:1,2:2}/2'::sparsevec, '{1:2,2:4}/2');
SELECT inner_product('{1:1,2:2}/2'::sparsevec, '{1:3}/1');
SELECT inner_product('{1:1,3:3}/4'::sparsevec, '{2:2,4:4}/4');
SELECT inner_product('{2:2,4:4}/4'::sparsevec, '{1:1,3:3}/4');
SELECT inner_product('{1:1,3:3,5:5}/5'::sparsevec, '{2:4,3:6,4:8}/5');
SELECT inner_product('{1:1}/2'::sparsevec, '{}/2');
SELECT inner_product('{}/2'::sparsevec, '{1:1}/2');
SELECT inner_product('{1:3e38}/1'::sparsevec, '{1:3e38}/1');
SELECT inner_product('{1:1,3:3,5:5}/5'::sparsevec, '{2:4,3:6,4:8}/5');
SELECT '{1:1,2:2}/2'::sparsevec <#> '{1:3,2:4}/2';

SELECT cosine_distance('{1:1,2:2}/2'::sparsevec, '{1:2,2:4}/2');
SELECT cosine_distance('{1:1,2:2}/2'::sparsevec, '{}/2');
SELECT cosine_distance('{1:1,2:1}/2'::sparsevec, '{1:1,2:1}/2');
SELECT cosine_distance('{1:1}/2'::sparsevec, '{2:2}/2');
SELECT cosine_distance('{1:1,2:1}/2'::sparsevec, '{1:-1,2:-1}/2');
SELECT cosine_distance('{1:2}/2'::sparsevec, '{2:2}/2');
SELECT cosine_distance('{2:2}/2'::sparsevec, '{1:2}/2');
SELECT cosine_distance('{1:1,2:2}/2'::sparsevec, '{1:3}/1');
SELECT cosine_distance('{1:1,2:1}/2'::sparsevec, '{1:1.1,2:1.1}/2');
SELECT cosine_distance('{1:1,2:1}/2'::sparsevec, '{1:-1.1,2:-1.1}/2');
SELECT cosine_distance('{1:3e38}/1'::sparsevec, '{1:3e38}/1');
SELECT cosine_distance('{}/1'::sparsevec, '{}/1');
SELECT '{1:1,2:2}/2'::sparsevec <=> '{1:2,2:4}/2';

SELECT l1_distance('{}/2'::sparsevec, '{1:3,2:4}/2');
SELECT l1_distance('{}/2'::sparsevec, '{2:1}/2');
SELECT l1_distance('{1:1,2:2}/2'::sparsevec, '{1:3}/1');
SELECT l1_distance('{1:3e38}/1'::sparsevec, '{1:-3e38}/1');
SELECT l1_distance('{1:1,3:3,5:5,7:7}/8'::sparsevec, '{2:2,4:4,6:6,8:8}/8');
SELECT l1_distance('{1:1,3:3,5:5,7:7,9:9}/9'::sparsevec, '{2:2,4:4,6:6,8:8}/9');
SELECT '{}/2'::sparsevec <+> '{1:3,2:4}/2';

SELECT l2_normalize('{1:3,2:4}/2'::sparsevec);
SELECT l2_normalize('{1:3}/2'::sparsevec);
SELECT l2_normalize('{2:0.1}/2'::sparsevec);
SELECT l2_normalize('{}/2'::sparsevec);
SELECT l2_normalize('{1:3e38}/1'::sparsevec);
SELECT l2_normalize('{1:3e38,2:1e-37}/2'::sparsevec);
SELECT l2_normalize('{2:3e37,4:3e-37,6:4e37,8:4e-37}/9'::sparsevec);



---
File: /pgvector-master/test/sql/vector_type.sql
---

SELECT '[1,2,3]'::vector;
SELECT '[-1,-2,-3]'::vector;
SELECT '[1.,2.,3.]'::vector;
SELECT ' [ 1,  2 ,    3  ] '::vector;
SELECT '[1.23456]'::vector;
SELECT '[hello,1]'::vector;
SELECT '[NaN,1]'::vector;
SELECT '[Infinity,1]'::vector;
SELECT '[-Infinity,1]'::vector;
SELECT '[1.5e38,-1.5e38]'::vector;
SELECT '[1.5e+38,-1.5e+38]'::vector;
SELECT '[1.5e-38,-1.5e-38]'::vector;
SELECT '[4e38,1]'::vector;
SELECT '[-4e38,1]'::vector;
SELECT '[1e-46,1]'::vector;
SELECT '[-1e-46,1]'::vector;
SELECT '[1,2,3'::vector;
SELECT '[1,2,3]9'::vector;
SELECT '1,2,3'::vector;
SELECT ''::vector;
SELECT '['::vector;
SELECT '[ '::vector;
SELECT '[,'::vector;
SELECT '[]'::vector;
SELECT '[ ]'::vector;
SELECT '[,]'::vector;
SELECT '[1,]'::vector;
SELECT '[1a]'::vector;
SELECT '[1,,3]'::vector;
SELECT '[1, ,3]'::vector;

SELECT '[1,2,3]'::vector(3);
SELECT '[1,2,3]'::vector(2);
SELECT '[1,2,3]'::vector(3, 2);
SELECT '[1,2,3]'::vector('a');
SELECT '[1,2,3]'::vector(0);
SELECT '[1,2,3]'::vector(16001);

SELECT unnest('{"[1,2,3]", "[4,5,6]"}'::vector[]);
SELECT '{"[1,2,3]"}'::vector(2)[];


SELECT '[1,2,3]'::vector + '[4,5,6]';
SELECT '[3e38]'::vector + '[3e38]';
SELECT '[1,2]'::vector + '[3]';

SELECT '[1,2,3]'::vector - '[4,5,6]';
SELECT '[-3e38]'::vector - '[3e38]';
SELECT '[1,2]'::vector - '[3]';

SELECT '[1,2,3]'::vector * '[4,5,6]';
SELECT '[1e37]'::vector * '[1e37]';
SELECT '[1e-37]'::vector * '[1e-37]';
SELECT '[1,2]'::vector * '[3]';

SELECT '[1,2,3]'::vector || '[4,5]';
SELECT array_fill(0, ARRAY[16000])::vector || '[1]';

SELECT '[1,2,3]'::vector < '[1,2,3]';
SELECT '[1,2,3]'::vector < '[1,2]';
SELECT '[1,2,3]'::vector <= '[1,2,3]';
SELECT '[1,2,3]'::vector <= '[1,2]';
SELECT '[1,2,3]'::vector = '[1,2,3]';
SELECT '[1,2,3]'::vector = '[1,2]';
SELECT '[1,2,3]'::vector != '[1,2,3]';
SELECT '[1,2,3]'::vector != '[1,2]';
SELECT '[1,2,3]'::vector >= '[1,2,3]';
SELECT '[1,2,3]'::vector >= '[1,2]';
SELECT '[1,2,3]'::vector > '[1,2,3]';
SELECT '[1,2,3]'::vector > '[1,2]';

SELECT vector_cmp('[1,2,3]', '[1,2,3]');
SELECT vector_cmp('[1,2,3]', '[0,0,0]');
SELECT vector_cmp('[0,0,0]', '[1,2,3]');
SELECT vector_cmp('[1,2]', '[1,2,3]');
SELECT vector_cmp('[1,2,3]', '[1,2]');
SELECT vector_cmp('[1,2]', '[2,3,4]');
SELECT vector_cmp('[2,3]', '[1,2,3]');

SELECT vector_dims('[1,2,3]'::vector);

SELECT round(vector_norm('[1,1]')::numeric, 5);
SELECT vector_norm('[3,4]');
SELECT vector_norm('[0,1]');
SELECT vector_norm('[3e37,4e37]')::real;
SELECT vector_norm('[0,0]');
SELECT vector_norm('[2]');

SELECT l2_distance('[0,0]'::vector, '[3,4]');
SELECT l2_distance('[0,0]'::vector, '[0,1]');
SELECT l2_distance('[1,2]'::vector, '[3]');
SELECT l2_distance('[3e38]'::vector, '[-3e38]');
SELECT l2_distance('[1,1,1,1,1,1,1,1,1]'::vector, '[1,1,1,1,1,1,1,4,5]');
SELECT '[0,0]'::vector <-> '[3,4]';

SELECT inner_product('[1,2]'::vector, '[3,4]');
SELECT inner_product('[1,2]'::vector, '[3]');
SELECT inner_product('[3e38]'::vector, '[3e38]');
SELECT inner_product('[1,1,1,1,1,1,1,1,1]'::vector, '[1,2,3,4,5,6,7,8,9]');
SELECT '[1,2]'::vector <#> '[3,4]';

SELECT cosine_distance('[1,2]'::vector, '[2,4]');
SELECT cosine_distance('[1,2]'::vector, '[0,0]');
SELECT cosine_distance('[1,1]'::vector, '[1,1]');
SELECT cosine_distance('[1,0]'::vector, '[0,2]');
SELECT cosine_distance('[1,1]'::vector, '[-1,-1]');
SELECT cosine_distance('[1,2]'::vector, '[3]');
SELECT cosine_distance('[1,1]'::vector, '[1.1,1.1]');
SELECT cosine_distance('[1,1]'::vector, '[-1.1,-1.1]');
SELECT cosine_distance('[3e38]'::vector, '[3e38]');
SELECT cosine_distance('[1,2,3,4,5,6,7,8,9]'::vector, '[1,2,3,4,5,6,7,8,9]');
SELECT cosine_distance('[1,2,3,4,5,6,7,8,9]'::vector, '[-1,-2,-3,-4,-5,-6,-7,-8,-9]');
SELECT '[1,2]'::vector <=> '[2,4]';

SELECT l1_distance('[0,0]'::vector, '[3,4]');
SELECT l1_distance('[0,0]'::vector, '[0,1]');
SELECT l1_distance('[1,2]'::vector, '[3]');
SELECT l1_distance('[3e38]'::vector, '[-3e38]');
SELECT l1_distance('[1,2,3,4,5,6,7,8,9]'::vector, '[1,2,3,4,5,6,7,8,9]');
SELECT l1_distance('[1,2,3,4,5,6,7,8,9]'::vector, '[0,3,2,5,4,7,6,9,8]');
SELECT '[0,0]'::vector <+> '[3,4]';

SELECT l2_normalize('[3,4]'::vector);
SELECT l2_normalize('[3,0]'::vector);
SELECT l2_normalize('[0,0.1]'::vector);
SELECT l2_normalize('[0,0]'::vector);
SELECT l2_normalize('[3e38]'::vector);

SELECT binary_quantize('[1,0,-1]'::vector);
SELECT binary_quantize('[0,0.1,-0.2,-0.3,0.4,0.5,0.6,-0.7,0.8,-0.9,1]'::vector);

SELECT subvector('[1,2,3,4,5]'::vector, 1, 3);
SELECT subvector('[1,2,3,4,5]'::vector, 3, 2);
SELECT subvector('[1,2,3,4,5]'::vector, -1, 3);
SELECT subvector('[1,2,3,4,5]'::vector, 3, 9);
SELECT subvector('[1,2,3,4,5]'::vector, 1, 0);
SELECT subvector('[1,2,3,4,5]'::vector, 3, -1);
SELECT subvector('[1,2,3,4,5]'::vector, -1, 2);
SELECT subvector('[1,2,3,4,5]'::vector, 2147483647, 10);
SELECT subvector('[1,2,3,4,5]'::vector, 3, 2147483647);
SELECT subvector('[1,2,3,4,5]'::vector, -2147483644, 2147483647);

SELECT avg(v) FROM unnest(ARRAY['[1,2,3]'::vector, '[3,5,7]']) v;
SELECT avg(v) FROM unnest(ARRAY['[1,2,3]'::vector, '[3,5,7]', NULL]) v;
SELECT avg(v) FROM unnest(ARRAY[]::vector[]) v;
SELECT avg(v) FROM unnest(ARRAY['[1,2]'::vector, '[3]']) v;
SELECT avg(v) FROM unnest(ARRAY['[3e38]'::vector, '[3e38]']) v;
SELECT vector_avg(array_agg(n)) FROM generate_series(1, 16002) n;

SELECT sum(v) FROM unnest(ARRAY['[1,2,3]'::vector, '[3,5,7]']) v;
SELECT sum(v) FROM unnest(ARRAY['[1,2,3]'::vector, '[3,5,7]', NULL]) v;
SELECT sum(v) FROM unnest(ARRAY[]::vector[]) v;
SELECT sum(v) FROM unnest(ARRAY['[1,2]'::vector, '[3]']) v;
SELECT sum(v) FROM unnest(ARRAY['[3e38]'::vector, '[3e38]']) v;



---
File: /pgvector-master/test/t/001_ivfflat_wal.pl
---

# Based on postgres/contrib/bloom/t/001_wal.pl

# Test generic xlog record work for ivfflat index replication.
use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $dim = 32;

my $node_primary;
my $node_replica;

# Run few queries on both primary and replica and check their results match.
sub test_index_replay
{
	my ($test_name) = @_;

	# Wait for replica to catch up
	my $applname = $node_replica->name;
	my $caughtup_query = "SELECT pg_current_wal_lsn() <= replay_lsn FROM pg_stat_replication WHERE application_name = '$applname';";
	$node_primary->poll_query_until('postgres', $caughtup_query)
	  or die "Timed out while waiting for replica 1 to catch up";

	my @r = ();
	for (1 .. $dim)
	{
		push(@r, rand());
	}
	my $sql = join(",", @r);

	my $queries = qq(
		SET enable_seqscan = off;
		SELECT * FROM tst ORDER BY v <-> '[$sql]' LIMIT 10;
	);

	# Run test queries and compare their result
	my $primary_result = $node_primary->safe_psql("postgres", $queries);
	my $replica_result = $node_replica->safe_psql("postgres", $queries);

	is($primary_result, $replica_result, "$test_name: query result matches");
	return;
}

# Use ARRAY[random(), random(), random(), ...] over
# SELECT array_agg(random()) FROM generate_series(1, $dim)
# to generate different values for each row
my $array_sql = join(",", ('random()') x $dim);

# Initialize primary node
$node_primary = PostgreSQL::Test::Cluster->new('primary');
$node_primary->init(allows_streaming => 1);
if ($dim > 32)
{
	# TODO use wal_keep_segments for Postgres < 13
	$node_primary->append_conf('postgresql.conf', qq(wal_keep_size = 1GB));
}
if ($dim > 1500)
{
	$node_primary->append_conf('postgresql.conf', qq(maintenance_work_mem = 128MB));
}
$node_primary->start;
my $backup_name = 'my_backup';

# Take backup
$node_primary->backup($backup_name);

# Create streaming replica linking to primary
$node_replica = PostgreSQL::Test::Cluster->new('replica');
$node_replica->init_from_backup($node_primary, $backup_name, has_streaming => 1);
$node_replica->start;

# Create ivfflat index on primary
$node_primary->safe_psql("postgres", "CREATE EXTENSION vector;");
$node_primary->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector($dim));");
$node_primary->safe_psql("postgres",
	"INSERT INTO tst SELECT i % 10, ARRAY[$array_sql] FROM generate_series(1, 100000) i;"
);
$node_primary->safe_psql("postgres", "CREATE INDEX ON tst USING ivfflat (v vector_l2_ops);");

# Test that queries give same result
test_index_replay('initial');

# Run 10 cycles of table modification. Run test queries after each modification.
for my $i (1 .. 10)
{
	$node_primary->safe_psql("postgres", "DELETE FROM tst WHERE i = $i;");
	test_index_replay("delete $i");
	$node_primary->safe_psql("postgres", "VACUUM tst;");
	test_index_replay("vacuum $i");
	my ($start, $end) = (100001 + ($i - 1) * 10000, 100000 + $i * 10000);
	$node_primary->safe_psql("postgres",
		"INSERT INTO tst SELECT i % 10, ARRAY[$array_sql] FROM generate_series($start, $end) i;"
	);
	test_index_replay("insert $i");
}

done_testing();



---
File: /pgvector-master/test/t/002_ivfflat_vacuum.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $dim = 3;

my $array_sql = join(",", ('random()') x $dim);

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table and index
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 100000) i;"
);
$node->safe_psql("postgres", "CREATE INDEX ON tst USING ivfflat (v vector_l2_ops);");

# Get size
my $size = $node->safe_psql("postgres", "SELECT pg_total_relation_size('tst_v_idx');");

# Store values
$node->safe_psql("postgres", "CREATE TABLE tmp AS SELECT * FROM tst;");

# Delete all, vacuum, and insert same data
$node->safe_psql("postgres", "DELETE FROM tst;");
$node->safe_psql("postgres", "VACUUM tst;");
$node->safe_psql("postgres", "INSERT INTO tst SELECT * FROM tmp;");

# Check size
my $new_size = $node->safe_psql("postgres", "SELECT pg_total_relation_size('tst_v_idx');");
is($size, $new_size, "size does not change");

done_testing();



---
File: /pgvector-master/test/t/003_ivfflat_vector_build_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;

sub test_recall
{
	my ($probes, $min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET ivfflat.probes = $probes;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan using idx on tst/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET ivfflat.probes = $probes;
			SELECT i FROM tst ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);

		my @expected_ids = split("\n", $expected[$i]);
		my %expected_set = map { $_ => 1 } @expected_ids;

		foreach (@actual_ids)
		{
			if (exists($expected_set{$_}))
			{
				$correct++;
			}
		}

		$total += $limit;
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector(3));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[random(), random(), random()] FROM generate_series(1, 100000) i;"
);

# Generate queries
for (1 .. 20)
{
	my $r1 = rand();
	my $r2 = rand();
	my $r3 = rand();
	push(@queries, "[$r1,$r2,$r3]");
}

# Check each index type
my @operators = ("<->", "<#>", "<=>");
my @opclasses = ("vector_l2_ops", "vector_ip_ops", "vector_cosine_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		my $res = $node->safe_psql("postgres", qq(
			WITH top AS (
				SELECT v $operator '$_' AS distance FROM tst ORDER BY distance LIMIT $limit
			)
			SELECT i FROM tst WHERE (v $operator '$_') <= (SELECT MAX(distance) FROM top)
		));
		push(@expected, $res);
	}

	# Build index serially
	$node->safe_psql("postgres", qq(
		SET max_parallel_maintenance_workers = 0;
		CREATE INDEX idx ON tst USING ivfflat (v $opclass);
	));

	# Test approximate results
	if ($operator ne "<#>")
	{
		# TODO Fix test (uniform random vectors all have similar inner product)
		test_recall(1, 0.71, $operator);
		test_recall(10, 0.95, $operator);
	}

	# Test probes equals lists
	if ($operator eq "<=>")
	{
		test_recall(100, 0.9925, $operator);
	}
	else
	{
		test_recall(100, 1.00, $operator);
	}

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel
	my ($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		SET client_min_messages = DEBUG;
		SET min_parallel_table_scan_size = 1;
		CREATE INDEX idx ON tst USING ivfflat (v $opclass);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);

	# Test approximate results
	if ($operator ne "<#>")
	{
		# TODO Fix test (uniform random vectors all have similar inner product)
		test_recall(1, 0.71, $operator);
		test_recall(10, 0.95, $operator);
	}

	# Test probes equals lists
	if ($operator eq "<=>")
	{
		test_recall(100, 0.9925, $operator);
	}
	else
	{
		test_recall(100, 1.00, $operator);
	}

	$node->safe_psql("postgres", "DROP INDEX idx;");
}

done_testing();



---
File: /pgvector-master/test/t/004_ivfflat_vector_insert_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;

sub test_recall
{
	my ($probes, $min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET ivfflat.probes = $probes;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan using idx on tst/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET ivfflat.probes = $probes;
			SELECT i FROM tst ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);
		my %actual_set = map { $_ => 1 } @actual_ids;

		my @expected_ids = split("\n", $expected[$i]);

		foreach (@expected_ids)
		{
			if (exists($actual_set{$_}))
			{
				$correct++;
			}
			$total++;
		}
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i serial, v vector(3));");

# Generate queries
for (1 .. 20)
{
	my $r1 = rand();
	my $r2 = rand();
	my $r3 = rand();
	push(@queries, "[$r1,$r2,$r3]");
}

# Check each index type
my @operators = ("<->", "<#>", "<=>");
my @opclasses = ("vector_l2_ops", "vector_ip_ops", "vector_cosine_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Add index
	$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING ivfflat (v $opclass);");

	# Use concurrent inserts
	$node->pgbench(
		"--no-vacuum --client=10 --transactions=1000",
		0,
		[qr{actually processed}],
		[qr{^$}],
		"concurrent INSERTs",
		{
			"017_ivfflat_insert_recall_$opclass" => "INSERT INTO tst (v) SELECT ARRAY[random(), random(), random()] FROM generate_series(1, 10) i;"
		}
	);

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		my $res = $node->safe_psql("postgres", qq(
			SET enable_indexscan = off;
			SELECT i FROM tst ORDER BY v $operator '$_' LIMIT $limit;
		));
		push(@expected, $res);
	}

	# Test approximate results
	if ($operator ne "<#>")
	{
		# TODO Fix test (uniform random vectors all have similar inner product)
		test_recall(1, 0.71, $operator);
		test_recall(10, 0.95, $operator);
	}
	# Account for equal distances
	test_recall(100, 0.9925, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");
	$node->safe_psql("postgres", "TRUNCATE tst;");
}

done_testing();



---
File: /pgvector-master/test/t/005_ivfflat_query_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4 primary key, v vector(3));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[random(), random(), random()] FROM generate_series(1, 100000) i;"
);

# Check each index type
my @operators = ("<->", "<#>", "<=>");
my @opclasses = ("vector_l2_ops", "vector_ip_ops", "vector_cosine_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Add index
	$node->safe_psql("postgres", "CREATE INDEX ON tst USING ivfflat (v $opclass);");

	# Test 100% recall
	for (1 .. 20)
	{
		my $id = int(rand() * 100000);
		my $query = $node->safe_psql("postgres", "SELECT v FROM tst WHERE i = $id;");
		my $res = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SELECT v FROM tst ORDER BY v <-> '$query' LIMIT 1;
		));
		is($res, $query);
	}
}

done_testing();



---
File: /pgvector-master/test/t/006_ivfflat_lists.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (v vector(3));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT ARRAY[random(), random(), random()] FROM generate_series(1, 100000) i;"
);

$node->safe_psql("postgres", "CREATE INDEX lists50 ON tst USING ivfflat (v vector_l2_ops) WITH (lists = 50);");
$node->safe_psql("postgres", "CREATE INDEX lists100 ON tst USING ivfflat (v vector_l2_ops) WITH (lists = 100);");

# Test prefers more lists
my $res = $node->safe_psql("postgres", "EXPLAIN SELECT v FROM tst ORDER BY v <-> '[0.5,0.5,0.5]' LIMIT 10;");
like($res, qr/lists100/);
unlike($res, qr/lists50/);

# Test errors with too much memory
my ($ret, $stdout, $stderr) = $node->psql("postgres",
	"CREATE INDEX lists10000 ON tst USING ivfflat (v vector_l2_ops) WITH (lists = 10000);"
);
like($stderr, qr/memory required is/);

done_testing();



---
File: /pgvector-master/test/t/007_ivfflat_inserts.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $dim = 768;

my $array_sql = join(",", ('random()') x $dim);

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table and index
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (v vector($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT ARRAY[$array_sql] FROM generate_series(1, 10000) i;"
);
$node->safe_psql("postgres", "CREATE INDEX ON tst USING ivfflat (v vector_l2_ops);");

$node->pgbench(
	"--no-vacuum --client=5 --transactions=100",
	0,
	[qr{actually processed}],
	[qr{^$}],
	"concurrent INSERTs",
	{
		"007_ivfflat_inserts" => "INSERT INTO tst SELECT ARRAY[$array_sql] FROM generate_series(1, 10) i;"
	}
);

sub idx_scan
{
	# Stats do not update instantaneously
	# https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-STATS-VIEWS
	sleep(1);
	$node->safe_psql("postgres", "SELECT idx_scan FROM pg_stat_user_indexes WHERE indexrelid = 'tst_v_idx'::regclass;");
}

my $expected = 10000 + 5 * 100 * 10;

my $count = $node->safe_psql("postgres", "SELECT COUNT(*) FROM tst;");
is($count, $expected);
is(idx_scan(), 0);

$count = $node->safe_psql("postgres", qq(
	SET enable_seqscan = off;
	SET ivfflat.probes = 100;
	SELECT COUNT(*) FROM (SELECT v FROM tst ORDER BY v <-> (SELECT v FROM tst LIMIT 1)) t;
));
is($count, $expected);
is(idx_scan(), 1);

done_testing();



---
File: /pgvector-master/test/t/008_ivfflat_centers.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector(3));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, '[1,2,3]' FROM generate_series(1, 10) i;"
);

sub test_centers
{
	my ($lists, $min) = @_;

	my ($ret, $stdout, $stderr) = $node->psql("postgres", "CREATE INDEX ON tst USING ivfflat (v vector_l2_ops) WITH (lists = $lists);");
	is($ret, 0, $stderr);
}

# Test no error for duplicate centers
test_centers(5);
test_centers(10);

$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, '[4,5,6]' FROM generate_series(1, 10) i;"
);

# Test no error for duplicate centers
test_centers(10);

done_testing();



---
File: /pgvector-master/test/t/009_ivfflat_filtering.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $dim = 3;
my $nc = 50;
my $limit = 20;

my $array_sql = join(",", ('random()') x $dim);

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table and index
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector($dim), c int4, t text);");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql], i % $nc, 'test ' || i FROM generate_series(1, 10000) i;"
);
$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING ivfflat (v vector_l2_ops) WITH (lists = 100);");
$node->safe_psql("postgres", "ANALYZE tst;");

# Generate query
my @r = ();
for (1 .. $dim)
{
	push(@r, rand());
}
my $query = "[" . join(",", @r) . "]";
my $c = int(rand() * $nc);

# Test attribute filtering
my $explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c = $c ORDER BY v <-> '$query' LIMIT $limit;
));
# TODO Do not use index
like($explain, qr/Index Scan using idx/);

# Test attribute filtering with few rows removed
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c != $c ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using idx/);

# Test attribute filtering with few rows removed comparison
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c >= 1 ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using idx/);

# Test attribute filtering with many rows removed comparison
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c < 1 ORDER BY v <-> '$query' LIMIT $limit;
));
# TODO Do not use index
like($explain, qr/Index Scan using idx/);

# Test attribute filtering with few rows removed like
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE t LIKE '%%test%%' ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using idx/);

# Test attribute filtering with many rows removed like
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE t LIKE '%%other%%' ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Seq Scan/);

# Test distance filtering
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE v <-> '$query' < 1 ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using idx/);

# Test distance filtering greater than distance
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE v <-> '$query' > 1 ORDER BY v <-> '$query' LIMIT $limit;
));
# TODO Do not use index
like($explain, qr/Index Scan using idx/);

# Test distance filtering without order
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE v <-> '$query' < 1;
));
like($explain, qr/Seq Scan/);

# Test distance filtering without limit
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE v <-> '$query' < 1 ORDER BY v <-> '$query';
));
like($explain, qr/Seq Scan/);

# Test attribute index
$node->safe_psql("postgres", "CREATE INDEX attribute_idx ON tst (c);");
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c = $c ORDER BY v <-> '$query' LIMIT $limit;
));
# TODO Use attribute index
like($explain, qr/Index Scan using idx/);

# Test partial index
$node->safe_psql("postgres", "CREATE INDEX partial_idx ON tst USING ivfflat (v vector_l2_ops) WITH (lists = 5) WHERE (c = $c);");
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c = $c ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using partial_idx/);

done_testing();



---
File: /pgvector-master/test/t/010_hnsw_wal.pl
---

# Based on postgres/contrib/bloom/t/001_wal.pl

# Test generic xlog record work for hnsw index replication.
use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $dim = 32;

my $node_primary;
my $node_replica;

# Run few queries on both primary and replica and check their results match.
sub test_index_replay
{
	my ($test_name) = @_;

	# Wait for replica to catch up
	my $applname = $node_replica->name;
	my $caughtup_query = "SELECT pg_current_wal_lsn() <= replay_lsn FROM pg_stat_replication WHERE application_name = '$applname';";
	$node_primary->poll_query_until('postgres', $caughtup_query)
	  or die "Timed out while waiting for replica 1 to catch up";

	my @r = ();
	for (1 .. $dim)
	{
		push(@r, rand());
	}
	my $sql = join(",", @r);

	my $queries = qq(
		SET enable_seqscan = off;
		SELECT * FROM tst ORDER BY v <-> '[$sql]' LIMIT 10;
	);

	# Run test queries and compare their result
	my $primary_result = $node_primary->safe_psql("postgres", $queries);
	my $replica_result = $node_replica->safe_psql("postgres", $queries);

	is($primary_result, $replica_result, "$test_name: query result matches");
	return;
}

# Use ARRAY[random(), random(), random(), ...] over
# SELECT array_agg(random()) FROM generate_series(1, $dim)
# to generate different values for each row
my $array_sql = join(",", ('random()') x $dim);

# Initialize primary node
$node_primary = PostgreSQL::Test::Cluster->new('primary');
$node_primary->init(allows_streaming => 1);
if ($dim > 32)
{
	# TODO use wal_keep_segments for Postgres < 13
	$node_primary->append_conf('postgresql.conf', qq(wal_keep_size = 1GB));
}
if ($dim > 1500)
{
	$node_primary->append_conf('postgresql.conf', qq(maintenance_work_mem = 128MB));
}
$node_primary->start;
my $backup_name = 'my_backup';

# Take backup
$node_primary->backup($backup_name);

# Create streaming replica linking to primary
$node_replica = PostgreSQL::Test::Cluster->new('replica');
$node_replica->init_from_backup($node_primary, $backup_name, has_streaming => 1);
$node_replica->start;

# Create hnsw index on primary
$node_primary->safe_psql("postgres", "CREATE EXTENSION vector;");
$node_primary->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector($dim));");
$node_primary->safe_psql("postgres",
	"INSERT INTO tst SELECT i % 10, ARRAY[$array_sql] FROM generate_series(1, 1000) i;"
);
$node_primary->safe_psql("postgres", "CREATE INDEX ON tst USING hnsw (v vector_l2_ops);");

# Test that queries give same result
test_index_replay('initial');

# Run 10 cycles of table modification. Run test queries after each modification.
for my $i (1 .. 10)
{
	$node_primary->safe_psql("postgres", "DELETE FROM tst WHERE i = $i;");
	test_index_replay("delete $i");
	$node_primary->safe_psql("postgres", "VACUUM tst;");
	test_index_replay("vacuum $i");
	my ($start, $end) = (1001 + ($i - 1) * 100, 1000 + $i * 100);
	$node_primary->safe_psql("postgres",
		"INSERT INTO tst SELECT i % 10, ARRAY[$array_sql] FROM generate_series($start, $end) i;"
	);
	test_index_replay("insert $i");
}

done_testing();



---
File: /pgvector-master/test/t/011_hnsw_vacuum.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $dim = 3;

my @r = ();
for (1 .. $dim)
{
	my $v = int(rand(1000)) + 1;
	push(@r, "i % $v");
}
my $array_sql = join(", ", @r);

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table and index
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 10000) i;"
);
$node->safe_psql("postgres", "CREATE INDEX ON tst USING hnsw (v vector_l2_ops);");

# Get size
my $size = $node->safe_psql("postgres", "SELECT pg_total_relation_size('tst_v_idx');");

# Delete all, vacuum, and insert same data
$node->safe_psql("postgres", "DELETE FROM tst;");
$node->safe_psql("postgres", "VACUUM tst;");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 10000) i;"
);

# Check size
# May increase some due to different levels
my $new_size = $node->safe_psql("postgres", "SELECT pg_total_relation_size('tst_v_idx');");
cmp_ok($new_size, "<=", $size * 1.02, "size does not increase too much");

# Delete all but one
$node->safe_psql("postgres", "DELETE FROM tst WHERE i != 123;");
$node->safe_psql("postgres", "VACUUM tst;");
my $res = $node->safe_psql("postgres", qq(
	SET enable_seqscan = off;
	SELECT i FROM tst ORDER BY v <-> '[0,0,0]' LIMIT 10;
));
is($res, 123);

done_testing();



---
File: /pgvector-master/test/t/012_hnsw_vector_build_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $array_sql = join(",", ('random() * random()') x 3);

sub test_recall
{
	my ($min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SELECT i FROM tst ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);
		my %actual_set = map { $_ => 1 } @actual_ids;

		my @expected_ids = split("\n", $expected[$i]);

		foreach (@expected_ids)
		{
			if (exists($actual_set{$_}))
			{
				$correct++;
			}
			$total++;
		}
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector(3));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 10000) i;"
);

# Generate queries
for (1 .. 20)
{
	my $r1 = rand();
	my $r2 = rand();
	my $r3 = rand();
	push(@queries, "[$r1,$r2,$r3]");
}

# Check each index type
my @operators = ("<->", "<#>", "<=>", "<+>");
my @opclasses = ("vector_l2_ops", "vector_ip_ops", "vector_cosine_ops", "vector_l1_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		my $res = $node->safe_psql("postgres", "SELECT i FROM tst ORDER BY v $operator '$_' LIMIT $limit;");
		push(@expected, $res);
	}

	# Build index serially
	$node->safe_psql("postgres", qq(
		SET max_parallel_maintenance_workers = 0;
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
	));

	# Test approximate results
	my $min = $operator eq "<#>" ? 0.97 : 0.99;
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel in memory
	my ($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		SET client_min_messages = DEBUG;
		SET min_parallel_table_scan_size = 1;
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);

	# Test approximate results
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel on disk
	# Set parallel_workers on table to use workers with low maintenance_work_mem
	($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		ALTER TABLE tst SET (parallel_workers = 2);
		SET client_min_messages = DEBUG;
		SET maintenance_work_mem = '4MB';
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
		ALTER TABLE tst RESET (parallel_workers);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);
	like($stderr, qr/hnsw graph no longer fits into maintenance_work_mem/);

	$node->safe_psql("postgres", "DROP INDEX idx;");
}

done_testing();



---
File: /pgvector-master/test/t/013_hnsw_vector_insert_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $array_sql = join(",", ('random() * random()') x 3);

sub test_recall
{
	my ($min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SELECT i FROM tst ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);
		my %actual_set = map { $_ => 1 } @actual_ids;

		my @expected_ids = split("\n", $expected[$i]);

		foreach (@expected_ids)
		{
			if (exists($actual_set{$_}))
			{
				$correct++;
			}
			$total++;
		}
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i serial, v vector(3));");

# Generate queries
for (1 .. 20)
{
	my $r1 = rand();
	my $r2 = rand();
	my $r3 = rand();
	push(@queries, "[$r1,$r2,$r3]");
}

# Check each index type
my @operators = ("<->", "<#>", "<=>", "<+>");
my @opclasses = ("vector_l2_ops", "vector_ip_ops", "vector_cosine_ops", "vector_l1_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Add index
	$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v $opclass);");

	# Use concurrent inserts
	$node->pgbench(
		"--no-vacuum --client=10 --transactions=1000",
		0,
		[qr{actually processed}],
		[qr{^$}],
		"concurrent INSERTs",
		{
			"013_hnsw_insert_recall_$opclass" => "INSERT INTO tst (v) VALUES (ARRAY[$array_sql]);"
		}
	);

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		my $res = $node->safe_psql("postgres", qq(
			SET enable_indexscan = off;
			SELECT i FROM tst ORDER BY v $operator '$_' LIMIT $limit;
		));
		push(@expected, $res);
	}

	# Test approximate results
	my $min = $operator eq "<#>" ? 0.97 : 0.99;
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");
	$node->safe_psql("postgres", "TRUNCATE tst;");
}

done_testing();



---
File: /pgvector-master/test/t/014_hnsw_vector_vacuum_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;

sub test_recall
{
	my ($min, $ef_search, $test_name) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = $ef_search;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v <-> '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET hnsw.ef_search = $ef_search;
			SELECT i FROM tst ORDER BY v <-> '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);
		my %actual_set = map { $_ => 1 } @actual_ids;

		my @expected_ids = split("\n", $expected[$i]);

		foreach (@expected_ids)
		{
			if (exists($actual_set{$_}))
			{
				$correct++;
			}
			$total++;
		}
	}

	cmp_ok($correct / $total, ">=", $min, $test_name);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector(3));");
$node->safe_psql("postgres", "ALTER TABLE tst SET (autovacuum_enabled = false);");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[random(), random(), random()] FROM generate_series(1, 10000) i;"
);

# Add index
$node->safe_psql("postgres", "CREATE INDEX ON tst USING hnsw (v vector_l2_ops) WITH (m = 4, ef_construction = 8);");

# Delete data
$node->safe_psql("postgres", "DELETE FROM tst WHERE i > 2500;");

# Generate queries
for (1 .. 20)
{
	my $r1 = rand();
	my $r2 = rand();
	my $r3 = rand();
	push(@queries, "[$r1,$r2,$r3]");
}

# Get exact results
@expected = ();
foreach (@queries)
{
	my $res = $node->safe_psql("postgres", qq(
		SET enable_indexscan = off;
		SELECT i FROM tst ORDER BY v <-> '$_' LIMIT $limit;
	));
	push(@expected, $res);
}

test_recall(0.18, $limit, "before vacuum");
test_recall(0.93, 100, "before vacuum");

# TODO Test concurrent inserts with vacuum
$node->safe_psql("postgres", "VACUUM tst;");

test_recall(0.95, $limit, "after vacuum");

done_testing();



---
File: /pgvector-master/test/t/015_hnsw_vector_duplicates.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (v vector(3));");

sub insert_vectors
{
	for my $i (1 .. 20)
	{
		$node->safe_psql("postgres", "INSERT INTO tst VALUES ('[1,1,1]');");
	}
}

sub test_duplicates
{
	my $res = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = 1;
		SELECT COUNT(*) FROM (SELECT * FROM tst ORDER BY v <-> '[1,1,1]') t;
	));
	is($res, 10);
}

# Test duplicates with build
insert_vectors();
$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v vector_l2_ops);");
test_duplicates();

# Reset
$node->safe_psql("postgres", "TRUNCATE tst;");

# Test duplicates with inserts
insert_vectors();
test_duplicates();

# Test fallback path for inserts
$node->pgbench(
	"--no-vacuum --client=5 --transactions=100",
	0,
	[qr{actually processed}],
	[qr{^$}],
	"concurrent INSERTs",
	{
		"015_hnsw_duplicates" => "INSERT INTO tst VALUES ('[1,1,1]');"
	}
);

done_testing();



---
File: /pgvector-master/test/t/016_hnsw_inserts.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Ensures elements and neighbors on both same and different pages
my $dim = 1900;

my $array_sql = join(",", ('random()') x $dim);

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table and index
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (v vector($dim));");
$node->safe_psql("postgres", "CREATE INDEX ON tst USING hnsw (v vector_l2_ops);");

sub idx_scan
{
	# Stats do not update instantaneously
	# https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-STATS-VIEWS
	sleep(1);
	$node->safe_psql("postgres", "SELECT idx_scan FROM pg_stat_user_indexes WHERE indexrelid = 'tst_v_idx'::regclass;");
}

for my $i (1 .. 20)
{
	$node->pgbench(
		"--no-vacuum --client=10 --transactions=1",
		0,
		[qr{actually processed}],
		[qr{^$}],
		"concurrent INSERTs",
		{
			"014_hnsw_inserts_$i" => "INSERT INTO tst VALUES (ARRAY[$array_sql]);"
		}
	);

	my $count = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SELECT COUNT(*) FROM (SELECT v FROM tst ORDER BY v <-> (SELECT v FROM tst LIMIT 1)) t;
	));
	is($count, 10);

	$node->safe_psql("postgres", "TRUNCATE tst;");
}

$node->pgbench(
	"--no-vacuum --client=20 --transactions=5",
	0,
	[qr{actually processed}],
	[qr{^$}],
	"concurrent INSERTs",
	{
		"014_hnsw_inserts" => "INSERT INTO tst SELECT ARRAY[$array_sql] FROM generate_series(1, 10) i;"
	}
);

my $count = $node->safe_psql("postgres", qq(
	SET enable_seqscan = off;
	SET hnsw.ef_search = 1000;
	SELECT COUNT(*) FROM (SELECT v FROM tst ORDER BY v <-> (SELECT v FROM tst LIMIT 1)) t;
));
# Elements may lose all incoming connections with the HNSW algorithm
# Vacuuming can fix this if one of the elements neighbors is deleted
cmp_ok($count, ">=", 997);

is(idx_scan(), 21);

done_testing();



---
File: /pgvector-master/test/t/017_hnsw_filtering.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $dim = 3;
my $nc = 50;
my $limit = 20;

my $array_sql = join(",", ('random()') x $dim);

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table and index
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector($dim), c int4, t text);");
$node->safe_psql("postgres", "CREATE TABLE cat (i int4 PRIMARY KEY, t text, b boolean);");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql], i % $nc, 'test ' || i FROM generate_series(1, 10000) i;"
);
$node->safe_psql("postgres",
	"INSERT INTO cat SELECT i, 'cat ' || i, i % 5 = 0 FROM generate_series(1, $nc) i;"
);
$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v vector_l2_ops);");
$node->safe_psql("postgres", "ANALYZE tst;");

# Generate query
my @r = ();
for (1 .. $dim)
{
	push(@r, rand());
}
my $query = "[" . join(",", @r) . "]";
my $c = int(rand() * $nc);

# Test attribute filtering
my $explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c = $c ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Seq Scan/);

# Test attribute filtering with few rows removed
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c != $c ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using idx/);

# Test attribute filtering with few rows removed comparison
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c >= 1 ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using idx/);

# Test attribute filtering with many rows removed comparison
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c < 1 ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Seq Scan/);

# Test attribute filtering with few rows removed like
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE t LIKE '%%test%%' ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using idx/);

# Test attribute filtering with many rows removed like
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE t LIKE '%%other%%' ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Seq Scan/);

# Test distance filtering
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE v <-> '$query' < 1 ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using idx/);

# Test distance filtering greater than distance
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE v <-> '$query' > 1 ORDER BY v <-> '$query' LIMIT $limit;
));
# TODO Do not use index
like($explain, qr/Index Scan using idx/);

# Test distance filtering without order
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE v <-> '$query' < 1;
));
like($explain, qr/Seq Scan/);

# Test distance filtering without limit
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE v <-> '$query' < 1 ORDER BY v <-> '$query';
));
like($explain, qr/Seq Scan/);

# Test join
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT cat.t FROM cat INNER JOIN tst ON cat.i = tst.c ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using idx/);

# Test join with attribute filtering
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT cat.t FROM cat INNER JOIN tst ON cat.i = tst.c WHERE cat.b = 't' ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using idx/);

# Test attribute index
$node->safe_psql("postgres", "CREATE INDEX attribute_idx ON tst (c);");
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c = $c ORDER BY v <-> '$query' LIMIT $limit;
));
# Use attribute index
like($explain, qr/Bitmap Index Scan on attribute_idx/);

# Test partial index
$node->safe_psql("postgres", "CREATE INDEX partial_idx ON tst USING hnsw (v vector_l2_ops) WHERE (c = $c);");
$explain = $node->safe_psql("postgres", qq(
	EXPLAIN ANALYZE SELECT i FROM tst WHERE c = $c ORDER BY v <-> '$query' LIMIT $limit;
));
like($explain, qr/Index Scan using partial_idx/);

done_testing();



---
File: /pgvector-master/test/t/018_aggregates.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (r1 real, r2 real, r3 real, v vector(3));");
$node->safe_psql("postgres", qq(
	INSERT INTO tst SELECT r1, r2, r3, ARRAY[r1, r2, r3] FROM (
		SELECT random() + 1.01 AS r1, random() + 2.01 AS r2, random() + 3.01 AS r3 FROM generate_series(1, 1000000) t
	) i;
));

sub test_aggregate
{
	my ($agg) = @_;

	# Test value
	my $res = $node->safe_psql("postgres", "SELECT $agg(v) FROM tst;");
	like($res, qr/\[1\.5/);
	like($res, qr/,2\.5/);
	like($res, qr/,3\.5/);

	# Test matches real for avg
	# Cannot test sum since sum(real) varies between calls
	if ($agg eq 'avg')
	{
		my $r1 = $node->safe_psql("postgres", "SELECT $agg(r1)::float4 FROM tst;");
		my $r2 = $node->safe_psql("postgres", "SELECT $agg(r2)::float4 FROM tst;");
		my $r3 = $node->safe_psql("postgres", "SELECT $agg(r3)::float4 FROM tst;");
		is($res, "[$r1,$r2,$r3]");
	}

	# Test explain
	my $explain = $node->safe_psql("postgres", "EXPLAIN SELECT $agg(v) FROM tst;");
	like($explain, qr/Partial Aggregate/);

	# Test halfvec
	$res = $node->safe_psql("postgres", "SELECT $agg(v::halfvec) FROM tst;");
	if ($agg eq 'avg')
	{
		like($res, qr/\[1\.5/);
		like($res, qr/,2\.5/);
		like($res, qr/,3\.5/);
	}
	else
	{
		# Does not raise overflow error in this instance due to loss of precision
		is($res, "[24576,24576,49152]");
	}
}

test_aggregate('avg');
test_aggregate('sum');

done_testing();



---
File: /pgvector-master/test/t/019_storage.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $dim = 1024;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (v1 vector(1024), v2 vector(1024), v3 vector(1024));");

# Test insert succeeds
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT array_agg(n), array_agg(n), array_agg(n) FROM generate_series(1, $dim) n"
);

# Change storage to PLAIN
$node->safe_psql("postgres", "ALTER TABLE tst ALTER COLUMN v1 SET STORAGE PLAIN");
$node->safe_psql("postgres", "ALTER TABLE tst ALTER COLUMN v2 SET STORAGE PLAIN");
$node->safe_psql("postgres", "ALTER TABLE tst ALTER COLUMN v3 SET STORAGE PLAIN");

# Test insert fails
my ($ret, $stdout, $stderr) = $node->psql("postgres",
	"INSERT INTO tst SELECT array_agg(n), array_agg(n), array_agg(n) FROM generate_series(1, $dim) n"
);
like($stderr, qr/row is too big/);

done_testing();



---
File: /pgvector-master/test/t/020_hnsw_bit_build_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $dim = 52;
my $max = 2**$dim;

sub test_recall
{
	my ($min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = 100;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator $queries[0] LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET hnsw.ef_search = 100;
			SELECT i FROM tst ORDER BY v $operator $queries[$i] LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);

		my @expected_ids = split("\n", $expected[$i]);
		my %expected_set = map { $_ => 1 } @expected_ids;

		foreach (@actual_ids)
		{
			if (exists($expected_set{$_}))
			{
				$correct++;
			}
		}

		$total += $limit;
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v bit($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, (random() * $max)::bigint::bit($dim) FROM generate_series(1, 10000) i;"
);

# Generate queries
for (1 .. 20)
{
	my $r = int(rand() * $max);
	push(@queries, "${r}::bigint::bit($dim)");
}

# Check each index type
my @operators = ("<~>", "<\%>");
my @opclasses = ("bit_hamming_ops", "bit_jaccard_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		# Handle ties
		my $res = $node->safe_psql("postgres", qq(
			WITH top AS (
				SELECT v $operator $_ AS distance FROM tst ORDER BY distance LIMIT $limit
			)
			SELECT i FROM tst WHERE (v $operator $_) <= (SELECT MAX(distance) FROM top)
		));
		push(@expected, $res);
	}

	# Build index serially
	$node->safe_psql("postgres", qq(
		SET max_parallel_maintenance_workers = 0;
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
	));

	# Test approximate results
	my $min = $operator eq "<\%>" ? 0.95 : 0.98;
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel in memory
	my ($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		SET client_min_messages = DEBUG;
		SET min_parallel_table_scan_size = 1;
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);

	# Test approximate results
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel on disk
	# Set parallel_workers on table to use workers with low maintenance_work_mem
	($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		ALTER TABLE tst SET (parallel_workers = 2);
		SET client_min_messages = DEBUG;
		SET maintenance_work_mem = '4MB';
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
		ALTER TABLE tst RESET (parallel_workers);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);
	like($stderr, qr/hnsw graph no longer fits into maintenance_work_mem/);

	$node->safe_psql("postgres", "DROP INDEX idx;");
}

done_testing();



---
File: /pgvector-master/test/t/021_hnsw_bit_insert_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $dim = 52;
my $max = 2**$dim;

sub test_recall
{
	my ($min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = 100;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator $queries[0] LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET hnsw.ef_search = 100;
			SELECT i FROM tst ORDER BY v $operator $queries[$i] LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);

		my @expected_ids = split("\n", $expected[$i]);
		my %expected_set = map { $_ => 1 } @expected_ids;

		foreach (@actual_ids)
		{
			if (exists($expected_set{$_}))
			{
				$correct++;
			}
		}

		$total += $limit;
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i serial, v bit($dim));");

# Generate queries
for (1 .. 20)
{
	my $r = int(rand() * $max);
	push(@queries, "${r}::bigint::bit($dim)");
}

# Check each index type
my @operators = ("<~>", "<\%>");
my @opclasses = ("bit_hamming_ops", "bit_jaccard_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Add index
	$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v $opclass);");

	# Use concurrent inserts
	$node->pgbench(
		"--no-vacuum --client=10 --transactions=1000",
		0,
		[qr{actually processed}],
		[qr{^$}],
		"concurrent INSERTs",
		{
			"023_hnsw_bit_insert_recall_$opclass" => "INSERT INTO tst (v) VALUES ((random() * $max)::bigint::bit($dim));"
		}
	);

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		# Handle ties
		my $res = $node->safe_psql("postgres", qq(
			SET enable_indexscan = off;
			WITH top AS (
				SELECT v $operator $_ AS distance FROM tst ORDER BY distance LIMIT $limit
			)
			SELECT i FROM tst WHERE (v $operator $_) <= (SELECT MAX(distance) FROM top)
		));
		push(@expected, $res);
	}

	# Test approximate results
	my $min = $operator eq "<\%>" ? 0.95 : 0.98;
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");
	$node->safe_psql("postgres", "TRUNCATE tst;");
}

done_testing();



---
File: /pgvector-master/test/t/022_hnsw_bit_vacuum_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $dim = 52;
my $max = 2**$dim;

sub test_recall
{
	my ($min, $ef_search, $test_name) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = $ef_search;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v <~> $queries[0] LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET hnsw.ef_search = $ef_search;
			SELECT i FROM tst ORDER BY v <~> $queries[$i] LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);

		my @expected_ids = split("\n", $expected[$i]);
		my %expected_set = map { $_ => 1 } @expected_ids;

		foreach (@actual_ids)
		{
			if (exists($expected_set{$_}))
			{
				$correct++;
			}
		}

		$total += $limit;
	}

	cmp_ok($correct / $total, ">=", $min, $test_name);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v bit($dim));");
$node->safe_psql("postgres", "ALTER TABLE tst SET (autovacuum_enabled = false);");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, (random() * $max)::bigint::bit($dim) FROM generate_series(1, 10000) i;"
);

# Add index
$node->safe_psql("postgres", "CREATE INDEX ON tst USING hnsw (v bit_hamming_ops) WITH (m = 4, ef_construction = 8);");

# Delete data
$node->safe_psql("postgres", "DELETE FROM tst WHERE i > 2500;");

# Generate queries
for (1 .. 20)
{
	my $r = int(rand() * $max);
	push(@queries, "${r}::bigint::bit($dim)");
}

# Get exact results
@expected = ();
foreach (@queries)
{
	my $res = $node->safe_psql("postgres", qq(
		SET enable_indexscan = off;
		WITH top AS (
			SELECT v <~> $_ AS distance FROM tst ORDER BY distance LIMIT $limit
		)
		SELECT i FROM tst WHERE (v <~> $_) <= (SELECT MAX(distance) FROM top)
	));
	push(@expected, $res);
}

test_recall(0.35, 100, "before vacuum");

# TODO Test concurrent inserts with vacuum
$node->safe_psql("postgres", "VACUUM tst;");

test_recall(0.80, 100, "after vacuum");

done_testing();



---
File: /pgvector-master/test/t/023_hnsw_bit_duplicates.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (v bit(3));");

sub insert_vectors
{
	for my $i (1 .. 20)
	{
		$node->safe_psql("postgres", "INSERT INTO tst VALUES ('111');");
	}
}

sub test_duplicates
{
	my $res = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = 1;
		SELECT COUNT(*) FROM (SELECT * FROM tst ORDER BY v <~> '111') t;
	));
	is($res, 10);
}

# Test duplicates with build
insert_vectors();
$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v bit_hamming_ops);");
test_duplicates();

# Reset
$node->safe_psql("postgres", "TRUNCATE tst;");

# Test duplicates with inserts
insert_vectors();
test_duplicates();

# Test fallback path for inserts
$node->pgbench(
	"--no-vacuum --client=5 --transactions=100",
	0,
	[qr{actually processed}],
	[qr{^$}],
	"concurrent INSERTs",
	{
		"026_hnsw_bit_duplicates" => "INSERT INTO tst VALUES ('111');"
	}
);

done_testing();



---
File: /pgvector-master/test/t/024_hnsw_halfvec_build_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $dim = 10;
my $array_sql = join(",", ('2 * random() * random()') x $dim);

sub test_recall
{
	my ($min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SELECT i FROM tst ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);
		my %actual_set = map { $_ => 1 } @actual_ids;

		my @expected_ids = split("\n", $expected[$i]);

		foreach (@expected_ids)
		{
			if (exists($actual_set{$_}))
			{
				$correct++;
			}
			$total++;
		}
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v halfvec($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 10000) i;"
);

# Generate queries
for (1 .. 20)
{
	my @r = ();
	for (1 .. $dim)
	{
		push(@r, rand());
	}
	push(@queries, "[" . join(",", @r) . "]");
}

# Check each index type
my @operators = ("<->", "<#>", "<=>", "<+>");
my @opclasses = ("halfvec_l2_ops", "halfvec_ip_ops", "halfvec_cosine_ops", "halfvec_l1_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		my $res = $node->safe_psql("postgres", "SELECT i FROM tst ORDER BY v $operator '$_' LIMIT $limit;");
		push(@expected, $res);
	}

	# Build index serially
	$node->safe_psql("postgres", qq(
		SET max_parallel_maintenance_workers = 0;
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
	));

	# Test approximate results
	my $min = 0.98;
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel in memory
	my ($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		SET client_min_messages = DEBUG;
		SET min_parallel_table_scan_size = 1;
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);

	# Test approximate results
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel on disk
	# Set parallel_workers on table to use workers with low maintenance_work_mem
	($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		ALTER TABLE tst SET (parallel_workers = 2);
		SET client_min_messages = DEBUG;
		SET maintenance_work_mem = '4MB';
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
		ALTER TABLE tst RESET (parallel_workers);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);
	like($stderr, qr/hnsw graph no longer fits into maintenance_work_mem/);

	$node->safe_psql("postgres", "DROP INDEX idx;");
}

done_testing();



---
File: /pgvector-master/test/t/025_hnsw_halfvec_insert_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $dim = 10;
my $array_sql = join(",", ('2 * random() * random()') x $dim);

sub test_recall
{
	my ($min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SELECT i FROM tst ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);
		my %actual_set = map { $_ => 1 } @actual_ids;

		my @expected_ids = split("\n", $expected[$i]);

		foreach (@expected_ids)
		{
			if (exists($actual_set{$_}))
			{
				$correct++;
			}
			$total++;
		}
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i serial, v halfvec($dim));");

# Generate queries
for (1 .. 20)
{
	my @r = ();
	for (1 .. $dim)
	{
		push(@r, rand());
	}
	push(@queries, "[" . join(",", @r) . "]");
}

# Check each index type
my @operators = ("<->", "<#>", "<=>", "<+>");
my @opclasses = ("halfvec_l2_ops", "halfvec_ip_ops", "halfvec_cosine_ops", "halfvec_l1_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Add index
	$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v $opclass);");

	# Use concurrent inserts
	$node->pgbench(
		"--no-vacuum --client=10 --transactions=1000",
		0,
		[qr{actually processed}],
		[qr{^$}],
		"concurrent INSERTs",
		{
			"024_hnsw_halfvec_insert_recall_$opclass" => "INSERT INTO tst (v) VALUES (ARRAY[$array_sql]);"
		}
	);

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		my $res = $node->safe_psql("postgres", qq(
			SET enable_indexscan = off;
			SELECT i FROM tst ORDER BY v $operator '$_' LIMIT $limit;
		));
		push(@expected, $res);
	}

	# Test approximate results
	my $min = 0.98;
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");
	$node->safe_psql("postgres", "TRUNCATE tst;");
}

done_testing();



---
File: /pgvector-master/test/t/026_hnsw_halfvec_vacuum_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;

sub test_recall
{
	my ($min, $ef_search, $test_name) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = $ef_search;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v <-> '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET hnsw.ef_search = $ef_search;
			SELECT i FROM tst ORDER BY v <-> '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);
		my %actual_set = map { $_ => 1 } @actual_ids;

		my @expected_ids = split("\n", $expected[$i]);

		foreach (@expected_ids)
		{
			if (exists($actual_set{$_}))
			{
				$correct++;
			}
			$total++;
		}
	}

	cmp_ok($correct / $total, ">=", $min, $test_name);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v halfvec(3));");
$node->safe_psql("postgres", "ALTER TABLE tst SET (autovacuum_enabled = false);");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[random(), random(), random()] FROM generate_series(1, 10000) i;"
);

# Add index
$node->safe_psql("postgres", "CREATE INDEX ON tst USING hnsw (v halfvec_l2_ops) WITH (m = 4, ef_construction = 8);");

# Delete data
$node->safe_psql("postgres", "DELETE FROM tst WHERE i > 2500;");

# Generate queries
for (1 .. 20)
{
	my $r1 = rand();
	my $r2 = rand();
	my $r3 = rand();
	push(@queries, "[$r1,$r2,$r3]");
}

# Get exact results
@expected = ();
foreach (@queries)
{
	my $res = $node->safe_psql("postgres", qq(
		SET enable_indexscan = off;
		SELECT i FROM tst ORDER BY v <-> '$_' LIMIT $limit;
	));
	push(@expected, $res);
}

test_recall(0.18, $limit, "before vacuum");
test_recall(0.93, 100, "before vacuum");

# TODO Test concurrent inserts with vacuum
$node->safe_psql("postgres", "VACUUM tst;");

test_recall(0.95, $limit, "after vacuum");

done_testing();



---
File: /pgvector-master/test/t/027_hnsw_halfvec_duplicates.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (v halfvec(3));");

sub insert_vectors
{
	for my $i (1 .. 20)
	{
		$node->safe_psql("postgres", "INSERT INTO tst VALUES ('[1,1,1]');");
	}
}

sub test_duplicates
{
	my $res = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = 1;
		SELECT COUNT(*) FROM (SELECT * FROM tst ORDER BY v <-> '[1,1,1]') t;
	));
	is($res, 10);
}

# Test duplicates with build
insert_vectors();
$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v halfvec_l2_ops);");
test_duplicates();

# Reset
$node->safe_psql("postgres", "TRUNCATE tst;");

# Test duplicates with inserts
insert_vectors();
test_duplicates();

# Test fallback path for inserts
$node->pgbench(
	"--no-vacuum --client=5 --transactions=100",
	0,
	[qr{actually processed}],
	[qr{^$}],
	"concurrent INSERTs",
	{
		"027_hnsw_halfvec_duplicates" => "INSERT INTO tst VALUES ('[1,1,1]');"
	}
);

done_testing();



---
File: /pgvector-master/test/t/028_hnsw_sparsevec_build_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $array_sql = join(",", ('random() * random()') x 3);

sub test_recall
{
	my ($min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SELECT i FROM tst ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);
		my %actual_set = map { $_ => 1 } @actual_ids;

		my @expected_ids = split("\n", $expected[$i]);

		foreach (@expected_ids)
		{
			if (exists($actual_set{$_}))
			{
				$correct++;
			}
			$total++;
		}
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v sparsevec(3));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql]::vector::sparsevec FROM generate_series(1, 10000) i;"
);

# Generate queries
for (1 .. 20)
{
	my $r1 = rand();
	my $r2 = rand();
	my $r3 = rand();
	push(@queries, "{1:$r1,2:$r2,3:$r3}/3");
}

# Check each index type
my @operators = ("<->", "<#>", "<=>", "<+>");
my @opclasses = ("sparsevec_l2_ops", "sparsevec_ip_ops", "sparsevec_cosine_ops", "sparsevec_l1_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		my $res = $node->safe_psql("postgres", "SELECT i FROM tst ORDER BY v $operator '$_' LIMIT $limit;");
		push(@expected, $res);
	}

	# Build index serially
	$node->safe_psql("postgres", qq(
		SET max_parallel_maintenance_workers = 0;
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
	));

	# Test approximate results
	my $min = $operator eq "<#>" ? 0.97 : 0.99;
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel in memory
	my ($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		SET client_min_messages = DEBUG;
		SET min_parallel_table_scan_size = 1;
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);

	# Test approximate results
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel on disk
	# Set parallel_workers on table to use workers with low maintenance_work_mem
	($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		ALTER TABLE tst SET (parallel_workers = 2);
		SET client_min_messages = DEBUG;
		SET maintenance_work_mem = '4MB';
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
		ALTER TABLE tst RESET (parallel_workers);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);
	like($stderr, qr/hnsw graph no longer fits into maintenance_work_mem/);

	$node->safe_psql("postgres", "DROP INDEX idx;");
}

done_testing();



---
File: /pgvector-master/test/t/029_hnsw_sparsevec_insert_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $array_sql = join(",", ('random() * random()') x 3);

sub test_recall
{
	my ($min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SELECT i FROM tst ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);
		my %actual_set = map { $_ => 1 } @actual_ids;

		my @expected_ids = split("\n", $expected[$i]);

		foreach (@expected_ids)
		{
			if (exists($actual_set{$_}))
			{
				$correct++;
			}
			$total++;
		}
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i serial, v sparsevec(3));");

# Generate queries
for (1 .. 20)
{
	my $r1 = rand();
	my $r2 = rand();
	my $r3 = rand();
	push(@queries, "{1:$r1,2:$r2,3:$r3}/3");
}

# Check each index type
my @operators = ("<->", "<#>", "<=>", "<+>");
my @opclasses = ("sparsevec_l2_ops", "sparsevec_ip_ops", "sparsevec_cosine_ops", "sparsevec_l1_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Add index
	$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v $opclass);");

	# Use concurrent inserts
	$node->pgbench(
		"--no-vacuum --client=10 --transactions=1000",
		0,
		[qr{actually processed}],
		[qr{^$}],
		"concurrent INSERTs",
		{
			"025_hnsw_sparsevec_insert_recall_$opclass" => "INSERT INTO tst (v) VALUES (ARRAY[$array_sql]::vector::sparsevec);"
		}
	);

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		my $res = $node->safe_psql("postgres", qq(
			SET enable_indexscan = off;
			SELECT i FROM tst ORDER BY v $operator '$_' LIMIT $limit;
		));
		push(@expected, $res);
	}

	# Test approximate results
	my $min = $operator eq "<#>" ? 0.97 : 0.99;
	test_recall($min, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");
	$node->safe_psql("postgres", "TRUNCATE tst;");
}

done_testing();



---
File: /pgvector-master/test/t/030_hnsw_sparsevec_vacuum_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;

sub test_recall
{
	my ($min, $ef_search, $test_name) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = $ef_search;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v <-> '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET hnsw.ef_search = $ef_search;
			SELECT i FROM tst ORDER BY v <-> '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);
		my %actual_set = map { $_ => 1 } @actual_ids;

		my @expected_ids = split("\n", $expected[$i]);

		foreach (@expected_ids)
		{
			if (exists($actual_set{$_}))
			{
				$correct++;
			}
			$total++;
		}
	}

	cmp_ok($correct / $total, ">=", $min, $test_name);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v sparsevec(3));");
$node->safe_psql("postgres", "ALTER TABLE tst SET (autovacuum_enabled = false);");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[random(), random(), random()]::vector::sparsevec(3) FROM generate_series(1, 10000) i;"
);

# Add index
$node->safe_psql("postgres", "CREATE INDEX ON tst USING hnsw (v sparsevec_l2_ops) WITH (m = 4, ef_construction = 8);");

# Delete data
$node->safe_psql("postgres", "DELETE FROM tst WHERE i > 2500;");

# Generate queries
for (1 .. 20)
{
	my $r1 = rand();
	my $r2 = rand();
	my $r3 = rand();
	push(@queries, "{1:$r1,2:$r2,3:$r3}/3");
}

# Get exact results
@expected = ();
foreach (@queries)
{
	my $res = $node->safe_psql("postgres", qq(
		SET enable_indexscan = off;
		SELECT i FROM tst ORDER BY v <-> '$_' LIMIT $limit;
	));
	push(@expected, $res);
}

test_recall(0.18, $limit, "before vacuum");
test_recall(0.93, 100, "before vacuum");

# TODO Test concurrent inserts with vacuum
$node->safe_psql("postgres", "VACUUM tst;");

test_recall(0.95, $limit, "after vacuum");

done_testing();



---
File: /pgvector-master/test/t/031_hnsw_sparsevec_duplicates.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (v sparsevec(3));");

sub insert_vectors
{
	for my $i (1 .. 20)
	{
		$node->safe_psql("postgres", "INSERT INTO tst VALUES ('{1:1,2:1,3:1}/3');");
	}
}

sub test_duplicates
{
	my $res = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = 1;
		SELECT COUNT(*) FROM (SELECT * FROM tst ORDER BY v <-> '{1:1,2:1,3:1}/3') t;
	));
	is($res, 10);
}

# Test duplicates with build
insert_vectors();
$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v sparsevec_l2_ops);");
test_duplicates();

# Reset
$node->safe_psql("postgres", "TRUNCATE tst;");

# Test duplicates with inserts
insert_vectors();
test_duplicates();

# Test fallback path for inserts
$node->pgbench(
	"--no-vacuum --client=5 --transactions=100",
	0,
	[qr{actually processed}],
	[qr{^$}],
	"concurrent INSERTs",
	{
		"028_hnsw_sparsevec_duplicates" => "INSERT INTO tst VALUES ('{1:1,2:1,3:1}/3');"
	}
);

done_testing();



---
File: /pgvector-master/test/t/032_ivfflat_halfvec_build_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $dim = 10;
my $array_sql = join(",", ('random()') x $dim);

sub test_recall
{
	my ($probes, $min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET ivfflat.probes = $probes;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan using idx on tst/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET ivfflat.probes = $probes;
			SELECT i FROM tst ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);

		my @expected_ids = split("\n", $expected[$i]);
		my %expected_set = map { $_ => 1 } @expected_ids;

		foreach (@actual_ids)
		{
			if (exists($expected_set{$_}))
			{
				$correct++;
			}
		}

		$total += $limit;
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v halfvec($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 100000) i;"
);

# Generate queries
for (1 .. 20)
{
	my @r = ();
	for (1 .. $dim)
	{
		push(@r, rand());
	}
	push(@queries, "[" . join(",", @r) . "]");
}

# Check each index type
my @operators = ("<->", "<#>", "<=>");
my @opclasses = ("halfvec_l2_ops", "halfvec_ip_ops", "halfvec_cosine_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		my $res = $node->safe_psql("postgres", qq(
			WITH top AS (
				SELECT v $operator '$_' AS distance FROM tst ORDER BY distance LIMIT $limit
			)
			SELECT i FROM tst WHERE (v $operator '$_') <= (SELECT MAX(distance) FROM top)
		));
		push(@expected, $res);
	}

	# Build index serially
	$node->safe_psql("postgres", qq(
		SET max_parallel_maintenance_workers = 0;
		CREATE INDEX idx ON tst USING ivfflat (v $opclass);
	));

	# Test approximate results
	if ($operator ne "<#>")
	{
		# TODO Fix test (uniform random vectors all have similar inner product)
		test_recall(1, 0.33, $operator);
		test_recall(10, 0.93, $operator);
	}

	# Test probes equals lists
	if ($operator eq "<=>")
	{
		test_recall(100, 0.98, $operator);
	}
	else
	{
		test_recall(100, 1.00, $operator);
	}

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel
	my ($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		SET client_min_messages = DEBUG;
		SET min_parallel_table_scan_size = 1;
		CREATE INDEX idx ON tst USING ivfflat (v $opclass);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);

	# Test approximate results
	if ($operator ne "<#>")
	{
		# TODO Fix test (uniform random vectors all have similar inner product)
		test_recall(1, 0.33, $operator);
		test_recall(10, 0.93, $operator);
	}

	# Test probes equals lists
	if ($operator eq "<=>")
	{
		test_recall(100, 0.98, $operator);
	}
	else
	{
		test_recall(100, 1.00, $operator);
	}

	$node->safe_psql("postgres", "DROP INDEX idx;");
}

done_testing();



---
File: /pgvector-master/test/t/033_comparison.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my $array_sql = join(",", ('floor(random() * 2)::int - 1') x 3);

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (v real[]);");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT ARRAY[$array_sql] FROM generate_series(1, 10000) i;"
);

for (1 .. 50)
{
	# Generate query
	my @r = ();
	for (1 .. (int(rand() * 3) + 2))
	{
		push(@r, int(rand() * 2) - 1);
	}
	my $query = "{" . join(",", @r) . "}";

	# Get expected result
	my $expected = $node->safe_psql("postgres", "SELECT btarraycmp(v, '$query') FROM tst");

	# Test vector
	my $actual = $node->safe_psql("postgres", "SELECT vector_cmp(v::vector, '$query'::real[]::vector) FROM tst");
	is($expected, $actual);

	# Test halfvec
	$actual = $node->safe_psql("postgres", "SELECT halfvec_cmp(v::halfvec, '$query'::real[]::halfvec) FROM tst");
	is($expected, $actual);

	# Test sparsevec
	$actual = $node->safe_psql("postgres", "SELECT sparsevec_cmp(v::vector::sparsevec, '$query'::real[]::vector::sparsevec) FROM tst");
	is($expected, $actual);
}

done_testing();



---
File: /pgvector-master/test/t/034_distance_functions.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my $dim = 5;
my $array_sql = join(",", ('floor(random() * 4)::int - 2') x $dim);

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (v vector($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT ARRAY[$array_sql] FROM generate_series(1, 10000) i;"
);

# Generate queries
for (1 .. 20)
{
	my @r = ();
	for (1 .. $dim)
	{
		push(@r, int(rand() * 4) - 2);
	}
	push(@queries, "[" . join(",", @r) . "]");
}

# Check each distance function
my @functions = ("l2_distance", "inner_product", "cosine_distance", "l1_distance");

for my $function (@functions)
{
	for my $query (@queries)
	{
		my $expected = $node->safe_psql("postgres", "SELECT $function(v, '$query') FROM tst");

		# Test halfvec
		my $actual = $node->safe_psql("postgres", "SELECT $function(v::halfvec, '$query'::vector::halfvec) FROM tst");
		is($expected, $actual, "halfvec $function");

		# Test sparsevec
		$actual = $node->safe_psql("postgres", "SELECT $function(v::sparsevec, '$query'::vector::sparsevec) FROM tst");
		is($expected, $actual, "sparsevec $function");
	}
}

done_testing();



---
File: /pgvector-master/test/t/035_ivfflat_bit_build_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $dim = 52;
my $max = 2**$dim;

sub test_recall
{
	my ($probes, $min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET ivfflat.probes = $probes;
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v $operator $queries[0] LIMIT $limit;
	));
	like($explain, qr/Index Scan using idx on tst/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET ivfflat.probes = $probes;
			SELECT i FROM tst ORDER BY v $operator $queries[$i] LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);

		my @expected_ids = split("\n", $expected[$i]);
		my %expected_set = map { $_ => 1 } @expected_ids;

		foreach (@actual_ids)
		{
			if (exists($expected_set{$_}))
			{
				$correct++;
			}
		}

		$total += $limit;
	}

	cmp_ok($correct / $total, ">=", $min, $operator);
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v bit($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, (random() * $max)::bigint::bit($dim) FROM generate_series(1, 100000) i;"
);

# Generate queries
for (1 .. 20)
{
	my $r = int(rand() * $max);
	push(@queries, "${r}::bigint::bit($dim)");
}

# Check each index type
my @operators = ("<~>");
my @opclasses = ("bit_hamming_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	# Get exact results
	@expected = ();
	foreach (@queries)
	{
		my $res = $node->safe_psql("postgres", qq(
			WITH top AS (
				SELECT v $operator $_ AS distance FROM tst ORDER BY distance LIMIT $limit
			)
			SELECT i FROM tst WHERE (v $operator $_) <= (SELECT MAX(distance) FROM top)
		));
		push(@expected, $res);
	}

	# Build index serially
	$node->safe_psql("postgres", qq(
		SET max_parallel_maintenance_workers = 0;
		CREATE INDEX idx ON tst USING ivfflat (v $opclass);
	));

	# Test approximate results
	test_recall(1, 0.08, $operator);
	test_recall(10, 0.50, $operator);

	# Test probes equals lists
	test_recall(100, 1.00, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");

	# Build index in parallel
	my ($ret, $stdout, $stderr) = $node->psql("postgres", qq(
		SET client_min_messages = DEBUG;
		SET min_parallel_table_scan_size = 1;
		CREATE INDEX idx ON tst USING ivfflat (v $opclass);
	));
	is($ret, 0, $stderr);
	like($stderr, qr/using \d+ parallel workers/);

	# Test approximate results
	test_recall(1, 0.08, $operator);
	test_recall(10, 0.50, $operator);

	# Test probes equals lists
	test_recall(100, 1.00, $operator);

	$node->safe_psql("postgres", "DROP INDEX idx;");
}

done_testing();



---
File: /pgvector-master/test/t/036_ivfflat_bit_centers.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v bit(3));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, floor(random() * 8)::bigint::bit(3) FROM generate_series(1, 100) i;"
);

my $counts = $node->safe_psql("postgres", "SELECT v, COUNT(*) FROM tst GROUP BY 1 ORDER BY 1");
my @rows = split("\n", $counts);
is(scalar(@rows), 8);

# Create index with more lists than distinct values
$node->safe_psql("postgres", "CREATE INDEX ON tst USING ivfflat (v bit_hamming_ops) WITH (lists = 100);");

for my $row (@rows)
{
	my ($v, $count) = split(/\|/, $row);

	my $actual = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SELECT i FROM tst ORDER BY v <~> '$v' LIMIT 100;
	));
	my @actual_ids = split("\n", $actual);

	# Test results are always found
	is(scalar(@actual_ids), $count);
}

done_testing();



---
File: /pgvector-master/test/t/037_inputs.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create extension
$node->safe_psql("postgres", "CREATE EXTENSION vector;");

my @types = ("vector", "halfvec", "sparsevec");
my @inputs = ("[1.23,4.56,7.89]", "[1.23,4.56,7.89]", "{1:1.23,2:4.56,3:7.89}/3");
my @subs = (" ", " ", ",", ":", "-", "1", "9", "\0", "2147483648", "-2147483649");

for my $i (0 .. $#types)
{
	my $type = $types[$i];

	for (1 .. 100)
	{
		my $input = $inputs[$i] . "";

		for (1 .. 1 + int(rand() * 2))
		{
			my $r = int(rand() * length($input));
			my $sub = $subs[int(rand() * scalar(@subs))];
			if ($sub eq "\0")
			{
				# Truncate
				$input = substr($input, 0, $r);
			}
			elsif (rand() > 0.5)
			{
				# Insert
				substr($input, $r, 0) = $sub;
			}
			else
			{
				# Replace
				substr($input, $r, length($sub), $sub);
			}
		}

		my ($ret, $stdout, $stderr) = $node->psql("postgres", "SELECT '$input'::$type;");
		if ($ret != 0)
		{
			# Test for type in error message
			like($stderr, qr/$type/);
		}
		else
		{
			# Count test
			is($ret, 0);
		}
	}
}

done_testing();



---
File: /pgvector-master/test/t/038_hnsw_sparsevec_vacuum_insert.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table and index
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i serial, v sparsevec(100000));");
$node->safe_psql("postgres", "CREATE INDEX ON tst USING hnsw (v sparsevec_l2_ops);");

for (1 .. 3)
{
	for (1 .. 100)
	{
		my @elements;
		my %indices;
		for (1 .. int(rand() * 100))
		{
			my $index = int(rand() * (100000 - 1)) + 1;
			if (!exists($indices{$index}))
			{
				my $value = rand();
				push(@elements, "$index:$value");
				$indices{$index} = 1;
			}
		}
		my $embedding = "{" . join(",", @elements) . "}/100000";
		$node->safe_psql("postgres", "INSERT INTO tst (v) VALUES ('$embedding');");
	}

	$node->safe_psql("postgres", "DELETE FROM tst WHERE i % 2 = 0;");
	$node->safe_psql("postgres", "VACUUM tst;");
	is(1, 1);
}

done_testing();



---
File: /pgvector-master/test/t/039_hnsw_cost.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my @dims = (384, 1536);
my $limit = 10;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

$node->safe_psql("postgres", "CREATE EXTENSION vector;");

for my $dim (@dims)
{
	my $array_sql = join(",", ('random()') x $dim);

	# Create table and index
	$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector($dim));");
	$node->safe_psql("postgres",
		"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 2000) i;"
	);
	$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v vector_l2_ops);");
	$node->safe_psql("postgres", "ANALYZE tst;");

	# Generate query
	my @r = ();
	for (1 .. $dim)
	{
		push(@r, rand());
	}
	my $query = "[" . join(",", @r) . "]";

	my $explain = $node->safe_psql("postgres", qq(
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v <-> '$query' LIMIT $limit;
	));
	like($explain, qr/Index Scan using idx/);

	# 3x the rows are needed for distance filters
	# since the planner uses DEFAULT_INEQ_SEL for the selectivity (should be 1)
	# Recreate index for performance
	$node->safe_psql("postgres", "DROP INDEX idx;");
	$node->safe_psql("postgres",
		"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(2001, 6000) i;"
	);
	$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING hnsw (v vector_l2_ops);");
	$node->safe_psql("postgres", "ANALYZE tst;");

	$explain = $node->safe_psql("postgres", qq(
		EXPLAIN ANALYZE SELECT i FROM tst WHERE v <-> '$query' < 1 ORDER BY v <-> '$query' LIMIT $limit;
	));
	like($explain, qr/Index Scan using idx/);

	$node->safe_psql("postgres", "DROP TABLE tst;");
}

done_testing();



---
File: /pgvector-master/test/t/040_ivfflat_cost.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my @dims = (384, 1536);
my $limit = 10;

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

$node->safe_psql("postgres", "CREATE EXTENSION vector;");

for my $dim (@dims)
{
	my $array_sql = join(",", ('random()') x $dim);

	# Create table and index
	$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector($dim));");
	$node->safe_psql("postgres",
		"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 5000) i;"
	);
	$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING ivfflat (v vector_l2_ops) WITH (lists = 5);");
	$node->safe_psql("postgres", "ANALYZE tst;");

	# Generate query
	my @r = ();
	for (1 .. $dim)
	{
		push(@r, rand());
	}
	my $query = "[" . join(",", @r) . "]";

	my $explain = $node->safe_psql("postgres", qq(
		EXPLAIN ANALYZE SELECT i FROM tst ORDER BY v <-> '$query' LIMIT $limit;
	));
	like($explain, qr/Index Scan using idx/);

	$explain = $node->safe_psql("postgres", qq(
		EXPLAIN ANALYZE SELECT i FROM tst WHERE v <-> '$query' < 1 ORDER BY v <-> '$query' LIMIT $limit;
	));
	like($explain, qr/Index Scan using idx/);

	$node->safe_psql("postgres", "DROP TABLE tst;");
}

done_testing();



---
File: /pgvector-master/test/t/041_ivfflat_iterative_scan.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $dim = 3;
my $array_sql = join(",", ('random()') x $dim);

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4 PRIMARY KEY, v vector($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 100000) i;"
);
$node->safe_psql("postgres", "CREATE INDEX ON tst USING ivfflat (v vector_l2_ops);");

my $count = $node->safe_psql("postgres", qq(
	SET enable_seqscan = off;
	SET ivfflat.probes = 10;
	SET ivfflat.iterative_scan = relaxed_order;
	SELECT COUNT(*) FROM (SELECT v FROM tst WHERE i % 10000 = 0 ORDER BY v <-> (SELECT v FROM tst LIMIT 1) LIMIT 11) t;
));
is($count, 10);

foreach ((30, 50, 70))
{
	my $max_probes = $_;
	my $expected = $max_probes / 10;
	my $sum = 0;

	for my $i (1 .. 20)
	{
		$count = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET ivfflat.probes = 10;
			SET ivfflat.iterative_scan = relaxed_order;
			SET ivfflat.max_probes = $max_probes;
			SELECT COUNT(*) FROM (SELECT v FROM tst WHERE i % 10000 = 0 ORDER BY v <-> (SELECT v FROM tst WHERE i = $i) LIMIT 11) t;
		));
		$sum += $count;
	}

	my $avg = $sum / 20;
	cmp_ok($avg, '>', $expected - 2);
	cmp_ok($avg, '<', $expected + 2);
}

done_testing();



---
File: /pgvector-master/test/t/042_ivfflat_iterative_scan_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my @cs = (100, 1000);

sub test_recall
{
	my ($c, $probes, $min, $operator) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET ivfflat.probes = $probes;
		SET ivfflat.iterative_scan = relaxed_order;
		EXPLAIN ANALYZE SELECT i FROM tst WHERE i % $c = 0 ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan using idx on tst/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET ivfflat.probes = $probes;
			SET ivfflat.iterative_scan = relaxed_order;
			SELECT i FROM tst WHERE i % $c = 0 ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);

		my @expected_ids = split("\n", $expected[$i]);
		my %expected_set = map { $_ => 1 } @expected_ids;

		foreach (@actual_ids)
		{
			if (exists($expected_set{$_}))
			{
				$correct++;
			}
		}

		$total += $limit;
	}

	cmp_ok($correct / $total, ">=", $min, "$operator $c");
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector(3));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[random(), random(), random()] FROM generate_series(1, 100000) i;"
);

# Generate queries
for (1 .. 20)
{
	my $r1 = rand();
	my $r2 = rand();
	my $r3 = rand();
	push(@queries, "[$r1,$r2,$r3]");
}

# Check each index type
my @operators = ("<->", "<=>");
my @opclasses = ("vector_l2_ops", "vector_cosine_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	$node->safe_psql("postgres", "CREATE INDEX idx ON tst USING ivfflat (v $opclass);");

	foreach (@cs)
	{
		my $c = $_;

		# Get exact results
		@expected = ();
		foreach (@queries)
		{
			my $res = $node->safe_psql("postgres", qq(
				SET enable_indexscan = off;
				WITH top AS (
					SELECT v $operator '$_' AS distance FROM tst WHERE i % $c = 0 ORDER BY distance LIMIT $limit
				)
				SELECT i FROM tst WHERE (v $operator '$_') <= (SELECT MAX(distance) FROM top)
			));
			push(@expected, $res);
		}

		if ($c == 100)
		{
			test_recall($c, 1, 0.57, $operator);
			test_recall($c, 10, 0.98, $operator);
		}
		else
		{
			if ($operator eq "<->")
			{
				test_recall($c, 1, 0.80, $operator);
			}
			else
			{
				test_recall($c, 1, 0.88, $operator);
			}
		}
	}

	$node->safe_psql("postgres", "DROP INDEX idx;");
}

done_testing();



---
File: /pgvector-master/test/t/043_hnsw_iterative_scan.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $dim = 3;
my $array_sql = join(",", ('random()') x $dim);

# Initialize node
my $node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4 PRIMARY KEY, v vector($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 100000) i;"
);
$node->safe_psql("postgres", qq(
	SET maintenance_work_mem = '128MB';
	SET max_parallel_maintenance_workers = 2;
	CREATE INDEX ON tst USING hnsw (v vector_l2_ops)
));

my $count = $node->safe_psql("postgres", qq(
	SET enable_seqscan = off;
	SET hnsw.iterative_scan = relaxed_order;
	SET hnsw.max_scan_tuples = 100000;
	SET hnsw.scan_mem_multiplier = 2;
	SELECT COUNT(*) FROM (SELECT v FROM tst WHERE i % 10000 = 0 ORDER BY v <-> (SELECT v FROM tst LIMIT 1) LIMIT 11) t;
));
is($count, 10);

foreach ((30000, 50000, 70000))
{
	my $max_tuples = $_;
	my $expected = $max_tuples / 10000;
	my $sum = 0;

	for my $i (1 .. 20)
	{
		$count = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET hnsw.iterative_scan = relaxed_order;
			SET hnsw.max_scan_tuples = $max_tuples;
			SET hnsw.scan_mem_multiplier = 2;
			SELECT COUNT(*) FROM (SELECT v FROM tst WHERE i % 10000 = 0 ORDER BY v <-> (SELECT v FROM tst WHERE i = $i) LIMIT 11) t;
		));
		$sum += $count;
	}

	my $avg = $sum / 20;
	cmp_ok($avg, '>', $expected - 2);
	cmp_ok($avg, '<', $expected + 2);
}

done_testing();



---
File: /pgvector-master/test/t/044_hnsw_iterative_scan_recall.pl
---

use strict;
use warnings FATAL => 'all';
use PostgreSQL::Test::Cluster;
use PostgreSQL::Test::Utils;
use Test::More;

my $node;
my @queries = ();
my @expected;
my $limit = 20;
my $dim = 3;
my $array_sql = join(",", ('random()') x $dim);
my @cs = (50, 500);

sub test_recall
{
	my ($c, $ef_search, $min, $operator, $mode) = @_;
	my $correct = 0;
	my $total = 0;

	my $explain = $node->safe_psql("postgres", qq(
		SET enable_seqscan = off;
		SET hnsw.ef_search = $ef_search;
		SET hnsw.iterative_scan = $mode;
		EXPLAIN ANALYZE SELECT i FROM tst WHERE i % $c = 0 ORDER BY v $operator '$queries[0]' LIMIT $limit;
	));
	like($explain, qr/Index Scan using idx on tst/);

	for my $i (0 .. $#queries)
	{
		my $actual = $node->safe_psql("postgres", qq(
			SET enable_seqscan = off;
			SET hnsw.ef_search = $ef_search;
			SET hnsw.iterative_scan = $mode;
			SELECT i FROM tst WHERE i % $c = 0 ORDER BY v $operator '$queries[$i]' LIMIT $limit;
		));
		my @actual_ids = split("\n", $actual);

		my @expected_ids = split("\n", $expected[$i]);
		my %expected_set = map { $_ => 1 } @expected_ids;

		foreach (@actual_ids)
		{
			if (exists($expected_set{$_}))
			{
				$correct++;
			}
		}

		$total += $limit;
	}

	cmp_ok($correct / $total, ">=", $min, "$operator $mode $c");
}

# Initialize node
$node = PostgreSQL::Test::Cluster->new('node');
$node->init;
$node->start;

# Create table
$node->safe_psql("postgres", "CREATE EXTENSION vector;");
$node->safe_psql("postgres", "CREATE TABLE tst (i int4, v vector($dim));");
$node->safe_psql("postgres",
	"INSERT INTO tst SELECT i, ARRAY[$array_sql] FROM generate_series(1, 50000) i;"
);

# Generate queries
for (1 .. 20)
{
	my @r = ();
	for (1 .. $dim)
	{
		push(@r, rand());
	}
	push(@queries, "[" . join(",", @r) . "]");
}

# Check each index type
my @operators = ("<->", "<=>");
my @opclasses = ("vector_l2_ops", "vector_cosine_ops");

for my $i (0 .. $#operators)
{
	my $operator = $operators[$i];
	my $opclass = $opclasses[$i];

	$node->safe_psql("postgres", qq(
		SET maintenance_work_mem = '128MB';
		CREATE INDEX idx ON tst USING hnsw (v $opclass);
	));

	foreach (@cs)
	{
		my $c = $_;

		# Get exact results
		@expected = ();
		foreach (@queries)
		{
			my $res = $node->safe_psql("postgres", qq(
				SET enable_indexscan = off;
				WITH top AS (
					SELECT v $operator '$_' AS distance FROM tst WHERE i % $c = 0 ORDER BY distance LIMIT $limit
				)
				SELECT i FROM tst WHERE (v $operator '$_') <= (SELECT MAX(distance) FROM top)
			));
			push(@expected, $res);
		}

		test_recall($c, 40, 0.99, $operator, "strict_order");
		test_recall($c, 40, 0.99, $operator, "relaxed_order");
	}

	$node->safe_psql("postgres", "DROP INDEX idx;");
}

done_testing();



---
File: /pgvector-master/CHANGELOG.md
---

## 0.8.0 (2024-10-30)

- Added support for iterative index scans
- Added casts for arrays to `sparsevec`
- Improved cost estimation for better index selection when filtering
- Improved performance of HNSW index scans
- Improved performance of HNSW inserts and on-disk index builds
- Dropped support for Postgres 12

## 0.7.4 (2024-08-05)

- Fixed locking for parallel HNSW index builds
- Fixed compilation error with GCC 14 on i386 when SSE2 is not enabled

## 0.7.3 (2024-07-22)

- Fixed `failed to add index item` error with `sparsevec`
- Fixed compilation error with FreeBSD ARM
- Fixed compilation warning with MSVC and Postgres 16

## 0.7.2 (2024-06-11)

- Fixed initialization fork for indexes on unlogged tables

## 0.7.1 (2024-06-03)

- Improved performance of on-disk HNSW index builds
- Fixed `undefined symbol` error with GCC 8
- Fixed compilation error with universal binaries on Mac
- Fixed compilation warning with Clang < 14

## 0.7.0 (2024-04-29)

- Added `halfvec` type
- Added `sparsevec` type
- Added support for indexing `bit` type
- Added support for indexing L1 distance with HNSW
- Added `binary_quantize` function
- Added `hamming_distance` function
- Added `jaccard_distance` function
- Added `l2_normalize` function
- Added `subvector` function
- Added concatenate operator for vectors
- Added CPU dispatching for distance functions on Linux x86-64
- Updated comparison operators to support vectors with different dimensions

## 0.6.2 (2024-03-18)

- Reduced lock contention with parallel HNSW index builds

## 0.6.1 (2024-03-04)

- Fixed error with `ANALYZE` and vectors with different dimensions
- Fixed segmentation fault with `shared_preload_libraries`
- Fixed vector subtraction being marked as commutative

## 0.6.0 (2024-01-29)

If upgrading with Postgres 12 or Docker, see [these notes](https://github.com/pgvector/pgvector#060).

- Added support for parallel index builds for HNSW
- Added validation for GUC parameters
- Changed storage for vector from `extended` to `external`
- Improved performance of HNSW
- Reduced memory usage for HNSW index builds
- Reduced WAL generation for HNSW index builds
- Fixed error with logical replication
- Fixed `invalid memory alloc request size` error with HNSW index builds
- Moved Docker image to `pgvector` org
- Added Docker tags for each supported version of Postgres
- Dropped support for Postgres 11

## 0.5.1 (2023-10-10)

- Improved performance of HNSW index builds
- Added check for MVCC-compliant snapshot for index scans

## 0.5.0 (2023-08-28)

- Added HNSW index type
- Added support for parallel index builds for IVFFlat
- Added `l1_distance` function
- Added element-wise multiplication for vectors
- Added `sum` aggregate
- Improved performance of distance functions
- Fixed out of range results for cosine distance
- Fixed results for NULL and NaN distances for IVFFlat

## 0.4.4 (2023-06-12)

- Improved error message for malformed vector literal
- Fixed segmentation fault with text input
- Fixed consecutive delimiters with text input

## 0.4.3 (2023-06-10)

- Improved cost estimation
- Improved support for spaces with text input
- Fixed infinite and NaN values with binary input
- Fixed infinite values with vector addition and subtraction
- Fixed infinite values with list centers
- Fixed compilation error when `float8` is pass by reference
- Fixed compilation error on PowerPC
- Fixed segmentation fault with index creation on i386

## 0.4.2 (2023-05-13)

- Added notice when index created with little data
- Fixed dimensions check for some direct function calls
- Fixed installation error with Postgres 12.0-12.2

## 0.4.1 (2023-03-21)

- Improved performance of cosine distance
- Fixed index scan count

## 0.4.0 (2023-01-11)

If upgrading with Postgres < 13, see [this note](https://github.com/pgvector/pgvector/blob/v0.4.0/README.md#040).

- Changed text representation for vector elements to match `real`
- Changed storage for vector from `plain` to `extended`
- Increased max dimensions for vector from 1024 to 16000
- Increased max dimensions for index from 1024 to 2000
- Improved accuracy of text parsing for certain inputs
- Added `avg` aggregate for vector
- Added experimental support for Windows
- Dropped support for Postgres 10

## 0.3.2 (2022-11-22)

- Fixed `invalid memory alloc request size` error

## 0.3.1 (2022-11-02)

If upgrading from 0.2.7 or 0.3.0, [recreate](https://github.com/pgvector/pgvector/blob/v0.3.1/README.md#031) all `ivfflat` indexes after upgrading to ensure all data is indexed.

- Fixed issue with inserts silently corrupting `ivfflat` indexes (introduced in 0.2.7)
- Fixed segmentation fault with index creation when lists > 6500

## 0.3.0 (2022-10-15)

- Added support for Postgres 15
- Dropped support for Postgres 9.6

## 0.2.7 (2022-07-31)

- Fixed `unexpected data beyond EOF` error

## 0.2.6 (2022-05-22)

- Improved performance of index creation for Postgres < 12

## 0.2.5 (2022-02-11)

- Reduced memory usage during index creation
- Fixed index creation exceeding `maintenance_work_mem`
- Fixed error with index creation when lists > 1600

## 0.2.4 (2022-02-06)

- Added support for parallel vacuum
- Fixed issue with index not reusing space

## 0.2.3 (2022-01-30)

- Added indexing progress for Postgres 12+
- Improved interrupt handling during index creation

## 0.2.2 (2022-01-15)

- Fixed compilation error on Mac ARM

## 0.2.1 (2022-01-02)

- Fixed `operator is not unique` error

## 0.2.0 (2021-10-03)

- Added support for Postgres 14

## 0.1.8 (2021-09-07)

- Added cast for `vector` to `real[]`

## 0.1.7 (2021-06-13)

- Added cast for `numeric[]` to `vector`

## 0.1.6 (2021-06-09)

- Fixed segmentation fault with `COUNT`

## 0.1.5 (2021-05-25)

- Reduced memory usage during index creation

## 0.1.4 (2021-05-09)

- Fixed kmeans for inner product
- Fixed multiple definition error with GCC 10

## 0.1.3 (2021-05-06)

- Added Dockerfile
- Fixed version

## 0.1.2 (2021-04-26)

- Vectorized distance calculations
- Improved cost estimation

## 0.1.1 (2021-04-25)

- Added binary representation for `COPY`
- Marked functions as `PARALLEL SAFE`

## 0.1.0 (2021-04-20)

- First release



---
File: /pgvector-master/Dockerfile
---

ARG PG_MAJOR=17
FROM postgres:$PG_MAJOR
ARG PG_MAJOR

COPY . /tmp/pgvector

RUN apt-get update && \
		apt-mark hold locales && \
		apt-get install -y --no-install-recommends build-essential postgresql-server-dev-$PG_MAJOR && \
		cd /tmp/pgvector && \
		make clean && \
		make OPTFLAGS="" && \
		make install && \
		mkdir /usr/share/doc/pgvector && \
		cp LICENSE README.md /usr/share/doc/pgvector && \
		rm -r /tmp/pgvector && \
		apt-get remove -y build-essential postgresql-server-dev-$PG_MAJOR && \
		apt-get autoremove -y && \
		apt-mark unhold locales && \
		rm -rf /var/lib/apt/lists/*



---
File: /pgvector-master/Makefile.win
---

EXTENSION = vector
EXTVERSION = 0.8.0

DATA_built = sql\$(EXTENSION)--$(EXTVERSION).sql
OBJS = src\bitutils.obj src\bitvec.obj src\halfutils.obj src\halfvec.obj src\hnsw.obj src\hnswbuild.obj src\hnswinsert.obj src\hnswscan.obj src\hnswutils.obj src\hnswvacuum.obj src\ivfbuild.obj src\ivfflat.obj src\ivfinsert.obj src\ivfkmeans.obj src\ivfscan.obj src\ivfutils.obj src\ivfvacuum.obj src\sparsevec.obj src\vector.obj
HEADERS = src\halfvec.h src\sparsevec.h src\vector.h

REGRESS = bit btree cast copy halfvec hnsw_bit hnsw_halfvec hnsw_sparsevec hnsw_vector ivfflat_bit ivfflat_halfvec ivfflat_vector sparsevec vector_type
REGRESS_OPTS = --inputdir=test --load-extension=$(EXTENSION)

# For /arch flags
# https://learn.microsoft.com/en-us/cpp/build/reference/arch-minimum-cpu-architecture
OPTFLAGS =

# For auto-vectorization:
# - MSVC (needs /O2 /fp:fast) - https://learn.microsoft.com/en-us/cpp/parallel/auto-parallelization-and-auto-vectorization?#auto-vectorizer
PG_CFLAGS = $(PG_CFLAGS) $(OPTFLAGS) /O2 /fp:fast

# Debug MSVC auto-vectorization
# https://learn.microsoft.com/en-us/cpp/error-messages/tool-errors/vectorizer-and-parallelizer-messages
# PG_CFLAGS = $(PG_CFLAGS) /Qvec-report:2

# TODO use pg_config
!ifndef PGROOT
!error PGROOT is not set
!endif
BINDIR = $(PGROOT)\bin
INCLUDEDIR = $(PGROOT)\include
INCLUDEDIR_SERVER = $(PGROOT)\include\server
LIBDIR = $(PGROOT)\lib
PKGLIBDIR = $(PGROOT)\lib
SHAREDIR = $(PGROOT)\share

CFLAGS = /nologo /I"$(INCLUDEDIR_SERVER)\port\win32_msvc" /I"$(INCLUDEDIR_SERVER)\port\win32" /I"$(INCLUDEDIR_SERVER)" /I"$(INCLUDEDIR)"

CFLAGS = $(CFLAGS) $(PG_CFLAGS)

SHLIB = $(EXTENSION).dll

LIBS = "$(LIBDIR)\postgres.lib"

all: $(SHLIB) $(DATA_built)

.c.obj:
	$(CC) $(CFLAGS) /c $< /Fo$@

$(SHLIB): $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) $(LIBS) /link /DLL /OUT:$(SHLIB)

sql\$(EXTENSION)--$(EXTVERSION).sql: sql\$(EXTENSION).sql
	copy sql\$(EXTENSION).sql $@

install: all
	copy $(SHLIB) "$(PKGLIBDIR)"
	copy $(EXTENSION).control "$(SHAREDIR)\extension"
	copy sql\$(EXTENSION)--*.sql "$(SHAREDIR)\extension"
	mkdir "$(INCLUDEDIR_SERVER)\extension\$(EXTENSION)"
	for %f in ($(HEADERS)) do copy %f "$(INCLUDEDIR_SERVER)\extension\$(EXTENSION)"

installcheck:
	"$(BINDIR)\pg_regress" --bindir="$(BINDIR)" $(REGRESS_OPTS) $(REGRESS)

uninstall:
	del /f "$(PKGLIBDIR)\$(SHLIB)"
	del /f "$(SHAREDIR)\extension\$(EXTENSION).control"
	del /f "$(SHAREDIR)\extension\$(EXTENSION)--*.sql"
	del /f "$(INCLUDEDIR_SERVER)\extension\$(EXTENSION)\*.h"
	rmdir "$(INCLUDEDIR_SERVER)\extension\$(EXTENSION)"

clean:
	del /f $(SHLIB) $(EXTENSION).lib $(EXTENSION).exp
	del /f $(DATA_built)
	del /f $(OBJS)
	del /f /s /q results regression.diffs regression.out tmp_check tmp_check_iso log output_iso



---
File: /pgvector-master/META.json
---

{
	"name": "vector",
	"abstract": "Open-source vector similarity search for Postgres",
	"description": "Supports L2 distance, inner product, and cosine distance",
	"version": "0.8.0",
	"maintainer": [
		"Andrew Kane <andrew@ankane.org>"
	],
	"license": {
		"PostgreSQL": "http://www.postgresql.org/about/licence"
	},
	"prereqs": {
		"runtime": {
			"requires": {
				"PostgreSQL": "13.0.0"
			}
		}
	},
	"provides": {
		"vector": {
			"file": "sql/vector.sql",
			"docfile": "README.md",
			"version": "0.8.0",
			"abstract": "Open-source vector similarity search for Postgres"
		}
	},
	"resources": {
		"homepage": "https://github.com/pgvector/pgvector",
		"bugtracker": {
			"web": "https://github.com/pgvector/pgvector/issues"
		},
		"repository": {
			"url":  "https://github.com/pgvector/pgvector.git",
			"web":  "https://github.com/pgvector/pgvector",
			"type": "git"
		}
	},
	"generated_by": "Andrew Kane",
	"meta-spec": {
		"version": "1.0.0",
		"url": "http://pgxn.org/meta/spec.txt"
	},
	"tags": [
		"vectors",
		"datatype",
		"nearest neighbor search",
		"approximate nearest neighbors"
	]
}



---
File: /pgvector-master/README.md
---

# pgvector

Open-source vector similarity search for Postgres

Store your vectors with the rest of your data. Supports:

- exact and approximate nearest neighbor search
- single-precision, half-precision, binary, and sparse vectors
- L2 distance, inner product, cosine distance, L1 distance, Hamming distance, and Jaccard distance
- any [language](#languages) with a Postgres client

Plus [ACID](https://en.wikipedia.org/wiki/ACID) compliance, point-in-time recovery, JOINs, and all of the other [great features](https://www.postgresql.org/about/) of Postgres

[![Build Status](https://github.com/pgvector/pgvector/actions/workflows/build.yml/badge.svg)](https://github.com/pgvector/pgvector/actions)

## Installation

### Linux and Mac

Compile and install the extension (supports Postgres 13+)

```sh
cd /tmp
git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git
cd pgvector
make
make install # may need sudo
```

See the [installation notes](#installation-notes---linux-and-mac) if you run into issues

You can also install it with [Docker](#docker), [Homebrew](#homebrew), [PGXN](#pgxn), [APT](#apt), [Yum](#yum), [pkg](#pkg), or [conda-forge](#conda-forge), and it comes preinstalled with [Postgres.app](#postgresapp) and many [hosted providers](#hosted-postgres). There are also instructions for [GitHub Actions](https://github.com/pgvector/setup-pgvector).

### Windows

Ensure [C++ support in Visual Studio](https://learn.microsoft.com/en-us/cpp/build/building-on-the-command-line?view=msvc-170#download-and-install-the-tools) is installed, and run:

```cmd
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
```

Note: The exact path will vary depending on your Visual Studio version and edition

Then use `nmake` to build:

```cmd
set "PGROOT=C:\Program Files\PostgreSQL\16"
cd %TEMP%
git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git
cd pgvector
nmake /F Makefile.win
nmake /F Makefile.win install
```

Note: Postgres 17 is not supported with MSVC yet due to an [upstream issue](https://www.postgresql.org/message-id/flat/CAOdR5yF0krWrxycA04rgUKCgKugRvGWzzGLAhDZ9bzNv8g0Lag%40mail.gmail.com)

See the [installation notes](#installation-notes---windows) if you run into issues

You can also install it with [Docker](#docker) or [conda-forge](#conda-forge).

## Getting Started

Enable the extension (do this once in each database where you want to use it)

```tsql
CREATE EXTENSION vector;
```

Create a vector column with 3 dimensions

```sql
CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3));
```

Insert vectors

```sql
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

Get the nearest neighbors by L2 distance

```sql
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

Also supports inner product (`<#>`), cosine distance (`<=>`), and L1 distance (`<+>`, added in 0.7.0)

Note: `<#>` returns the negative inner product since Postgres only supports `ASC` order index scans on operators

## Storing

Create a new table with a vector column

```sql
CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3));
```

Or add a vector column to an existing table

```sql
ALTER TABLE items ADD COLUMN embedding vector(3);
```

Also supports [half-precision](#half-precision-vectors), [binary](#binary-vectors), and [sparse](#sparse-vectors) vectors

Insert vectors

```sql
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

Or load vectors in bulk using `COPY` ([example](https://github.com/pgvector/pgvector-python/blob/master/examples/loading/example.py))

```sql
COPY items (embedding) FROM STDIN WITH (FORMAT BINARY);
```

Upsert vectors

```sql
INSERT INTO items (id, embedding) VALUES (1, '[1,2,3]'), (2, '[4,5,6]')
    ON CONFLICT (id) DO UPDATE SET embedding = EXCLUDED.embedding;
```

Update vectors

```sql
UPDATE items SET embedding = '[1,2,3]' WHERE id = 1;
```

Delete vectors

```sql
DELETE FROM items WHERE id = 1;
```

## Querying

Get the nearest neighbors to a vector

```sql
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

Supported distance functions are:

- `<->` - L2 distance
- `<#>` - (negative) inner product
- `<=>` - cosine distance
- `<+>` - L1 distance (added in 0.7.0)
- `<~>` - Hamming distance (binary vectors, added in 0.7.0)
- `<%>` - Jaccard distance (binary vectors, added in 0.7.0)

Get the nearest neighbors to a row

```sql
SELECT * FROM items WHERE id != 1 ORDER BY embedding <-> (SELECT embedding FROM items WHERE id = 1) LIMIT 5;
```

Get rows within a certain distance

```sql
SELECT * FROM items WHERE embedding <-> '[3,1,2]' < 5;
```

Note: Combine with `ORDER BY` and `LIMIT` to use an index

#### Distances

Get the distance

```sql
SELECT embedding <-> '[3,1,2]' AS distance FROM items;
```

For inner product, multiply by -1 (since `<#>` returns the negative inner product)

```tsql
SELECT (embedding <#> '[3,1,2]') * -1 AS inner_product FROM items;
```

For cosine similarity, use 1 - cosine distance

```sql
SELECT 1 - (embedding <=> '[3,1,2]') AS cosine_similarity FROM items;
```

#### Aggregates

Average vectors

```sql
SELECT AVG(embedding) FROM items;
```

Average groups of vectors

```sql
SELECT category_id, AVG(embedding) FROM items GROUP BY category_id;
```

## Indexing

By default, pgvector performs exact nearest neighbor search, which provides perfect recall.

You can add an index to use approximate nearest neighbor search, which trades some recall for speed. Unlike typical indexes, you will see different results for queries after adding an approximate index.

Supported index types are:

- [HNSW](#hnsw)
- [IVFFlat](#ivfflat)

## HNSW

An HNSW index creates a multilayer graph. It has better query performance than IVFFlat (in terms of speed-recall tradeoff), but has slower build times and uses more memory. Also, an index can be created without any data in the table since there isn’t a training step like IVFFlat.

Add an index for each distance function you want to use.

L2 distance

```sql
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);
```

Note: Use `halfvec_l2_ops` for `halfvec` and `sparsevec_l2_ops` for `sparsevec` (and similar with the other distance functions)

Inner product

```sql
CREATE INDEX ON items USING hnsw (embedding vector_ip_ops);
```

Cosine distance

```sql
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);
```

L1 distance - added in 0.7.0

```sql
CREATE INDEX ON items USING hnsw (embedding vector_l1_ops);
```

Hamming distance - added in 0.7.0

```sql
CREATE INDEX ON items USING hnsw (embedding bit_hamming_ops);
```

Jaccard distance - added in 0.7.0

```sql
CREATE INDEX ON items USING hnsw (embedding bit_jaccard_ops);
```

Supported types are:

- `vector` - up to 2,000 dimensions
- `halfvec` - up to 4,000 dimensions (added in 0.7.0)
- `bit` - up to 64,000 dimensions (added in 0.7.0)
- `sparsevec` - up to 1,000 non-zero elements (added in 0.7.0)

### Index Options

Specify HNSW parameters

- `m` - the max number of connections per layer (16 by default)
- `ef_construction` - the size of the dynamic candidate list for constructing the graph (64 by default)

```sql
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops) WITH (m = 16, ef_construction = 64);
```

A higher value of `ef_construction` provides better recall at the cost of index build time / insert speed.

### Query Options

Specify the size of the dynamic candidate list for search (40 by default)

```sql
SET hnsw.ef_search = 100;
```

A higher value provides better recall at the cost of speed.

Use `SET LOCAL` inside a transaction to set it for a single query

```sql
BEGIN;
SET LOCAL hnsw.ef_search = 100;
SELECT ...
COMMIT;
```

### Index Build Time

Indexes build significantly faster when the graph fits into `maintenance_work_mem`

```sql
SET maintenance_work_mem = '8GB';
```

A notice is shown when the graph no longer fits

```text
NOTICE:  hnsw graph no longer fits into maintenance_work_mem after 100000 tuples
DETAIL:  Building will take significantly more time.
HINT:  Increase maintenance_work_mem to speed up builds.
```

Note: Do not set `maintenance_work_mem` so high that it exhausts the memory on the server

Like other index types, it’s faster to create an index after loading your initial data

Starting with 0.6.0, you can also speed up index creation by increasing the number of parallel workers (2 by default)

```sql
SET max_parallel_maintenance_workers = 7; -- plus leader
```

For a large number of workers, you may also need to increase `max_parallel_workers` (8 by default)

### Indexing Progress

Check [indexing progress](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING)

```sql
SELECT phase, round(100.0 * blocks_done / nullif(blocks_total, 0), 1) AS "%" FROM pg_stat_progress_create_index;
```

The phases for HNSW are:

1. `initializing`
2. `loading tuples`

## IVFFlat

An IVFFlat index divides vectors into lists, and then searches a subset of those lists that are closest to the query vector. It has faster build times and uses less memory than HNSW, but has lower query performance (in terms of speed-recall tradeoff).

Three keys to achieving good recall are:

1. Create the index *after* the table has some data
2. Choose an appropriate number of lists - a good place to start is `rows / 1000` for up to 1M rows and `sqrt(rows)` for over 1M rows
3. When querying, specify an appropriate number of [probes](#query-options) (higher is better for recall, lower is better for speed) - a good place to start is `sqrt(lists)`

Add an index for each distance function you want to use.

L2 distance

```sql
CREATE INDEX ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
```

Note: Use `halfvec_l2_ops` for `halfvec` (and similar with the other distance functions)

Inner product

```sql
CREATE INDEX ON items USING ivfflat (embedding vector_ip_ops) WITH (lists = 100);
```

Cosine distance

```sql
CREATE INDEX ON items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

Hamming distance - added in 0.7.0

```sql
CREATE INDEX ON items USING ivfflat (embedding bit_hamming_ops) WITH (lists = 100);
```

Supported types are:

- `vector` - up to 2,000 dimensions
- `halfvec` - up to 4,000 dimensions (added in 0.7.0)
- `bit` - up to 64,000 dimensions (added in 0.7.0)

### Query Options

Specify the number of probes (1 by default)

```sql
SET ivfflat.probes = 10;
```

A higher value provides better recall at the cost of speed, and it can be set to the number of lists for exact nearest neighbor search (at which point the planner won’t use the index)

Use `SET LOCAL` inside a transaction to set it for a single query

```sql
BEGIN;
SET LOCAL ivfflat.probes = 10;
SELECT ...
COMMIT;
```

### Index Build Time

Speed up index creation on large tables by increasing the number of parallel workers (2 by default)

```sql
SET max_parallel_maintenance_workers = 7; -- plus leader
```

For a large number of workers, you may also need to increase `max_parallel_workers` (8 by default)

### Indexing Progress

Check [indexing progress](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING)

```sql
SELECT phase, round(100.0 * tuples_done / nullif(tuples_total, 0), 1) AS "%" FROM pg_stat_progress_create_index;
```

The phases for IVFFlat are:

1. `initializing`
2. `performing k-means`
3. `assigning tuples`
4. `loading tuples`

Note: `%` is only populated during the `loading tuples` phase

## Filtering

There are a few ways to index nearest neighbor queries with a `WHERE` clause.

```sql
SELECT * FROM items WHERE category_id = 123 ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

A good place to start is creating an index on the filter column. This can provide fast, exact nearest neighbor search in many cases. Postgres has a number of [index types](https://www.postgresql.org/docs/current/indexes-types.html) for this: B-tree (default), hash, GiST, SP-GiST, GIN, and BRIN.

```sql
CREATE INDEX ON items (category_id);
```

For multiple columns, consider a [multicolumn index](https://www.postgresql.org/docs/current/indexes-multicolumn.html).

```sql
CREATE INDEX ON items (location_id, category_id);
```

Exact indexes work well for conditions that match a low percentage of rows. Otherwise, [approximate indexes](#indexing) can work better.

```sql
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);
```

With approximate indexes, filtering is applied *after* the index is scanned. If a condition matches 10% of rows, with HNSW and the default `hnsw.ef_search` of 40, only 4 rows will match on average. For more rows, increase `hnsw.ef_search`.

```sql
SET hnsw.ef_search = 200;
```

Starting with 0.8.0, you can enable [iterative index scans](#iterative-index-scans), which will automatically scan more of the index when needed.

```sql
SET hnsw.iterative_scan = strict_order;
```

If filtering by only a few distinct values, consider [partial indexing](https://www.postgresql.org/docs/current/indexes-partial.html).

```sql
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops) WHERE (category_id = 123);
```

If filtering by many different values, consider [partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html).

```sql
CREATE TABLE items (embedding vector(3), category_id int) PARTITION BY LIST(category_id);
```

## Iterative Index Scans

*Added in 0.8.0*

With approximate indexes, queries with filtering can return less results since filtering is applied *after* the index is scanned. Starting with 0.8.0, you can enable iterative index scans, which will automatically scan more of the index until enough results are found (or it reaches `hnsw.max_scan_tuples` or `ivfflat.max_probes`).

Iterative scans can use strict or relaxed ordering.

Strict ensures results are in the exact order by distance

```sql
SET hnsw.iterative_scan = strict_order;
```

Relaxed allows results to be slightly out of order by distance, but provides better recall

```sql
SET hnsw.iterative_scan = relaxed_order;
# or
SET ivfflat.iterative_scan = relaxed_order;
```

With relaxed ordering, you can use a [materialized CTE](https://www.postgresql.org/docs/current/queries-with.html#QUERIES-WITH-CTE-MATERIALIZATION) to get strict ordering

```sql
WITH relaxed_results AS MATERIALIZED (
    SELECT id, embedding <-> '[1,2,3]' AS distance FROM items WHERE category_id = 123 ORDER BY distance LIMIT 5
) SELECT * FROM relaxed_results ORDER BY distance;
```

For queries that filter by distance, use a materialized CTE and place the distance filter outside of it for best performance (due to the [current behavior](https://www.postgresql.org/message-id/flat/CAOdR5yGUoMQ6j7M5hNUXrySzaqZVGf_Ne%2B8fwZMRKTFxU1nbJg%40mail.gmail.com) of the Postgres executor)

```sql
WITH nearest_results AS MATERIALIZED (
    SELECT id, embedding <-> '[1,2,3]' AS distance FROM items ORDER BY distance LIMIT 5
) SELECT * FROM nearest_results WHERE distance < 5 ORDER BY distance;
```

Note: Place any other filters inside the CTE

### Iterative Scan Options

Since scanning a large portion of an approximate index is expensive, there are options to control when a scan ends.

#### HNSW

Specify the max number of tuples to visit (20,000 by default)

```sql
SET hnsw.max_scan_tuples = 20000;
```

Note: This is approximate and does not affect the initial scan

Specify the max amount of memory to use, as a multiple of `work_mem` (1 by default)

```sql
SET hnsw.scan_mem_multiplier = 2;
```

Note: Try increasing this if increasing `hnsw.max_scan_tuples` does not improve recall

#### IVFFlat

Specify the max number of probes

```sql
SET ivfflat.max_probes = 100;
```

Note: If this is lower than `ivfflat.probes`, `ivfflat.probes` will be used

## Half-Precision Vectors

*Added in 0.7.0*

Use the `halfvec` type to store half-precision vectors

```sql
CREATE TABLE items (id bigserial PRIMARY KEY, embedding halfvec(3));
```

## Half-Precision Indexing

*Added in 0.7.0*

Index vectors at half precision for smaller indexes

```sql
CREATE INDEX ON items USING hnsw ((embedding::halfvec(3)) halfvec_l2_ops);
```

Get the nearest neighbors

```sql
SELECT * FROM items ORDER BY embedding::halfvec(3) <-> '[1,2,3]' LIMIT 5;
```

## Binary Vectors

Use the `bit` type to store binary vectors ([example](https://github.com/pgvector/pgvector-python/blob/master/examples/imagehash/example.py))

```sql
CREATE TABLE items (id bigserial PRIMARY KEY, embedding bit(3));
INSERT INTO items (embedding) VALUES ('000'), ('111');
```

Get the nearest neighbors by Hamming distance (added in 0.7.0)

```sql
SELECT * FROM items ORDER BY embedding <~> '101' LIMIT 5;
```

Or (before 0.7.0)

```sql
SELECT * FROM items ORDER BY bit_count(embedding # '101') LIMIT 5;
```

Also supports Jaccard distance (`<%>`)

## Binary Quantization

*Added in 0.7.0*

Use expression indexing for binary quantization

```sql
CREATE INDEX ON items USING hnsw ((binary_quantize(embedding)::bit(3)) bit_hamming_ops);
```

Get the nearest neighbors by Hamming distance

```sql
SELECT * FROM items ORDER BY binary_quantize(embedding)::bit(3) <~> binary_quantize('[1,-2,3]') LIMIT 5;
```

Re-rank by the original vectors for better recall

```sql
SELECT * FROM (
    SELECT * FROM items ORDER BY binary_quantize(embedding)::bit(3) <~> binary_quantize('[1,-2,3]') LIMIT 20
) ORDER BY embedding <=> '[1,-2,3]' LIMIT 5;
```

## Sparse Vectors

*Added in 0.7.0*

Use the `sparsevec` type to store sparse vectors

```sql
CREATE TABLE items (id bigserial PRIMARY KEY, embedding sparsevec(5));
```

Insert vectors

```sql
INSERT INTO items (embedding) VALUES ('{1:1,3:2,5:3}/5'), ('{1:4,3:5,5:6}/5');
```

The format is `{index1:value1,index2:value2}/dimensions` and indices start at 1 like SQL arrays

Get the nearest neighbors by L2 distance

```sql
SELECT * FROM items ORDER BY embedding <-> '{1:3,3:1,5:2}/5' LIMIT 5;
```

## Hybrid Search

Use together with Postgres [full-text search](https://www.postgresql.org/docs/current/textsearch-intro.html) for hybrid search.

```sql
SELECT id, content FROM items, plainto_tsquery('hello search') query
    WHERE textsearch @@ query ORDER BY ts_rank_cd(textsearch, query) DESC LIMIT 5;
```

You can use [Reciprocal Rank Fusion](https://github.com/pgvector/pgvector-python/blob/master/examples/hybrid_search/rrf.py) or a [cross-encoder](https://github.com/pgvector/pgvector-python/blob/master/examples/hybrid_search/cross_encoder.py) to combine results.

## Indexing Subvectors

*Added in 0.7.0*

Use expression indexing to index subvectors

```sql
CREATE INDEX ON items USING hnsw ((subvector(embedding, 1, 3)::vector(3)) vector_cosine_ops);
```

Get the nearest neighbors by cosine distance

```sql
SELECT * FROM items ORDER BY subvector(embedding, 1, 3)::vector(3) <=> subvector('[1,2,3,4,5]'::vector, 1, 3) LIMIT 5;
```

Re-rank by the full vectors for better recall

```sql
SELECT * FROM (
    SELECT * FROM items ORDER BY subvector(embedding, 1, 3)::vector(3) <=> subvector('[1,2,3,4,5]'::vector, 1, 3) LIMIT 20
) ORDER BY embedding <=> '[1,2,3,4,5]' LIMIT 5;
```

## Performance

### Tuning

Use a tool like [PgTune](https://pgtune.leopard.in.ua/) to set initial values for Postgres server parameters. For instance, `shared_buffers` should typically be 25% of the server’s memory. You can find the config file with:

```sql
SHOW config_file;
```

And check individual settings with:

```sql
SHOW shared_buffers;
```

Be sure to restart Postgres for changes to take effect.

### Loading

Use `COPY` for bulk loading data ([example](https://github.com/pgvector/pgvector-python/blob/master/examples/loading/example.py)).

```sql
COPY items (embedding) FROM STDIN WITH (FORMAT BINARY);
```

Add any indexes *after* loading the initial data for best performance.

### Indexing

See index build time for [HNSW](#index-build-time) and [IVFFlat](#index-build-time-1).

In production environments, create indexes concurrently to avoid blocking writes.

```sql
CREATE INDEX CONCURRENTLY ...
```

### Querying

Use `EXPLAIN ANALYZE` to debug performance.

```sql
EXPLAIN ANALYZE SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

#### Exact Search

To speed up queries without an index, increase `max_parallel_workers_per_gather`.

```sql
SET max_parallel_workers_per_gather = 4;
```

If vectors are normalized to length 1 (like [OpenAI embeddings](https://platform.openai.com/docs/guides/embeddings/which-distance-function-should-i-use)), use inner product for best performance.

```tsql
SELECT * FROM items ORDER BY embedding <#> '[3,1,2]' LIMIT 5;
```

#### Approximate Search

To speed up queries with an IVFFlat index, increase the number of inverted lists (at the expense of recall).

```sql
CREATE INDEX ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 1000);
```

### Vacuuming

Vacuuming can take a while for HNSW indexes. Speed it up by reindexing first.

```sql
REINDEX INDEX CONCURRENTLY index_name;
VACUUM table_name;
```

## Monitoring

Monitor performance with [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html) (be sure to add it to `shared_preload_libraries`).

```sql
CREATE EXTENSION pg_stat_statements;
```

Get the most time-consuming queries with:

```sql
SELECT query, calls, ROUND((total_plan_time + total_exec_time) / calls) AS avg_time_ms,
    ROUND((total_plan_time + total_exec_time) / 60000) AS total_time_min
    FROM pg_stat_statements ORDER BY total_plan_time + total_exec_time DESC LIMIT 20;
```

Note: Replace `total_plan_time + total_exec_time` with `total_time` for Postgres < 13

Monitor recall by comparing results from approximate search with exact search.

```sql
BEGIN;
SET LOCAL enable_indexscan = off; -- use exact search
SELECT ...
COMMIT;
```

## Scaling

Scale pgvector the same way you scale Postgres.

Scale vertically by increasing memory, CPU, and storage on a single instance. Use existing tools to [tune parameters](#tuning) and [monitor performance](#monitoring).

Scale horizontally with [replicas](https://www.postgresql.org/docs/current/hot-standby.html), or use [Citus](https://github.com/citusdata/citus) or another approach for sharding ([example](https://github.com/pgvector/pgvector-python/blob/master/examples/citus/example.py)).

## Languages

Use pgvector from any language with a Postgres client. You can even generate and store vectors in one language and query them in another.

Language | Libraries / Examples
--- | ---
C | [pgvector-c](https://github.com/pgvector/pgvector-c)
C++ | [pgvector-cpp](https://github.com/pgvector/pgvector-cpp)
C#, F#, Visual Basic | [pgvector-dotnet](https://github.com/pgvector/pgvector-dotnet)
Crystal | [pgvector-crystal](https://github.com/pgvector/pgvector-crystal)
D | [pgvector-d](https://github.com/pgvector/pgvector-d)
Dart | [pgvector-dart](https://github.com/pgvector/pgvector-dart)
Elixir | [pgvector-elixir](https://github.com/pgvector/pgvector-elixir)
Erlang | [pgvector-erlang](https://github.com/pgvector/pgvector-erlang)
Fortran | [pgvector-fortran](https://github.com/pgvector/pgvector-fortran)
Gleam | [pgvector-gleam](https://github.com/pgvector/pgvector-gleam)
Go | [pgvector-go](https://github.com/pgvector/pgvector-go)
Haskell | [pgvector-haskell](https://github.com/pgvector/pgvector-haskell)
Java, Kotlin, Groovy, Scala | [pgvector-java](https://github.com/pgvector/pgvector-java)
JavaScript, TypeScript | [pgvector-node](https://github.com/pgvector/pgvector-node)
Julia | [pgvector-julia](https://github.com/pgvector/pgvector-julia)
Lisp | [pgvector-lisp](https://github.com/pgvector/pgvector-lisp)
Lua | [pgvector-lua](https://github.com/pgvector/pgvector-lua)
Nim | [pgvector-nim](https://github.com/pgvector/pgvector-nim)
OCaml | [pgvector-ocaml](https://github.com/pgvector/pgvector-ocaml)
Perl | [pgvector-perl](https://github.com/pgvector/pgvector-perl)
PHP | [pgvector-php](https://github.com/pgvector/pgvector-php)
Python | [pgvector-python](https://github.com/pgvector/pgvector-python)
R | [pgvector-r](https://github.com/pgvector/pgvector-r)
Raku | [pgvector-raku](https://github.com/pgvector/pgvector-raku)
Ruby | [pgvector-ruby](https://github.com/pgvector/pgvector-ruby), [Neighbor](https://github.com/ankane/neighbor)
Rust | [pgvector-rust](https://github.com/pgvector/pgvector-rust)
Swift | [pgvector-swift](https://github.com/pgvector/pgvector-swift)
Zig | [pgvector-zig](https://github.com/pgvector/pgvector-zig)

## Frequently Asked Questions

#### How many vectors can be stored in a single table?

A non-partitioned table has a limit of 32 TB by default in Postgres. A partitioned table can have thousands of partitions of that size.

#### Is replication supported?

Yes, pgvector uses the write-ahead log (WAL), which allows for replication and point-in-time recovery.

#### What if I want to index vectors with more than 2,000 dimensions?

You can use [half-precision indexing](#half-precision-indexing) to index up to 4,000 dimensions or [binary quantization](#binary-quantization) to index up to 64,000 dimensions. Another option is [dimensionality reduction](https://en.wikipedia.org/wiki/Dimensionality_reduction).

#### Can I store vectors with different dimensions in the same column?

You can use `vector` as the type (instead of `vector(3)`).

```sql
CREATE TABLE embeddings (model_id bigint, item_id bigint, embedding vector, PRIMARY KEY (model_id, item_id));
```

However, you can only create indexes on rows with the same number of dimensions (using [expression](https://www.postgresql.org/docs/current/indexes-expressional.html) and [partial](https://www.postgresql.org/docs/current/indexes-partial.html) indexing):

```sql
CREATE INDEX ON embeddings USING hnsw ((embedding::vector(3)) vector_l2_ops) WHERE (model_id = 123);
```

and query with:

```sql
SELECT * FROM embeddings WHERE model_id = 123 ORDER BY embedding::vector(3) <-> '[3,1,2]' LIMIT 5;
```

#### Can I store vectors with more precision?

You can use the `double precision[]` or `numeric[]` type to store vectors with more precision.

```sql
CREATE TABLE items (id bigserial PRIMARY KEY, embedding double precision[]);

-- use {} instead of [] for Postgres arrays
INSERT INTO items (embedding) VALUES ('{1,2,3}'), ('{4,5,6}');
```

Optionally, add a [check constraint](https://www.postgresql.org/docs/current/ddl-constraints.html) to ensure data can be converted to the `vector` type and has the expected dimensions.

```sql
ALTER TABLE items ADD CHECK (vector_dims(embedding::vector) = 3);
```

Use [expression indexing](https://www.postgresql.org/docs/current/indexes-expressional.html) to index (at a lower precision):

```sql
CREATE INDEX ON items USING hnsw ((embedding::vector(3)) vector_l2_ops);
```

and query with:

```sql
SELECT * FROM items ORDER BY embedding::vector(3) <-> '[3,1,2]' LIMIT 5;
```

#### Do indexes need to fit into memory?

No, but like other index types, you’ll likely see better performance if they do. You can get the size of an index with:

```sql
SELECT pg_size_pretty(pg_relation_size('index_name'));
```

## Troubleshooting

#### Why isn’t a query using an index?

The query needs to have an `ORDER BY` and `LIMIT`, and the `ORDER BY` must be the result of a distance operator (not an expression) in ascending order.

```sql
-- index
ORDER BY embedding <=> '[3,1,2]' LIMIT 5;

-- no index
ORDER BY 1 - (embedding <=> '[3,1,2]') DESC LIMIT 5;
```

You can encourage the planner to use an index for a query with:

```sql
BEGIN;
SET LOCAL enable_seqscan = off;
SELECT ...
COMMIT;
```

Also, if the table is small, a table scan may be faster.

#### Why isn’t a query using a parallel table scan?

The planner doesn’t consider [out-of-line storage](https://www.postgresql.org/docs/current/storage-toast.html) in cost estimates, which can make a serial scan look cheaper. You can reduce the cost of a parallel scan for a query with:

```sql
BEGIN;
SET LOCAL min_parallel_table_scan_size = 1;
SET LOCAL parallel_setup_cost = 1;
SELECT ...
COMMIT;
```

or choose to store vectors inline:

```sql
ALTER TABLE items ALTER COLUMN embedding SET STORAGE PLAIN;
```

#### Why are there less results for a query after adding an HNSW index?

Results are limited by the size of the dynamic candidate list (`hnsw.ef_search`), which is 40 by default. There may be even less results due to dead tuples or filtering conditions in the query. Enabling [iterative index scans](#iterative-index-scans) can help address this.

Also, note that `NULL` vectors are not indexed (as well as zero vectors for cosine distance).

#### Why are there less results for a query after adding an IVFFlat index?

The index was likely created with too little data for the number of lists. Drop the index until the table has more data.

```sql
DROP INDEX index_name;
```

Results can also be limited by the number of probes (`ivfflat.probes`). Enabling [iterative index scans](#iterative-index-scans) can address this.

Also, note that `NULL` vectors are not indexed (as well as zero vectors for cosine distance).

## Reference

- [Vector](#vector-type)
- [Halfvec](#halfvec-type)
- [Bit](#bit-type)
- [Sparsevec](#sparsevec-type)

### Vector Type

Each vector takes `4 * dimensions + 8` bytes of storage. Each element is a single-precision floating-point number (like the `real` type in Postgres), and all elements must be finite (no `NaN`, `Infinity` or `-Infinity`). Vectors can have up to 16,000 dimensions.

### Vector Operators

Operator | Description | Added
--- | --- | ---
\+ | element-wise addition |
\- | element-wise subtraction |
\* | element-wise multiplication | 0.5.0
\|\| | concatenate | 0.7.0
<-> | Euclidean distance |
<#> | negative inner product |
<=> | cosine distance |
<+> | taxicab distance | 0.7.0

### Vector Functions

Function | Description | Added
--- | --- | ---
binary_quantize(vector) → bit | binary quantize | 0.7.0
cosine_distance(vector, vector) → double precision | cosine distance |
inner_product(vector, vector) → double precision | inner product |
l1_distance(vector, vector) → double precision | taxicab distance | 0.5.0
l2_distance(vector, vector) → double precision | Euclidean distance |
l2_normalize(vector) → vector | Normalize with Euclidean norm | 0.7.0
subvector(vector, integer, integer) → vector | subvector | 0.7.0
vector_dims(vector) → integer | number of dimensions |
vector_norm(vector) → double precision | Euclidean norm |

### Vector Aggregate Functions

Function | Description | Added
--- | --- | ---
avg(vector) → vector | average |
sum(vector) → vector | sum | 0.5.0

### Halfvec Type

Each half vector takes `2 * dimensions + 8` bytes of storage. Each element is a half-precision floating-point number, and all elements must be finite (no `NaN`, `Infinity` or `-Infinity`). Half vectors can have up to 16,000 dimensions.

### Halfvec Operators

Operator | Description | Added
--- | --- | ---
\+ | element-wise addition | 0.7.0
\- | element-wise subtraction | 0.7.0
\* | element-wise multiplication | 0.7.0
\|\| | concatenate | 0.7.0
<-> | Euclidean distance | 0.7.0
<#> | negative inner product | 0.7.0
<=> | cosine distance | 0.7.0
<+> | taxicab distance | 0.7.0

### Halfvec Functions

Function | Description | Added
--- | --- | ---
binary_quantize(halfvec) → bit | binary quantize | 0.7.0
cosine_distance(halfvec, halfvec) → double precision | cosine distance | 0.7.0
inner_product(halfvec, halfvec) → double precision | inner product | 0.7.0
l1_distance(halfvec, halfvec) → double precision | taxicab distance | 0.7.0
l2_distance(halfvec, halfvec) → double precision | Euclidean distance | 0.7.0
l2_norm(halfvec) → double precision | Euclidean norm | 0.7.0
l2_normalize(halfvec) → halfvec | Normalize with Euclidean norm | 0.7.0
subvector(halfvec, integer, integer) → halfvec | subvector | 0.7.0
vector_dims(halfvec) → integer | number of dimensions | 0.7.0

### Halfvec Aggregate Functions

Function | Description | Added
--- | --- | ---
avg(halfvec) → halfvec | average | 0.7.0
sum(halfvec) → halfvec | sum | 0.7.0

### Bit Type

Each bit vector takes `dimensions / 8 + 8` bytes of storage. See the [Postgres docs](https://www.postgresql.org/docs/current/datatype-bit.html) for more info.

### Bit Operators

Operator | Description | Added
--- | --- | ---
<~> | Hamming distance | 0.7.0
<%> | Jaccard distance | 0.7.0

### Bit Functions

Function | Description | Added
--- | --- | ---
hamming_distance(bit, bit) → double precision | Hamming distance | 0.7.0
jaccard_distance(bit, bit) → double precision | Jaccard distance | 0.7.0

### Sparsevec Type

Each sparse vector takes `8 * non-zero elements + 16` bytes of storage. Each element is a single-precision floating-point number, and all elements must be finite (no `NaN`, `Infinity` or `-Infinity`). Sparse vectors can have up to 16,000 non-zero elements.

### Sparsevec Operators

Operator | Description | Added
--- | --- | ---
<-> | Euclidean distance | 0.7.0
<#> | negative inner product | 0.7.0
<=> | cosine distance | 0.7.0
<+> | taxicab distance | 0.7.0

### Sparsevec Functions

Function | Description | Added
--- | --- | ---
cosine_distance(sparsevec, sparsevec) → double precision | cosine distance | 0.7.0
inner_product(sparsevec, sparsevec) → double precision | inner product | 0.7.0
l1_distance(sparsevec, sparsevec) → double precision | taxicab distance | 0.7.0
l2_distance(sparsevec, sparsevec) → double precision | Euclidean distance | 0.7.0
l2_norm(sparsevec) → double precision | Euclidean norm | 0.7.0
l2_normalize(sparsevec) → sparsevec | Normalize with Euclidean norm | 0.7.0

## Installation Notes - Linux and Mac

### Postgres Location

If your machine has multiple Postgres installations, specify the path to [pg_config](https://www.postgresql.org/docs/current/app-pgconfig.html) with:

```sh
export PG_CONFIG=/Library/PostgreSQL/17/bin/pg_config
```

Then re-run the installation instructions (run `make clean` before `make` if needed). If `sudo` is needed for `make install`, use:

```sh
sudo --preserve-env=PG_CONFIG make install
```

A few common paths on Mac are:

- EDB installer - `/Library/PostgreSQL/17/bin/pg_config`
- Homebrew (arm64) - `/opt/homebrew/opt/postgresql@17/bin/pg_config`
- Homebrew (x86-64) - `/usr/local/opt/postgresql@17/bin/pg_config`

Note: Replace `17` with your Postgres server version

### Missing Header

If compilation fails with `fatal error: postgres.h: No such file or directory`, make sure Postgres development files are installed on the server.

For Ubuntu and Debian, use:

```sh
sudo apt install postgresql-server-dev-17
```

Note: Replace `17` with your Postgres server version

### Missing SDK

If compilation fails and the output includes `warning: no such sysroot directory` on Mac, reinstall Xcode Command Line Tools.

### Portability

By default, pgvector compiles with `-march=native` on some platforms for best performance. However, this can lead to `Illegal instruction` errors if trying to run the compiled extension on a different machine.

To compile for portability, use:

```sh
make OPTFLAGS=""
```

## Installation Notes - Windows

### Missing Header

If compilation fails with `Cannot open include file: 'postgres.h': No such file or directory`, make sure `PGROOT` is correct.

### Permissions

If installation fails with `Access is denied`, re-run the installation instructions as an administrator.

## Additional Installation Methods

### Docker

Get the [Docker image](https://hub.docker.com/r/pgvector/pgvector) with:

```sh
docker pull pgvector/pgvector:pg17
```

This adds pgvector to the [Postgres image](https://hub.docker.com/_/postgres) (replace `17` with your Postgres server version, and run it the same way).

You can also build the image manually:

```sh
git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git
cd pgvector
docker build --pull --build-arg PG_MAJOR=17 -t myuser/pgvector .
```

### Homebrew

With Homebrew Postgres, you can use:

```sh
brew install pgvector
```

Note: This only adds it to the `postgresql@17` and `postgresql@14` formulas

### PGXN

Install from the [PostgreSQL Extension Network](https://pgxn.org/dist/vector) with:

```sh
pgxn install vector
```

### APT

Debian and Ubuntu packages are available from the [PostgreSQL APT Repository](https://wiki.postgresql.org/wiki/Apt). Follow the [setup instructions](https://wiki.postgresql.org/wiki/Apt#Quickstart) and run:

```sh
sudo apt install postgresql-17-pgvector
```

Note: Replace `17` with your Postgres server version

### Yum

RPM packages are available from the [PostgreSQL Yum Repository](https://yum.postgresql.org/). Follow the [setup instructions](https://www.postgresql.org/download/linux/redhat/) for your distribution and run:

```sh
sudo yum install pgvector_17
# or
sudo dnf install pgvector_17
```

Note: Replace `17` with your Postgres server version

### pkg

Install the FreeBSD package with:

```sh
pkg install postgresql16-pgvector
```

or the port with:

```sh
cd /usr/ports/databases/pgvector
make install
```

### conda-forge

With Conda Postgres, install from [conda-forge](https://anaconda.org/conda-forge/pgvector) with:

```sh
conda install -c conda-forge pgvector
```

This method is [community-maintained](https://github.com/conda-forge/pgvector-feedstock) by [@mmcauliffe](https://github.com/mmcauliffe)

### Postgres.app

Download the [latest release](https://postgresapp.com/downloads.html) with Postgres 15+.

## Hosted Postgres

pgvector is available on [these providers](https://github.com/pgvector/pgvector/issues/54).

## Upgrading

[Install](#installation) the latest version (use the same method as the original installation). Then in each database you want to upgrade, run:

```sql
ALTER EXTENSION vector UPDATE;
```

You can check the version in the current database with:

```sql
SELECT extversion FROM pg_extension WHERE extname = 'vector';
```

## Upgrade Notes

### 0.6.0

#### Postgres 12

If upgrading with Postgres 12, remove this line from `sql/vector--0.5.1--0.6.0.sql`:

```sql
ALTER TYPE vector SET (STORAGE = external);
```

Then run `make install` and `ALTER EXTENSION vector UPDATE;`.

#### Docker

The Docker image is now published in the `pgvector` org, and there are tags for each supported version of Postgres (rather than a `latest` tag).

```sh
docker pull pgvector/pgvector:pg16
# or
docker pull pgvector/pgvector:0.6.0-pg16
```

Also, if you’ve increased `maintenance_work_mem`, make sure `--shm-size` is at least that size to avoid an error with parallel HNSW index builds.

```sh
docker run --shm-size=1g ...
```

## Thanks

Thanks to:

- [PASE: PostgreSQL Ultra-High-Dimensional Approximate Nearest Neighbor Search Extension](https://dl.acm.org/doi/pdf/10.1145/3318464.3386131)
- [Faiss: A Library for Efficient Similarity Search and Clustering of Dense Vectors](https://github.com/facebookresearch/faiss)
- [Using the Triangle Inequality to Accelerate k-means](https://cdn.aaai.org/ICML/2003/ICML03-022.pdf)
- [k-means++: The Advantage of Careful Seeding](https://theory.stanford.edu/~sergei/papers/kMeansPP-soda.pdf)
- [Concept Decompositions for Large Sparse Text Data using Clustering](https://www.cs.utexas.edu/users/inderjit/public_papers/concept_mlj.pdf)
- [Efficient and Robust Approximate Nearest Neighbor Search using Hierarchical Navigable Small World Graphs](https://arxiv.org/ftp/arxiv/papers/1603/1603.09320.pdf)

## History

View the [changelog](https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md)

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/pgvector/pgvector/issues)
- Fix bugs and [submit pull requests](https://github.com/pgvector/pgvector/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features

To get started with development:

```sh
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
make install
```

To run all tests:

```sh
make installcheck        # regression tests
make prove_installcheck  # TAP tests
```

To run single tests:

```sh
make installcheck REGRESS=functions                            # regression test
make prove_installcheck PROVE_TESTS=test/t/001_ivfflat_wal.pl  # TAP test
```

To enable assertions:

```sh
make clean && PG_CFLAGS="-DUSE_ASSERT_CHECKING" make && make install
```

To enable benchmarking:

```sh
make clean && PG_CFLAGS="-DIVFFLAT_BENCH" make && make install
```

To show memory usage:

```sh
make clean && PG_CFLAGS="-DHNSW_MEMORY -DIVFFLAT_MEMORY" make && make install
```

To get k-means metrics:

```sh
make clean && PG_CFLAGS="-DIVFFLAT_KMEANS_DEBUG" make && make install
```

Resources for contributors

- [Extension Building Infrastructure](https://www.postgresql.org/docs/current/extend-pgxs.html)
- [Index Access Method Interface Definition](https://www.postgresql.org/docs/current/indexam.html)
- [Generic WAL Records](https://www.postgresql.org/docs/current/generic-wal.html)

