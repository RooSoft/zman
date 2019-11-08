# zman

Open source tool automating ZFS snapshot creation and expiration based on a simple configuration file.

## Frequency based

Snapshot creation schedule could be *hourly*, *daily* or *monthly*. Each of these frequency types can retain a given quantity of snapshots before expiring them.

## Commands

### status

Displays active and expired snapshots along with pools overdue for a new snapshot.

### renew

Renews pools found in the overdue section of the status command.

### purge

Destroys snapshots considered as expired based on the configuration file.

## Driven by cron

Monitoring is done by calling zman on a timely basis, which could be done by simple cron jobs.

### Example

```cron
0 * * * * /usr/local/sbin/zman renew
0 * * * * /usr/local/sbin/zman purge
```

## Configuration file

By default, zman looks for it at `/etc/zman/zman.yaml`, but could be specified with the -c command like in this example:

```bash
zman status -c=~/zman.yaml
```

This configuration files contains two top level keys: *zfs* and *pools*.

- zfs: *(optional)* location of the zfs executable
- pools: an array of these
  - name: name of a pool to be monitored
  - frequency: array of snapshot schedules
    - type: *monthly*, *daily* or *hourly*
    - quantity: number of snapshots until considered expired

```yaml
---
zfs: /sbin/zfs
pools:
- name: smallpool/zman
  frequencies:
    - type: monthly
      quantity: 3
    - type: daily
      quantity: 31
    - type: hourly
      quantity: 24

- name: largepool/vm-503-disk-0
  frequencies:
    - type: daily
      quantity: 31
    - type: hourly
      quantity: 24
```

In this example, zman monitors two pools: *smallpool/zman* and *largepool/vm-503-disk-0*.

#### smallpool/zman

This configuration will snapshot the pool every hour, keeping each of those for a day. Other snapshots are taken every day, keeping them longer, for a period of 31 days. It is also snapshotting once a month, keeping those for a bit longer: 3 months.

#### largepool/whatever

Same snapshot strategy as *smallpool/zman* but no monthly schedule.


## License ##

The MIT License (MIT)

Copyright (c) 2019 Marc Lacoursière

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
