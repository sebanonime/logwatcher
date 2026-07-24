# Line Watchdog — Missing/Stalled Line Monitor

This is an **optional, built-in diagnostic tool** in the LogWatcher frontend. It helps detect two
specific problems while you are tailing a log file:

- **Gap**: a line was lost somewhere between the source file and your browser (a number is skipped).
- **Stall**: the viewer stopped receiving new lines even though the file should still be growing.

It is **disabled by default** and does not affect normal usage — it only starts watching once you
turn it on for your browser session.

> Works best with log lines that start with a sequence number, e.g. the format used by the
> `AutoLogGen` test tool: `123 | 2026-07-24 10:15:00.000 | [SOAK] Log entry #123`.
> If your real log files don't have a leading number, the watchdog will simply show 0 gaps
> (it can't detect gaps without a sequence to check), but stall detection still works.

---

## 1. Where to find it

The panel is **hidden by default** for everyone. To show it in your own browser, open
**Preferences → Admin** and check **Show Line Watchdog panel**, then click **Save**.

Once shown, open any log file tab. On the right-hand inspector rail (same column as **Selected
Line** and **Filter History**), you'll find a third panel: **Line Watchdog**.

```
┌───────────────────────────┐
│ Line Watchdog     [ ] Enabled
│ Disabled by default. Enable to track...
└───────────────────────────┘
```

This visibility setting is stored in your browser only (`localStorage`), so turning it on/off
only affects you — other users of LogWatcher never see the panel unless they enable it
themselves from their own Preferences.

## 2. How to activate / deactivate tracking

Click the **Enabled** checkbox in the panel header.

- **ON**: the watchdog starts listening to incoming lines for the file tab you currently have
  selected (the "active tab"), and starts checking every 5 seconds whether lines are still arriving.
- **OFF**: all tracking stops immediately, no data is collected.

The setting is stored in your browser (`localStorage`), so it stays on/off across page reloads —
but it is **per-browser**, not shared with other users, and is off again if you clear site data.

Each open tab is tracked independently once enabled — the panel always shows the stats for the
tab you're currently viewing.

## 3. Reading the results

Once enabled, the panel shows:

| Field | Meaning |
|---|---|
| **Status pill** | `OK` (green), `STALLED` (red — no new lines for 15+ seconds while tailing), or `GAP DETECTED` (red — a line number was skipped) |
| Lines seen | Total lines received by this tab since the watchdog was enabled |
| Last content line # | The highest sequence number seen so far (parsed from the line text) |
| Last received | Time the last line arrived |
| Gaps | How many times a skipped number was detected |
| Stalls | How many times the "no new lines" timeout was triggered |

Below the stats is a scrollable **event list** (most recent first), e.g.:

```
10:42:03  Expected content line #4521, got #4523 (1 line(s) missing)
10:41:10  No new lines received for 18s while tailing
10:40:55  Line flow resumed after a stall
```

A `OnReload` (file rolled/truncated) event resets the expected sequence and is logged as
informational — it is not counted as a gap or a stall, since a rotated file is expected to look
"different" for a moment.

## 4. Exporting results

Click **Export JSON** to download a snapshot of everything tracked so far (all sessions, full
event history) as a `.json` file. Useful for attaching to a bug report or comparing against the
server-side logs described below.

## 5. Server-side logs to check

Every anomaly (gap/stall) detected in the browser is also sent to the backend and written to its
own log file, so it survives even if you close the tab before exporting:

| Log file | What it contains |
|---|---|
| `LogWatcher.Web/logs/client-watchdog-{date}.log` | Every gap/stall reported by any browser, with session id, server id, file path, and details |
| `LogWatcher.Web/logs/tail-diag-{date}.log` | Backend-side tailing diagnostics (SMB tail loop, agent push handling, possible gaps/overlaps detected server-side) |
| `LogWatcher.Agent/logs/agent-diag-{date}.log` | Agent-side file-watching diagnostics (only present on machines running `LogWatcher.Agent`) — file size/position/lines-read per poll, connection info |

If the frontend shows a **gap**, but `tail-diag` shows no corresponding gap warning, the line was
most likely lost **before** it ever reached the backend (agent side or network). If `tail-diag`
*also* shows a gap/overlap warning around the same timestamp, the issue is on the backend's read
path. Cross-reference timestamps across the three logs above to narrow it down.

## 6. Using it with the AutoLogGen Soak Test

`AutoLogGen` (the WPF test-log generator) has a **Soak Test** mode designed to run for many hours
unattended and stress-test exactly the scenarios this watchdog looks for:

1. Open `AutoLogGen`, point it at the file your LogWatcher tab will be watching.
2. Fill in the Soak Test parameters (duration, burst cadence, simulated file-roll cadence, idle
   pause cadence/length) and click **Start Soak Test**.
3. In the browser, open that file's tab and enable the **Line Watchdog**.
4. Leave both running. `AutoLogGen` writes its own `autoLogGen/soak-schedule.log` recording every
   burst/roll/idle window with timestamps and line numbers — use it to tell apart an *intentional*
   idle window (expected stall) from a *real* stuck-viewer bug.
5. After the run (or if something looks wrong), compare:
   - `autoLogGen/soak-schedule.log` (what AutoLogGen actually did)
   - The Line Watchdog panel / its Export JSON (what the browser observed)
   - `logs/client-watchdog-{date}.log`, `logs/tail-diag-{date}.log`, `logs/agent-diag-{date}.log`
     (what the backend/agent observed)

## 7. Should I turn this off when I'm done testing?

You can, but it's not required — the watchdog is designed to be safely left in the codebase and
just switched off (unchecked) when not needed. It has no effect on normal log viewing while
disabled, and enabling it briefly on a production tab you're worried about is a normal, low-cost
way to double-check that lines are flowing correctly.
