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
