# iOS-style Training and Insights navigation

## Build
- Replace the combined home/progress layout with two primary tabs in a persistent bottom toolbar: **Training** and **Insights**.
- Keep all three exercises on Training, with a compact app header and native-feeling spacing.
- Move streaks, daily goal, weekly activity, and all-time statistics into a dedicated Insights page.
- Keep the toolbar visible and usable throughout the two main pages; exercise screens retain a clear Back control.

## Technical details
- Manage the selected tab and exercise mode in the existing page without changing practice tracking or storage.
- Reuse the current statistics data and controls, adapting their presentation from a modal into a full page.
- Use the existing semantic colors, icons, and shared button component; add safe-area spacing for phone home indicators.
- Verify desktop and phone layouts plus tab and Back interactions.
