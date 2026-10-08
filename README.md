![Project screenshot](./screenshot.png)

# Cron Expression Builder

Build a five-field cron expression, check its syntax as you edit, read a plain-language explanation, and see the next matching run times in your local timezone. The tool works entirely in the browser and does not require an account or server.

**Live app:** [https://a2rp.github.io/cron-expression-builder/](https://a2rp.github.io/cron-expression-builder/)

## How to use it

Choose one of the quick schedules or edit the five fields directly. You can also type or paste a complete expression into the main expression box. The field controls and expression box stay in sync. Copy the valid expression with the copy button beside it.

When the expression is valid, the builder shows a short explanation and the preview lists the next five occurrences. If the expression is invalid, an inline message identifies the problem and the preview waits for a valid schedule. The preview searches up to 366 days ahead. When no occurrence is found during that period, it explains that limit.

## Cron field order

The expression has five space-separated fields, in this order:

| Field        | Accepted values       | Example   |
| ------------ | --------------------- | --------- |
| Minute       | 0 to 59               | `*/15`    |
| Hour         | 0 to 23               | `9`       |
| Day of month | 1 to 31               | `1,15`    |
| Month        | 1 to 12 or JAN to DEC | `JAN,MAR` |
| Day of week  | 0 to 7 or SUN to SAT  | `MON-FRI` |

The supported operators are `*` for all values, commas for lists, ascending hyphen ranges, and `/` for steps. For example, `*/15 9-17 * JAN,MAR MON-FRI` runs every 15 minutes from 9 AM through 5 PM on weekdays in January and March. Month and weekday names are case-insensitive. Both `0` and `7` mean Sunday.

When both day of month and day of week are restricted, the schedule matches either field, following common cron behavior. Ranges must move from a smaller value to a larger value. The app uses five-field cron syntax and does not support seconds or Quartz-only tokens such as `?`, `L`, or `#`.

## What is included

- A fixed header with smooth links to the editor and upcoming runs, plus a repository link.
- Seven ready-to-use schedules: every minute, every 15 minutes, every hour, daily at 9 AM, weekdays at 9 AM, Mondays at 9 AM, and the first day of each month at 9 AM.
- A direct expression editor and five field-level inputs for minute, hour, day of month, month, and weekday.
- Live syntax validation for field counts, values, lists, ranges, and steps.
- A plain-language explanation for common schedules and a readable field-by-field description for other valid expressions.
- A copy action for the current expression, with feedback when it succeeds or the browser clipboard is unavailable.
- A preview of the next five run times and the device's local timezone.
- A footer with the repository, portfolio, social, email, and support links, plus a back-to-top button after scrolling 50 pixels.

## Data and time behavior

Expressions are held in React state in the current page. They are not saved, sent to a server, or restored after a refresh. Upcoming runs use the device's local date and timezone. If the cron service that will run the schedule uses a different timezone, its displayed run times may differ. The preview uses a bounded 366-day search window and does not account for a hosting service's own cron extensions or restrictions.

## Run locally

```sh
npm install
npm run dev
```

## Check and deploy

```sh
npm run lint
npm test
npm run build
npm run deploy
```

The deploy command builds the app and publishes the `dist` folder to the `gh-pages` branch. The live site is [https://a2rp.github.io/cron-expression-builder/](https://a2rp.github.io/cron-expression-builder/).

## Future improvements

These are ideas that are not implemented yet:

- Add a timezone selector and compare the same schedule across timezones.
- Add syntax support for popular scheduler-specific extensions.
- Save named schedules in local storage and export them as JSON.
- Add a calendar view for reviewing longer schedule patterns.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
